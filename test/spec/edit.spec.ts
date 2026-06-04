import { expect, test } from '@playwright/test';
import { elementClient } from '@tailor-cms/cek-e2e';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-flashcards-edit';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test.describe('Initial render', () => {
  test('Renders 2 cards by default', async ({ page }) => {
    const edit = new Edit(page);
    await expect(edit.cards).toHaveCount(2);
    await expect(edit.cardAt(0)).toContainText('Card 1');
    await expect(edit.cardAt(1)).toContainText('Card 2');
    await expect(edit.addCardBtn).toBeVisible();
  });
});

test.describe('Card management', () => {
  test('Adds a new card', async ({ page }) => {
    const edit = new Edit(page);
    await edit.addCardBtn.click();
    await expect(edit.cards).toHaveCount(3);
    await expect(edit.cardAt(2)).toContainText('Card 3');
  });

  test('Deletes a card', async ({ page }) => {
    const edit = new Edit(page);
    await edit.cardHeader(0).hover();
    await edit.deleteBtn(0).click();
    await edit.confirmationDialog
      .getByRole('button', { name: 'Confirm' })
      .click();
    await expect(edit.cards).toHaveCount(1);
  });
});

test.describe('Readonly mode', () => {
  test('Hides add/delete controls', async ({ page }) => {
    const edit = new Edit(page);
    await edit.setReadonly();
    await expect(edit.addCardBtn).not.toBeVisible();
    await edit.cardHeader(0).hover();
    await expect(edit.deleteBtn(0)).not.toBeVisible();
  });
});
