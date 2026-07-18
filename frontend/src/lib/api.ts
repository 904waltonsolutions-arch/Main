export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  packageInterest: string;
  message: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "";

export async function submitContact(payload: ContactPayload): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = "Something went wrong. Please try again.";
    try {
      const data = await res.json();
      if (data?.title) detail = data.title;
    } catch {
      // ignore parse errors, use default message
    }
    throw new Error(detail);
  }
}
