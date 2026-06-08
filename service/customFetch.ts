import { headers } from "next/headers";

/**
 * A wrapper around the global fetch that automatically injects the
 * X-Tenant-Slug header into the request if it is available in the Next.js context.
 */
export const customFetch = async (
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<Response> => {
  let tenantSlug: string | null = null;
  try {
    const headersList = await headers();
    tenantSlug = headersList.get("x-tenant-slug");
  } catch (error) {
    // headers() might throw outside of request context (like statically generated pages)
    console.warn("Could not retrieve next/headers for tenant slug.", error);
  }

  const modifiedInit: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      ...(tenantSlug ? { "X-Tenant-Slug": tenantSlug } : {}),
    },
  };

  return fetch(input, modifiedInit);
};
