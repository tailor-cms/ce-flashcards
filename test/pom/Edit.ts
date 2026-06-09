import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly root: Locator;
  readonly cards: Locator;
  readonly addCardBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.v-expansion-panels');
    this.cards = this.root.locator('.v-expansion-panel');
    this.addCardBtn = this.editor.getByRole('button', { name: 'Add Card' });
  }

  cardAt(index: number): Locator {
    return this.cards.nth(index);
  }

  cardHeader(index: number): Locator {
    return this.cardAt(index).locator('.v-expansion-panel-title');
  }

  deleteBtn(index: number): Locator {
    return this.cardHeader(index).getByRole('button', {
      name: 'Delete card',
      exact: true,
    });
  }
}
