<!-- eslint-disable vue/no-undef-components -->
<template>
  <VExpansionPanel :value="item.id" class="border sm">
    <VHover v-slot="{ isHovering, props: hoverProps }">
      <VExpansionPanelTitle
        v-bind="hoverProps"
        class="pa-2 pr-4"
        min-height="50"
      >
        <div class="d-flex align-center w-100 ga-2">
          <span
            v-if="!isReadonly"
            class="flashcard-drag-handle"
            @drag.stop.prevent
          >
            <VIcon icon="mdi-drag-vertical" />
          </span>
          <span :class="{ 'ml-3': isReadonly }">Card {{ position }}</span>
          <VSpacer />
          <VFadeTransition>
            <VBtn
              v-if="(isHovering || isExpanded) && !isReadonly && allowDeletion"
              v-tooltip:bottom="{ text: 'Delete card', openDelay: 300 }"
              aria-label="Delete card"
              class="mr-2"
              color="error"
              density="comfortable"
              icon="mdi-trash-can-outline"
              rounded="lg"
              size="small"
              variant="text"
              @click.stop="deleteCard"
            />
          </VFadeTransition>
        </div>
      </VExpansionPanelTitle>
    </VHover>
    <VExpansionPanelText>
      <template v-for="(face, i) in faces" :key="face.key">
        <div class="text-title-small text-left mt-1">
          {{ face.label }}
        </div>
        <VAlert
          v-if="!hasElements(face.key)"
          class="mt-4"
          icon="mdi-information-outline"
          variant="tonal"
          prominent
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
          class="text-center"
          @delete="deleteEmbed(face.key, $event)"
          @save="saveEmbed(face.key, $event.embeds)"
        />
        <VDivider
          v-if="i === 0"
          aria-hidden="true"
          class="my-4 mx-n6"
          content-offset="8"
        >
          <VAvatar color="surface" size="32" border>
            <VIcon icon="mdi-sync" size="18" />
          </VAvatar>
        </VDivider>
      </template>
    </VExpansionPanelText>
  </VExpansionPanel>
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
  embeds?: Record<Face, Record<string, Embed>>;
  isFocused?: boolean;
  isReadonly?: boolean;
  isExpanded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  embeds: () => ({ front: {}, back: {} }),
  isReadonly: false,
  isFocused: false,
  isExpanded: false,
});
const emit = defineEmits<{
  save: [payload: { item: FlashcardItem; embeds?: Record<string, Embed> }];
  delete: [];
}>();

const eventBus = inject('$eventBus') as any;

const faces = computed(() => [
  { key: 'front' as Face, label: 'Front', embeds: props.embeds.front },
  { key: 'back' as Face, label: 'Back', embeds: props.embeds.back },
]);

const hasElements = (face: Face) => !isEmpty(props.embeds[face]);

const saveEmbed = (face: Face, embeds: Record<string, Embed>) => {
  const item = cloneDeep(props.item);
  forEach(embeds, (it) => (item[face][it.id] = true));
  emit('save', { item, embeds });
};

const deleteEmbed = (face: Face, embed: { id: string }) => {
  const item = cloneDeep(props.item);
  const embeds = cloneDeep(props.embeds[face]);
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

<style lang="scss" scoped>
.flashcard-drag-handle {
  cursor: pointer;
}

:deep(.v-btn) {
  --v-hover-opacity: 0.12;
}
</style>
