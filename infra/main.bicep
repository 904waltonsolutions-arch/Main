// Walton Solutions – low-cost Azure infrastructure.
//
// Provisions:
//   * Azure SQL Server + Database (Basic tier, ~lowest cost relational option)
//   * App Service Plan (Linux) + Web App for the .NET 8 API
//   * Static Web App (Free tier) for the Next.js marketing site
//
// Deploy:
//   az group create -n walton-rg -l eastus
//   az deployment group create -g walton-rg -f infra/main.bicep \
//     -p sqlAdminPassword='<strong-password>' emailPassword='<smtp-app-password>'

@description('Base name used to derive resource names.')
param baseName string = 'waltonsolutions'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('SQL administrator login name.')
param sqlAdminLogin string = 'waltonadmin'

@secure()
@description('SQL administrator password.')
param sqlAdminPassword string

@description('App Service Plan SKU. B1 is cheapest always-on; use F1 for a free (limited) tier.')
param appServiceSku string = 'B1'

@description('SMTP host for outbound contact-form email.')
param emailHost string = 'smtp.gmail.com'

@description('SMTP username (e.g. the Gmail address).')
param emailUsername string = ''

@secure()
@description('SMTP password / app password.')
param emailPassword string = ''

@description('Destination inbox for contact-form notifications.')
param contactToEmail string = '904Waltonsolutions@gmail.com'

var uniqueSuffix = uniqueString(resourceGroup().id)
var sqlServerName = toLower('${baseName}-sql-${uniqueSuffix}')
var sqlDbName = '${baseName}Db'
var planName = '${baseName}-plan'
var apiAppName = toLower('${baseName}-api-${uniqueSuffix}')
var staticSiteName = '${baseName}-web'

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    minimalTlsVersion: '1.2'
    publicNetworkAccess: 'Enabled'
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2023-08-01-preview' = {
  parent: sqlServer
  name: sqlDbName
  location: location
  sku: {
    name: 'Basic'
    tier: 'Basic'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
}

// Allow other Azure services (e.g. the Web App) to reach SQL.
resource allowAzure 'Microsoft.Sql/servers/firewallRules@2023-08-01-preview' = {
  parent: sqlServer
  name: 'AllowAllAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: {
    name: appServiceSku
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  properties: {
    serverFarmId: plan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'DOTNETCORE|8.0'
      alwaysOn: appServiceSku != 'F1'
      ftpsState: 'Disabled'
      connectionStrings: [
        {
          name: 'DefaultConnection'
          type: 'SQLAzure'
          connectionValue: 'Server=tcp:${sqlServer.properties.fullyQualifiedDomainName},1433;Database=${sqlDbName};User ID=${sqlAdminLogin};Password=${sqlAdminPassword};Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;'
        }
      ]
      appSettings: [
        { name: 'ASPNETCORE_ENVIRONMENT', value: 'Production' }
        { name: 'Database__MigrateOnStartup', value: 'true' }
        { name: 'Email__Enabled', value: 'true' }
        { name: 'Email__Host', value: emailHost }
        { name: 'Email__Port', value: '587' }
        { name: 'Email__UseStartTls', value: 'true' }
        { name: 'Email__Username', value: emailUsername }
        { name: 'Email__Password', value: emailPassword }
        { name: 'Email__FromEmail', value: contactToEmail }
        { name: 'Email__FromName', value: 'Walton Solutions Website' }
        { name: 'Email__ToEmail', value: contactToEmail }
      ]
    }
  }
}

resource staticSite 'Microsoft.Web/staticSites@2023-12-01' = {
  name: staticSiteName
  location: location
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {}
}

output apiUrl string = 'https://${apiApp.properties.defaultHostName}'
output staticSiteName string = staticSite.name
output sqlServerFqdn string = sqlServer.properties.fullyQualifiedDomainName
