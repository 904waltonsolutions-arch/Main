using Microsoft.Extensions.DependencyInjection;
using WaltonSolutions.Application.Contacts;

namespace WaltonSolutions.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IContactService, ContactService>();
        return services;
    }
}
