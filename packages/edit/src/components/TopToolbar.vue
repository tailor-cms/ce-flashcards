<template>
  <VForm ref="form" validate-on="submit">
    <VToolbarItems class="ga-2">
      <VTextField
        v-model="height"
        :rules="[
          (v: number) => !!v || 'Height is required',
          (v: number) => v >= 200 || 'Height must be at least 200px',
          (v: number) => v <= 3000 || 'Height must be at most 3000px',
        ]"
        class="required ml-2"
        hide-details="auto"
        label="Card height"
        min-width="200"
        prepend-inner-icon="mdi-arrow-expand-vertical"
        suffix="px"
        type="number"
        variant="outlined"
      />
    </VToolbarItems>
  </VForm>
</template>

<script setup lang="ts">
import { inject, ref, watch } from 'vue';
import { debounce } from 'lodash-es';
import type { Element } from '@tailor-cms/ce-flashcards-manifest';

const props = defineProps<{ element: Element }>();

const elementBus: any = inject('$elementBus');

const form = ref<HTMLFormElement>();
const height = ref(props.element.data.height);

watch(
  height,
  debounce(async () => {
    if (!form.value) return;
    const { valid } = await form.value.validate();
    if (valid) return elementBus.emit('height', height.value);
  }, 500),
);
</script>
