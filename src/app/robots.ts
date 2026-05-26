import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/superadmin/', '/dashboard/', '/api/'],
    },
    sitemap: 'https://ittaacademy.com/sitemap.xml',
  }
}
