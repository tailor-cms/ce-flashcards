<!-- eslint-disable vue/no-undef-components -->
<template>
  <div class="tce-flashcards-root">
    <VEmptyState
      v-if="!cardCount"
      class="pa-8"
      icon="mdi-cards-outline"
      text="This deck doesn't have any cards to study."
      title="No flashcards yet"
    />
    <template v-else>
      <div
        :class="{ 'is-flipped': isFlipped }"
        :style="{ height: `${cardHeight}px` }"
        class="flip-card mx-auto"
        role="button"
        tabindex="0"
        @click="flip"
        @keydown.enter="flip"
        @keydown.space.prevent="flip"
      >
        <div class="flip-card-inner">
          <VSheet
            v-for="face in faces"
            :key="face.key"
            :class="`flip-card-face flip-card-face-${face.key}`"
            class="d-flex flex-column px-8 py-6"
            rounded="lg"
          >
            <div class="flip-card-body flex-grow-1">
              <VEmptyState
                v-if="!face.embeds.length"
                :title="`The ${face.label.toLowerCase()} is empty`"
                icon="mdi-card-text-outline"
                text="There's no content on this side of the card."
              />
              <TailorEmbeddedContainer v-else :elements="face.embeds" />
            </div>
          </VSheet>
        </div>
      </div>
      <div
        v-if="cardCount > 1"
        class="d-flex align-center justify-center ga-4 mt-2"
      >
        <VBtn
          :disabled="currentIndex === 0"
          aria-label="Previous card"
          density="comfortable"
          icon="mdi-chevron-left"
          variant="text"
          @click="go(-1)"
        />
        <span class="text-label-large">
          {{ currentIndex + 1 }} / {{ cardCount }}
        </span>
        <VBtn
          :disabled="currentIndex === cardCount - 1"
          aria-label="Next card"
          density="comfortable"
          icon="mdi-chevron-right"
          variant="text"
          @click="go(1)"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  Element,
  FlashcardItem,
} from '@tailor-cms/ce-flashcards-manifest';
import { sortBy } from 'lodash-es';

const props = defineProps<{ element: Element; userState: any }>();

const currentIndex = ref(0);
const isFlipped = ref(false);

const cards = computed<FlashcardItem[]>(() =>
  sortBy(props.element.data.items, 'position'),
);
const cardCount = computed(() => cards.value.length);
const cardHeight = computed(() => props.element.data.height ?? 360);

const faceEmbeds = (face: Record<string, any>) => {
  const { embeds } = props.element.data;
  return sortBy(
    Object.keys(face).map((id) => embeds[id]),
    'position',
  );
};

const faces = computed(() => {
  const card = cards.value[currentIndex.value];
  if (!card) return [];
  return [
    { key: 'front', label: 'Front', embeds: faceEmbeds(card.front) },
    { key: 'back', label: 'Back', embeds: faceEmbeds(card.back) },
  ];
});

const flip = () => {
  isFlipped.value = !isFlipped.value;
};

const go = (delta: number) => {
  const next = currentIndex.value + delta;
  if (next < 0 || next > cardCount.value - 1) return;
  isFlipped.value = false;
  currentIndex.value = next;
};
</script>

<style scoped>
.flip-card {
  perspective: 1500px;
  cursor: pointer;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.flip-card.is-flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  text-align: left;
}

.flip-card-face-back {
  transform: rotateY(180deg);
}

.flip-card-body {
  display: flex;
  flex-direction: column;
  justify-content: safe center;
  overflow-y: auto;
  font-size: 1.5rem;
  line-height: 1.3;
}
</style>
