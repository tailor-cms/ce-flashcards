import type * as common from '@tailor-cms/cek-common';

// A single flashcard. `front` and `back` are embed containers — each maps the
// ids of the content elements embedded on that face (mirrors the composite
// `body` pattern, one per face).
export interface FlashcardItem {
  id: string;
  front: Record<string, any>;
  back: Record<string, any>;
  position: number;
}

export interface ElementData extends common.ElementConfig {
  // Flat map of every embedded content element across all cards/faces.
  embeds: Record<string, any>;
  // The deck — keyed by card id.
  items: Record<string, FlashcardItem>;
  // Deck-wide display height (px) for the delivery flip card.
  height: number;
}

export type DataInitializer = common.DataInitializer<ElementData>;
export type Element = common.Element<ElementData>;
export type ElementManifest = common.ElementManifest<ElementData>;
