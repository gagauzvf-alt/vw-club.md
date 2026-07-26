# SEO, GEO, AI Search и Schema.org

Актуально: 2026-07-26.

## Реализовано

- canonical на `https://vw-club.md`;
- RU/RO hreflang и x-default;
- sitemap без draft и 404;
- robots.txt;
- Open Graph и Twitter Card;
- уникальные H1/title/description;
- визуальные и JSON-LD breadcrumbs;
- связанный `@graph` со стабильными ID `/#organization`, `/#website`, `/#logo`;
- `Organization`, `WebSite`, `WebPage`/`CollectionPage`, `Article`, `ImageObject`, `BreadcrumbList`;
- 404: `noindex, follow`, без JSON-LD.

Клуб описывается как независимая `Organization`, не как подразделение Volkswagen AG и не как автосервис. Неподтверждённые `Person`, `Review`, `AggregateRating`, `FAQPage`, `SearchAction`, адрес и статистика не создаются.

## Проверка

После `npm run build`:

- `npm run audit:seo`;
- `npm run audit:schema`.

Эталон 2026-07-26: 23 HTML, 22 sitemap URL, 0 SEO-ошибок, 0 broken links, 22 страницы с валидным JSON-LD, 404 без JSON-LD. Пять длинных title отмечены предупреждениями.

## Для GEO/AI

Пишите прямые определения, указывайте модель/поколение, отделяйте подтверждённое от гипотезы, связывайте статью с модельной страницей и не создавайте ложный опыт автора.
