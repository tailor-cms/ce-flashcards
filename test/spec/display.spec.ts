import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Display } from '../pom';

const ELEMENT_ID = 'test-flashcards-display';

const deck = (count: number) => ({
  embeds: {},
  items: Object.fromEntries(
    Array.from({ length: count }, (_, i) => {
      const id = String.fromCharCode(97 + i);
      return [id, { id, front: {}, back: {}, position: i + 1 }];
    }),
  ),
  height: 300,
});

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.resetState(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Default state', () => {
  test('Renders the flip card', async ({ page }) => {
    const display = new Display(page);
    await expect(display.card).toBeVisible();
  });
});

test.describe('Flip interaction', () => {
  test('Flips the card on click', async ({ page }) => {
    const display = new Display(page);
    await expect(display.card).not.toHaveClass(/is-flipped/);
    await display.card.click();
    await expect(display.card).toHaveClass(/is-flipped/);
  });
});

test.describe('Face content routing', () => {
  test('Renders each face content on the correct side', async ({ page }) => {
    // The runtime's EmbeddedContainer renders `embed.data.content` verbatim,
    // so distinct text per face proves both rendering and front/back routing.
    await elementClient.update(ELEMENT_ID, {
      embeds: {
        f1: {
          id: 'f1',
          data: { content: 'Front content' },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        },
        b1: {
          id: 'b1',
          data: { content: 'Back content' },
          embedded: true,
          position: 1,
          type: 'TIPTAP_HTML',
        },
      },
      items: {
        a: { id: 'a', front: { f1: true }, back: { b1: true }, position: 1 },
      },
      height: 300,
    });
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.face('front')).toContainText('Front content');
    await expect(display.face('front')).not.toContainText('Back content');
    await expect(display.face('back')).toContainText('Back content');
    await expect(display.face('back')).not.toContainText('Front content');
  });
});

test.describe('Navigation', () => {
  test('Hides navigation for a single-card deck', async ({ page }) => {
    await elementClient.update(ELEMENT_ID, deck(1));
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.card).toBeVisible();
    await expect(display.nextBtn).not.toBeVisible();
  });

  test('Shows and advances navigation for a multi-card deck', async ({
    page,
  }) => {
    await elementClient.update(ELEMENT_ID, deck(3));
    await page.reload({ waitUntil: 'networkidle' });
    const display = new Display(page);
    await expect(display.counter(1, 3)).toBeVisible();
    await display.nextBtn.click();
    await expect(display.counter(2, 3)).toBeVisible();
  });
});
