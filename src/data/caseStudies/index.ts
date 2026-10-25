import type { CaseStudy } from './types.ts';
import { princeOfWeb3 } from './princeOfWeb3.ts';
import { carizmaHotels } from './carizmaHotels.ts';
import { scribe } from './scribe.ts';
import { alexHydrate } from './alexHydrate.ts';
import { balanceWellness } from './balanceWellness.ts';
import { netrovert } from './netrovert.ts';

export * from './types.ts';
export { princeOfWeb3, carizmaHotels, scribe, alexHydrate, balanceWellness, netrovert };

export const CASE_STUDIES: CaseStudy[] = [
  princeOfWeb3,
  carizmaHotels,
  scribe,
  alexHydrate,
  balanceWellness,
  netrovert,
];
