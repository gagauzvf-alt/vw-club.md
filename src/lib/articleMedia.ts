import type { Locale } from './i18n';

export interface ArticleMediaItem {
  src: string;
  alt: Record<Locale, string>;
  caption?: Record<Locale, string>;
  credit?: string;
}

const photo = (src: string, ru: string, ro: string): ArticleMediaItem => ({
  src: `/images/articles/${src}.webp`,
  alt: { ru, ro },
  credit: 'Фото: VW Club Moldova',
});

export const articleMedia: Record<string, ArticleMediaItem[]> = {
  'passat-b8-proverka-pered-pokupkoy': [
    photo('vw_passat_b8_2.0tdi_2018_01', 'Volkswagen Passat B8 2.0 TDI 2018', 'Volkswagen Passat B8 2.0 TDI din 2018'),
    photo('vw_passat_b8_2.0tdi_2018_02', 'Passat B8, дополнительный ракурс', 'Passat B8, vedere suplimentară'),
  ],
  'golf-7-dsg-chto-utochnit': [
    photo('vw_golf_2013', 'Volkswagen Golf 7 2013', 'Volkswagen Golf 7 din 2013'),
    photo('vw_golf_2013_01', 'Volkswagen Golf 7, вид сбоку', 'Volkswagen Golf 7, vedere laterală'),
    photo('vw_golf_2013_02', 'Volkswagen Golf 7, дополнительный ракурс', 'Volkswagen Golf 7, vedere suplimentară'),
    photo('vw_golf_2015', 'Volkswagen Golf 7 2015', 'Volkswagen Golf 7 din 2015'),
    photo('vw_golf_2015_02', 'Volkswagen Golf 7 2015, вид сзади', 'Volkswagen Golf 7 din 2015, vedere din spate'),
    photo('vw_golf_gte_2015', 'Volkswagen Golf GTE 2015', 'Volkswagen Golf GTE din 2015'),
  ],
  'tiguan-2-poryadok-diagnostiki': [
    photo('vw_tiguan_2017', 'Volkswagen Tiguan II 2017', 'Volkswagen Tiguan II din 2017'),
    photo('vw_tiguan_2017_02', 'Volkswagen Tiguan II, дополнительный ракурс', 'Volkswagen Tiguan II, vedere suplimentară'),
    photo('vw_tiguan_se_2018_usa_01', 'Volkswagen Tiguan SE 2018, версия для США', 'Volkswagen Tiguan SE 2018, versiune SUA'),
    photo('vw_tiguan_se_2018_usa_02', 'Volkswagen Tiguan SE 2018, вид сзади', 'Volkswagen Tiguan SE 2018, vedere din spate'),
  ],
  'transporter-proverka-pered-pokupkoy': [
    photo('vw_transporter_01', 'Volkswagen Transporter', 'Volkswagen Transporter'),
    photo('vw_transporter_02', 'Volkswagen Transporter, задняя часть кузова', 'Volkswagen Transporter, partea din spate'),
  ],
  'touareg-ii-3-0-tdi-diagnostika': [
    photo('vw_toareg_3.0tdi_2011_01', 'Volkswagen Touareg II 3.0 TDI 2011', 'Volkswagen Touareg II 3.0 TDI din 2011'),
    photo('vw_toareg_3.0tdi_2011_02', 'Touareg II 3.0 TDI, дополнительный ракурс', 'Touareg II 3.0 TDI, vedere suplimentară'),
  ],
  'tiguan-i-2-0-tsi-usa-proverka': [
    photo('vw_tiguan_2012_2.0tsi_usa_01', 'Volkswagen Tiguan I 2.0 TSI 2012 из США', 'Volkswagen Tiguan I 2.0 TSI 2012 din SUA'),
    photo('vw_tiguan_2012_2.0tsi_usa_02', 'Tiguan I, вид сзади', 'Tiguan I, vedere din spate'),
    photo('vw_tiguan_2012_2.0tsi_usa_03', 'Tiguan I, салон и комплектация', 'Tiguan I, interior și echipare'),
  ],
  't-roc-2019-proverka-pered-pokupkoy': [
    photo('vw_t-roc_2019', 'Volkswagen T-Roc 2019', 'Volkswagen T-Roc din 2019'),
    photo('vw_t-roc_2019_02', 'Volkswagen T-Roc, вид сбоку', 'Volkswagen T-Roc, vedere laterală'),
    photo('vw_t-roc_2019_03', 'Volkswagen T-Roc, задняя часть', 'Volkswagen T-Roc, partea din spate'),
  ],
  'jetta-vi-2018-proverka': [
    photo('vw_jetta_2018', 'Volkswagen Jetta VI 2018', 'Volkswagen Jetta VI din 2018'),
    photo('vw_jetta_2018_2', 'Volkswagen Jetta VI, дополнительный ракурс', 'Volkswagen Jetta VI, vedere suplimentară'),
  ],
  'golf-6-r-2013-proverka': [
    photo('vw_golf6_r_2013_01', 'Volkswagen Golf 6 R 2013', 'Volkswagen Golf 6 R din 2013'),
  ],
  'scirocco-iii-2009-proverka': [
    photo('vw_scirocco_2009_01', 'Volkswagen Scirocco III 2009', 'Volkswagen Scirocco III din 2009'),
    photo('vw_scirocco_2009_02', 'Volkswagen Scirocco III, дополнительный ракурс', 'Volkswagen Scirocco III, vedere suplimentară'),
  ],
  'amarok-dizel-proverka': [
    photo('vw_amarok3.0tdi2018__01', 'Volkswagen Amarok 3.0 TDI 2018', 'Volkswagen Amarok 3.0 TDI din 2018'),
    photo('vw_amarok3.0tdi2018__02', 'Amarok 3.0 TDI, дополнительный ракурс', 'Amarok 3.0 TDI, vedere suplimentară'),
    photo('vw_amarok_2.0tdi_2012', 'Volkswagen Amarok 2.0 TDI 2012', 'Volkswagen Amarok 2.0 TDI din 2012'),
  ],
};

export const mediaForArticle = (id: string) => articleMedia[id] ?? [];
