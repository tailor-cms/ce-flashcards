<template>
  <div class="tce-flashcards text-center">
    <VExpansionPanels
      ref="panels"
      v-model="expanded"
      class="text-left"
      rounded="lg"
      flat
      multiple
    >
      <VExpandTransition v-if="!!cardCount" group>
        <FlashcardItem
          v-for="(item, index) in cards"
          :key="item.id"
          :allow-deletion="cardCount > 1"
          :embed-element-config="embedElementConfig"
          :embeds="embedsByFace[item.id]"
          :is-expanded="expanded.includes(item.id)"
          :is-focused="isFocused"
          :is-readonly="isReadonly"
          :item="item"
          :position="index + 1"
          @delete="deleteItem(item.id)"
          @save="saveItem($event)"
        />
      </VExpandTransition>
    </VExpansionPanels>
    <VBtn
      v-if="!isReadonly"
      class="mt-4"
      prepend-icon="mdi-plus"
      text="Add Card"
      variant="text"
      @click="addCard"
    />
  </div>
</template>

<script lang="ts" setup>
import { cloneDeep, isEqual, pick, pull, reduce, sortBy } from 'lodash-es';
import { computed, reactive, ref, watch } from 'vue';
import type { Element, ElementData } from '@tailor-cms/ce-flashcards-manifest';
import { useDraggable } from 'vue-draggable-plus';
import { v4 as uuid } from 'uuid';

import FlashcardItem from './FlashcardItem.vue';

const props = defineProps<{
  element: Element;
  embedElementConfig: any[];
  isDragged: boolean;
  isFocused: boolean;
  isReadonly: boolean;
}>();
const emit = defineEmits<{
  save: [data: ElementData];
}>();

const expanded = ref<string[]>([]);
const elementData = reactive<ElementData>(cloneDeep(props.element.data));
const panels = ref();

const cards = computed({
  get: () => sortBy(elementData.items, 'position'),
  set: (reordered) => {
    reordered.forEach(({ id }, i) => (elementData.items[id].position = i + 1));
    emit('save', elementData);
  },
});
const cardCount = computed(() => cards.value.length);
const embedsByFace = computed(() =>
  reduce(
    elementData.items,
    (acc, { id, back, front }) => {
      acc[id] = {
        front: pick(elementData.embeds, Object.keys(front)),
        back: pick(elementData.embeds, Object.keys(back)),
      };
      return acc;
    },
    {} as any,
  ),
);

const saveItem = ({ item, embeds = {} }: any) => {
  elementData.items[item.id] = item;
  Object.assign(elementData.embeds, embeds);
  emit('save', elementData);
};

const deleteItem = (id: string) => {
  const { front, back } = elementData.items[id];
  [...Object.keys(front), ...Object.keys(back)].forEach(
    (embedId) => delete elementData.embeds[embedId],
  );
  delete elementData.items[id];
  if (expanded.value.includes(id)) pull(expanded.value, id);
  emit('save', elementData);
};

const addCard = () => {
  const id = uuid();
  elementData.items[id] = {
    id,
    front: {},
    back: {},
    position: cardCount.value + 1,
  };
  expanded.value.push(id);
  emit('save', elementData);
};

useDraggable(panels, cards, {
  animation: 150,
  handle: '.flashcard-drag-handle',
});

watch(
  () => props.element.data,
  (data) => {
    if (isEqual(data, elementData)) return;
    Object.assign(elementData, cloneDeep(data));
  },
);
</script>

<style lang="scss" scoped>
:deep(.sortable-ghost) > * {
  visibility: hidden;
}
</style>
