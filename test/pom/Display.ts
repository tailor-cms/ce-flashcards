import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly root: Locator;
  readonly card: Locator;
  readonly prevBtn: Locator;
  readonly nextBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.root = this.editor.locator('.tce-flashcards-root');
    this.card = this.root.locator('.flip-card');
    this.prevBtn = this.editor.getByRole('button', { name: 'Previous card' });
    this.nextBtn = this.editor.getByRole('button', { name: 'Next card' });
  }

  counter(current: number, total: number): Locator {
    return this.root.getByText(`${current} / ${total}`);
  }

  face(key: 'front' | 'back'): Locator {
    return this.root.locator(`.flip-card-face-${key}`);
  }
}
