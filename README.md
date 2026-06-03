# Flashcards

Flashcards content element — a deck of two-sided cards learners flip through to
review prompts and answers.

**Type:** `FLASHCARDS`

> **Scaffold:** the package is wired for CEK v2, but the Edit and Display
> components are still the template placeholders. Implement the card-deck UI and
> fill in the **Data** table below as you build it out.

## Data

| Field | Type | Description |
|-------|------|-------------|
| _add card-deck fields here_ | | |

Only list fields that are meaningful to the element's behavior. Omit framework
internals like `assets` (the dual-URL storage map).

## Edit

- _author-facing card editor (to be implemented)_

## Display

- _learner-facing flip-card deck (to be implemented)_

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

## Documentation

- [xt Framework](https://tailor-cms.github.io/xt/introduction.html)
- [Edit](https://tailor-cms.github.io/xt/edit-package) · [Display](https://tailor-cms.github.io/xt/display-package) · [Server](https://tailor-cms.github.io/xt/server-package)
- [Manifest](https://tailor-cms.github.io/xt/manifest) · [Runtime](https://tailor-cms.github.io/xt/runtime) · [Testing](https://tailor-cms.github.io/xt/testing)
