import type { AiConfig } from '@tailor-cms/cek-common';
import { v4 as uuid } from 'uuid';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

const id1 = uuid();
const id2 = uuid();

// Element unique id within the target system (e.g. Tailor)
export const type = 'FLASHCARDS';

// Display name (e.g. shown to the author)
export const name = 'Flashcards';

// Function which inits element state (data property on the Content Element
// entity). A deck starts with two empty cards.
export const initState: DataInitializer = (): ElementData => ({
  embeds: {},
  items: {
    [id1]: { id: id1, front: {}, back: {}, position: 1 },
    [id2]: { id: id2, front: {}, back: {}, position: 2 },
  },
  height: 360,
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-cards-outline',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

// A deck is empty when it has no cards.
export const isEmpty = (data: ElementData): boolean =>
  !data.items || Object.keys(data.items).length === 0;

export const ai: AiConfig = {
  Schema: {
    type: 'json_schema',
    name: 'ce_flashcards',
    schema: {
      type: 'object',
      properties: {
        cards: {
          type: 'array',
          minItems: 2,
          items: {
            type: 'object',
            properties: {
              front: { type: 'string' },
              back: { type: 'string' },
            },
            required: ['front', 'back'],
            additionalProperties: false,
          },
        },
      },
      required: ['cards'],
      additionalProperties: false,
    },
  },
  getPrompt: (): string => `
    Generate a flashcards content element as an object with the following
    properties:
    {
      "cards": [
        {
          "front": "",
          "back": ""
        }
      ]
    }
    where:
      - 'cards' is an array of flashcard objects where:
        - 'front' is the prompt side of the card (e.g. a question or term).
        - 'back' is the answer side of the card (e.g. the answer or definition).
  `,
  processResponse: (val: any): Record<string, any> => {
    const deck = val.cards.reduce(
      (
        acc: Record<string, any>,
        { front, back }: { front: string; back: string },
        index: number,
      ) => {
        const frontId = uuid();
        const backId = uuid();
        const itemId = uuid();
        acc.embeds[frontId] = {
          id: frontId,
          data: { content: front },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        };
        acc.embeds[backId] = {
          id: backId,
          data: { content: back },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        };
        acc.items[itemId] = {
          id: itemId,
          front: { [frontId]: true },
          back: { [backId]: true },
          position: index + 1,
        };
        return acc;
      },
      { items: {}, embeds: {} },
    );
    return { ...deck, height: 360 };
  },
};

const manifest: ElementManifest = {
  type,
  version,
  name,
  isComposite: true,
  ssr: false,
  initState,
  isEmpty,
  ui,
  ai,
};

export default manifest;
export * from './interfaces';
