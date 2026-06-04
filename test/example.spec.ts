import { expect, test } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('Renders the deck editor with two starter cards', async ({ page }) => {
  const editPanel = new pom.EditPanel(page);
  await editPanel.persistFocus();
  await expect(editPanel.editor).toBeVisible();
  await expect(editPanel.editor.getByText('Flashcards')).toBeVisible();
  await expect(editPanel.editor.getByText('Card 1')).toBeVisible();
  await expect(editPanel.editor.getByText('Card 2')).toBeVisible();
  await expect(
    editPanel.editor.getByRole('button', { name: 'Add Card' }),
  ).toBeVisible();
});

test('Renders the Display deck with a flippable card', async ({ page }) => {
  const displayPanel = new pom.DisplayPanel(page);
  await expect(displayPanel.editor).toBeVisible();
  // Front face and the deck position counter are shown by default.
  await expect(displayPanel.editor.getByText('Front')).toBeVisible();
  await expect(displayPanel.editor.getByText('1 / 2')).toBeVisible();
});

test('Renders server state panel', async ({ page }) => {
  const bottomPanel = new pom.BottomPanel(page);
  await expect(bottomPanel.el).toBeVisible();
  await bottomPanel.authoringTab.click();
  const properties = ['uid', 'type', 'meta', 'data', 'contentId'];
  for (const prop of properties) {
    await expect(bottomPanel.authoringWindow.getByText(prop)).toBeVisible();
  }
});
