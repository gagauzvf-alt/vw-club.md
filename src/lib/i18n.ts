export type Locale = 'ru' | 'ro';

export const LOCALES: Locale[] = ['ru', 'ro'];
export const DEFAULT_LOCALE: Locale = 'ru';

export const SITE = {
  name: 'VW Club Moldova',
  url: 'https://vw-club.md',
  fbGroup: 'https://www.facebook.com/share/g/14nvVh5H6BX/',
  fbPage: 'https://www.facebook.com/gaaaaadsdsd',
  instagram: 'https://www.instagram.com/vwclubmd/',
  clubMaps: 'https://maps.app.goo.gl/UTrkY24fdHKaHTSq5',
  partnerUrl: 'https://bravo-motors.md',
  partnerMaps: 'https://maps.app.goo.gl/fXY5Gn7yD1G5iJCv7',
};

export function localePrefix(locale: Locale): string {
  return locale === 'ru' ? '' : '/ro';
}

export function l(locale: Locale, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  const full = `${localePrefix(locale)}${p}`;
  return full.endsWith('/') ? full : `${full}/`;
}

export const t = {
  ru: {
    nav: { home: 'Главная', about: 'О клубе', journal: 'Статьи', models: 'Модели', partner: 'Сервис-партнёр' },
    heroSlogan: 'VW Club Moldova',
    heroSub: 'Техническое сообщество владельцев Volkswagen в Молдове.',
    ctaJoin: 'Перейти в Facebook-группу',
    ctaPartner: 'Сервис-партнёр клуба',
    latest: 'Новые материалы',
    allArticles: 'Все статьи',
    aboutTitle: 'Клуб и база знаний',
    partnerHeading: 'Техническая помощь для Volkswagen',
    readMore: 'Читать',
    journalTitle: 'Технические статьи',
    journalIntro: 'Проверки перед покупкой, эксплуатация, диагностика и обслуживание Volkswagen — спокойно и по существу.',
    filterAll: 'Все',
    modelPageTitle: (m: string) => `Volkswagen ${m}: статьи и технические заметки`,
    modelPageIntro: (m: string) => `Материалы клуба о Volkswagen ${m}: проверка, эксплуатация и обслуживание.`,
    modelsIndexTitle: 'Модели Volkswagen',
    articlesAbout: 'Статьи по модели',
    publishedOn: 'Опубликовано',
    disclaimer: 'Независимое сообщество владельцев. Не связано с Volkswagen AG.',
    partnerOfClub: 'Сервис-партнёр клуба',
    notFoundTitle: 'Страница не найдена',
    notFoundText: 'Адрес мог измениться. Перейдите к техническим материалам:',
    toJournal: 'К статьям',
    typeLabel: { проблемы: 'Типичные проблемы', обслуживание: 'Обслуживание', кейс: 'Кейс', гайд: 'Гайд' } as Record<string, string>,
  },
  ro: {
    nav: { home: 'Acasă', about: 'Despre club', journal: 'Articole', models: 'Modele', partner: 'Partener service' },
    heroSlogan: 'VW Club Moldova',
    heroSub: 'Comunitatea tehnică a proprietarilor Volkswagen din Moldova.',
    ctaJoin: 'Intră în grupul Facebook',
    ctaPartner: 'Partenerul service al clubului',
    latest: 'Materiale noi',
    allArticles: 'Toate articolele',
    aboutTitle: 'Club și bază de cunoștințe',
    partnerHeading: 'Asistență tehnică pentru Volkswagen',
    readMore: 'Citește',
    journalTitle: 'Articole tehnice',
    journalIntro: 'Verificare înainte de cumpărare, exploatare, diagnosticare și întreținere Volkswagen — clar și fără exagerări.',
    filterAll: 'Toate',
    modelPageTitle: (m: string) => `Volkswagen ${m}: articole și note tehnice`,
    modelPageIntro: (m: string) => `Materialele clubului despre Volkswagen ${m}: verificare, exploatare și întreținere.`,
    modelsIndexTitle: 'Modele Volkswagen',
    articlesAbout: 'Articole despre model',
    publishedOn: 'Publicat',
    disclaimer: 'Comunitate independentă de proprietari. Neafiliată cu Volkswagen AG.',
    partnerOfClub: 'Partenerul service al clubului',
    notFoundTitle: 'Pagina nu a fost găsită',
    notFoundText: 'Adresa s-ar fi putut schimba. Vezi materialele tehnice:',
    toJournal: 'La articole',
    typeLabel: { проблемы: 'Probleme tipice', обслуживание: 'Întreținere', кейс: 'Caz', гайд: 'Ghid' } as Record<string, string>,
  },
} as const;

export function modelSlug(model: string): string {
  return model.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
}

export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export interface Crumb { name: string; path: string; current?: boolean }
const labels = {
  ru: { home: 'Главная', models: 'Модели', journal: 'Статьи', about: 'О клубе', partner: 'Сервис-партнёр' },
  ro: { home: 'Acasă', models: 'Modele', journal: 'Articole', about: 'Despre club', partner: 'Partener service' },
};

export function buildBreadcrumbs(locale: Locale, path: string, crumbLabel?: string | null): Crumb[] {
  if (path === '/') return [];
  const x = labels[locale];
  const home = { name: x.home, path: l(locale, '/') };
  const dynamic = path.match(/^\/(models|zhurnal)\/([^/]+)\/$/);
  if (dynamic) {
    const section = dynamic[1] as 'models' | 'zhurnal';
    return [home, { name: x[section === 'zhurnal' ? 'journal' : 'models'], path: l(locale, `/${section}/`) }, { name: crumbLabel ?? dynamic[2], path: l(locale, path), current: true }];
  }
  const staticLabels: Record<string, string> = { '/models/': x.models, '/zhurnal/': x.journal, '/o-klube/': x.about, '/partner/': x.partner };
  return [home, { name: staticLabels[path] ?? crumbLabel ?? path, path: l(locale, path), current: true }];
}
