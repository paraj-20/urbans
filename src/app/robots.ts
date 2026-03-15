import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/settings/', '/api/'],
    },
    sitemap: 'https://urbans-clothing.vercel.app/sitemap.xml',
  };
}
