# @tailor-cms/ce-flashcards-display

End-user component for the **Flashcards** content element in [Tailor CMS](https://github.com/tailor-cms/author).

Renders the element as learners see it in published content.

## Installation

```sh
npm install @tailor-cms/ce-flashcards-display
```

## Usage

Content elements are normally registered with Tailor through the element
registry rather than imported directly, but the package can be consumed on its
own:

```ts
import { Display } from '@tailor-cms/ce-flashcards-display';
```

## Element

| Property | Value |
| --- | --- |
| Name | Flashcards |
| Type | `FLASHCARDS` |
| Icon | [`mdi-cards-outline`](https://pictogrammers.com/library/mdi/) |
| Composite | Yes |

## Packages

This element ships as four packages, published together from the
[`ce-flashcards`](https://github.com/tailor-cms/ce-flashcards) repository:

| Package | Role |
| --- | --- |
| [`@tailor-cms/ce-flashcards-manifest`](https://www.npmjs.com/package/@tailor-cms/ce-flashcards-manifest) | Shared element definition |
| [`@tailor-cms/ce-flashcards-edit`](https://www.npmjs.com/package/@tailor-cms/ce-flashcards-edit) | Authoring component |
| [`@tailor-cms/ce-flashcards-display`](https://www.npmjs.com/package/@tailor-cms/ce-flashcards-display) | End-user component |
| [`@tailor-cms/ce-flashcards-server`](https://www.npmjs.com/package/@tailor-cms/ce-flashcards-server) | Server-side module |

## Development

```sh
pnpm install
pnpm dev     # start the Content Element Kit runtime
pnpm build   # build all packages
pnpm test    # Playwright end-to-end suite
```

Changes are released with [changesets](https://github.com/changesets/changesets);
run `pnpm changeset` to record one.
