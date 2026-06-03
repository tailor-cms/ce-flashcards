import baseManifest from '@tailor-cms/ce-flashcards-manifest';
import type { ElementManifest } from '@tailor-cms/ce-flashcards-manifest';

import Display from './components/Display.vue';

const manifest: ElementManifest = {
  ...baseManifest,
  Display,
};

export default manifest;
export { Display };
