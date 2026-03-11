// src/lib/strapi.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://127.0.0.1:1337';

export async function fetchFromStrapi(path: string, options: RequestInit = {}) {
    try {
        const url = new URL(`/api${path}`, STRAPI_URL);
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // Used to cache if needed
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch from Strapi: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching from Strapi:', error);
    return null;
  }
}

// Example usage to fetch page content (e.g., hero, categories)
export async function fetchMensPageData() {
  // Populate the needed fields from Strapi Content-Type 'mens-page'
  const data = await fetchFromStrapi('/mens-page?populate=*');
  return data?.data?.attributes || null;
}

export async function fetchWomensPageData() {
  // Populate the needed fields from Strapi Content-Type 'womens-page'
  const data = await fetchFromStrapi('/womens-page?populate=*');
  return data?.data?.attributes || null;
}
