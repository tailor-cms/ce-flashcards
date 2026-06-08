# Flashcards

A deck of two-sided cards. Each card has a **front** and a **back**, and every
face is a container that can hold other content elements (rich text, images,
etc.). A composite element (`isComposite: true`) — the faces embed child
elements rather than storing plain text.

**Type:** `FLASHCARDS`

## Data

| Field | Type | Description |
|-------|------|-------------|
| `items` | `Record<string, FlashcardItem>` | The deck, keyed by card id. |
| `embeds` | `Record<string, Embed>` | Flat map of every embedded element across all cards/faces. |

Each `FlashcardItem` is `{ id, front, back, position }`, where `front` and
`back` are embed containers — maps of the embed ids placed on that face.

## Edit

- Reorderable list of cards (drag handle), each labelled `Card N`
- Per card, a **Front** and **Back** section, each an embedded-element
  container for adding/removing child content elements
- Add Card / delete card (delete confirmed via dialog; the last card can't be
  deleted)

## Display

- One card at a time, click (or Enter/Space) to flip front ↔ back
- Previous / Next navigation with a `current / total` position counter
- Flipping resets when moving to another card

## Development

Requires Node `>=24` and pnpm.

```sh
pnpm dev     # Preview :8080 | Edit :8010 | Display :8020 | Server :8030
pnpm build
pnpm lint
pnpm test
```

## Run with Docker

```sh
docker compose up
```
