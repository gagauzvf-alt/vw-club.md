import { SITE, type Locale, type Crumb } from '../i18n';

export type SchemaEntity = Record<string, unknown>;

export const SCHEMA_IDS = {
  organization: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  logo: `${SITE.url}/#logo`,
} as const;

export function canonicalUrl(locale: Locale, path: string): string {
  const localized = locale === 'ro' ? path : `/ru${path}`;
  return new URL(localized, SITE.url).href;
}

export function buildSiteGraph({
  locale,
  canonical,
  title,
  description,
  image,
  imageAlt,
  crumbs,
  pageType = 'WebPage',
  extra = [],
}: {
  locale: Locale;
  canonical: string;
  title: string;
  description: string;
  image?: string;
  imageAlt: string;
  crumbs: Crumb[];
  pageType?: string;
  extra?: SchemaEntity[];
}): SchemaEntity {
  const imageUrl = image ? new URL(image, SITE.url).href : null;
  const breadcrumbId = `${canonical}#breadcrumb`;
  const graph: SchemaEntity[] = [
    {
      '@type': 'Organization',
      '@id': SCHEMA_IDS.organization,
      name: SITE.name,
      url: `${SITE.url}/`,
      logo: { '@id': SCHEMA_IDS.logo },
      description: locale === 'ru'
        ? 'Независимое сообщество владельцев Volkswagen в Молдове.'
        : 'Comunitate independentă a proprietarilor de Volkswagen din Moldova.',
      areaServed: { '@type': 'Country', name: 'Moldova' },
      sameAs: [SITE.fbGroup, SITE.fbPage, SITE.instagram, SITE.clubMaps].filter(Boolean),
    },
    {
      '@type': 'ImageObject',
      '@id': SCHEMA_IDS.logo,
      url: `${SITE.url}/web-app-manifest-512x512.png`,
      contentUrl: `${SITE.url}/web-app-manifest-512x512.png`,
    },
    {
      '@type': 'WebSite',
      '@id': SCHEMA_IDS.website,
      url: `${SITE.url}/`,
      name: SITE.name,
      inLanguage: ['ru', 'ro'],
      publisher: { '@id': SCHEMA_IDS.organization },
    },
    {
      '@type': pageType,
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      inLanguage: locale,
      isPartOf: { '@id': SCHEMA_IDS.website },
      about: { '@id': SCHEMA_IDS.organization },
      ...(imageUrl ? { primaryImageOfPage: { '@id': `${canonical}#primaryimage` } } : {}),
      ...(crumbs.length ? { breadcrumb: { '@id': breadcrumbId } } : {}),
    },
    ...(imageUrl ? [{
      '@type': 'ImageObject',
      '@id': `${canonical}#primaryimage`,
      url: imageUrl,
      contentUrl: imageUrl,
      caption: imageAlt,
      representativeOfPage: true,
    }] : []),
    ...extra.map(({ ['@context']: _context, ...entity }) => entity),
    ...(crumbs.length ? [{
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: new URL(crumb.path, SITE.url).href,
      })),
    }] : []),
  ];

  return { '@context': 'https://schema.org', '@graph': graph };
}

export function serializeJsonLd(value: SchemaEntity): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
