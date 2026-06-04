<!-- eslint-disable vue/no-undef-components -->
<template>
  <VSheet class="flashcard-item" rounded="lg" border>
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VToolbar v-bind="hoverProps" class="px-4" color="primary-lighten-5">
        <span v-if="!isReadonly" class="drag-handle" @drag.stop.prevent>
          <VIcon icon="mdi-drag-vertical" />
        </span>
        <div class="mx-2">Card {{ position }}</div>
        <VSpacer />
        <VFadeTransition>
          <VBtn
            v-if="isHovering && !isReadonly && allowDeletion"
            v-tooltip:bottom="{ text: 'Delete card', openDelay: 300 }"
            aria-label="Delete card"
            color="secondary-lighten-1"
            size="x-small"
            variant="tonal"
            icon
            @click="deleteCard"
          >
            <VIcon icon="mdi-delete-outline" size="large" />
          </VBtn>
        </VFadeTransition>
      </VToolbar>
    </VHover>
    <div class="pa-4 d-flex flex-column flex-md-row ga-4">
      <VSheet
        v-for="face in faces"
        :key="face.key"
        class="flashcard-face text-card overflow-hidden"
        color="transparent"
      >
        <div class="text-title-small mb-2">{{ face.label }}</div>
        <VAlert
          v-if="!hasElements(face.key)"
          color="primary-darken-1"
          icon="mdi-information-outline"
          variant="tonal"
        >
          <template v-if="isReadonly">
            No content elements added to this side.
          </template>
          <template v-else>
            Click the button below to add a content element.
          </template>
        </VAlert>
        <TailorEmbeddedContainer
          :allowed-element-config="embedElementConfig"
          :container="{ embeds: face.embeds }"
          :is-readonly="isReadonly"
          class="py-2"
          @delete="deleteEmbed(face.key, $event)"
          @save="saveEmbed(face.key, $event.embeds)"
        />
      </VSheet>
    </div>
  </VSheet>
</template>

<script lang="ts" setup>
import { cloneDeep, forEach, isEmpty } from 'lodash-es';
import { computed, inject } from 'vue';
import type { FlashcardItem } from '@tailor-cms/ce-flashcards-manifest';

type Face = 'front' | 'back';

interface Embed {
  id: string;
  data: Record<string, any>;
  embedded: boolean;
  position: number;
  type: string;
}

interface Props {
  allowDeletion: boolean;
  item: FlashcardItem;
  position: number;
  embedElementConfig: any[];
  frontEmbeds?: Record<string, Embed>;
  backEmbeds?: Record<string, Embed>;
  isFocused?: boolean;
  isReadonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  frontEmbeds: () => ({}),
  backEmbeds: () => ({}),
  isReadonly: false,
  isFocused: false,
});
const emit = defineEmits<{
  save: [payload: { item: FlashcardItem; embeds?: Record<string, Embed> }];
  delete: [];
}>();

const eventBus = inject('$eventBus') as any;

const faces = computed(() => [
  { key: 'front' as Face, label: 'Front', embeds: props.frontEmbeds },
  { key: 'back' as Face, label: 'Back', embeds: props.backEmbeds },
]);

const hasElements = (face: Face) =>
  !isEmpty(face === 'front' ? props.frontEmbeds : props.backEmbeds);

const saveEmbed = (face: Face, embeds: Record<string, Embed>) => {
  const item = cloneDeep(props.item);
  forEach(embeds, (it) => (item[face][it.id] = true));
  emit('save', { item, embeds });
};

const deleteEmbed = (face: Face, embed: { id: string }) => {
  const item = cloneDeep(props.item);
  const embeds = cloneDeep(
    face === 'front' ? props.frontEmbeds : props.backEmbeds,
  );
  delete embeds[embed.id];
  delete item[face][embed.id];
  emit('save', { item, embeds });
};

const deleteCard = () => {
  return eventBus.channel('app').emit('showConfirmationModal', {
    title: 'Delete card',
    message: 'Are you sure you want to delete this card?',
    action: () => emit('delete'),
  });
};
</script>

<style scoped>
.flashcard-item {
  text-align: left;
}

/* Equal-width faces that can shrink below content size (min-width: 0)
   so embedded elements don't force horizontal overflow. */
.flashcard-face {
  flex: 1 1 0;
  min-width: 0;
}
</style>
