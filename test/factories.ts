interface CardSpec {
  front?: string;
  back?: string;
}

type DeckData = {
  embeds: Record<string, unknown>;
  items: Record<string, unknown>;
  height: number;
};

const tiptapEmbed = (id: string, content: string) => ({
  id,
  data: { content },
  embedded: true,
  position: 1,
  type: 'TIPTAP_HTML',
});

export class Deck implements DeckData {
  [key: string]: unknown;
  embeds: Record<string, unknown> = {};
  items: Record<string, unknown> = {};
  height = 300;

  constructor(cards: number | CardSpec[] = 0) {
    const specs =
      typeof cards === 'number'
        ? Array.from({ length: cards }, () => ({}))
        : cards;
    specs.forEach((spec) => this.addCard(spec));
  }

  addCard(spec: CardSpec = {}): this {
    const position = Object.keys(this.items).length + 1;
    const front = tiptapEmbed(
      `${position}-front`,
      spec.front ?? `Front ${position}`,
    );
    const back = tiptapEmbed(
      `${position}-back`,
      spec.back ?? `Back ${position}`,
    );

    const item = {
      id: `${position}`,
      front: { [front.id]: true },
      back: { [back.id]: true },
      position,
    };

    Object.assign(this.embeds, { [front.id]: front, [back.id]: back });
    this.items[item.id] = item;
    return this;
  }
}
