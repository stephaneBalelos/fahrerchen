<script setup lang="ts">
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'
import type { PropType } from 'vue';
import type { DatePickerModel } from 'v-calendar/dist/types/src/use/datePicker.js';

const props = defineProps({
  modelValue: {
    type: [Date, Object] as PropType<DatePickerModel>,
    default: null,
  },
  expanded: {
    type: Boolean,
    default: false,
  }, 
  datesHighlighted: {
    type: Array<Date>,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'date',
  }
})

const { locale } = useI18n()

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  }
})

const attrs = {
  transparent: true,
  borderless: true,
  color: 'primary',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}
</script>

<template>
  <VCalendarDatePicker 
  v-if="date && (typeof date === 'object')" v-model="date"
  :mode="props.mode"
  :locale="locale" :expanded="props.expanded" :columns="1"
  v-bind="{ ...attrs, ...$attrs }"
  :attributes="[
    { dot: true, dates: [...props.datesHighlighted] }
  ]"
  :rules="{
    minutes: [0, 15, 30, 45],
  }"
  is24hr
  />
</template>

<style>
:root {
  --vc-gray-50: rgb(var(--color-gray-50));
  --vc-gray-100: rgb(var(--color-gray-100));
  --vc-gray-200: rgb(var(--color-gray-200));
  --vc-gray-300: rgb(var(--color-gray-300));
  --vc-gray-400: rgb(var(--color-gray-400));
  --vc-gray-500: rgb(var(--color-gray-500));
  --vc-gray-600: rgb(var(--color-gray-600));
  --vc-gray-700: rgb(var(--color-gray-700));
  --vc-gray-800: rgb(var(--color-gray-800));
  --vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
  --vc-accent-50: rgb(var(--color-primary-50));
  --vc-accent-100: rgb(var(--color-primary-100));
  --vc-accent-200: rgb(var(--color-primary-200));
  --vc-accent-300: rgb(var(--color-primary-300));
  --vc-accent-400: rgb(var(--color-primary-400));
  --vc-accent-500: rgb(var(--color-primary-500));
  --vc-accent-600: rgb(var(--color-primary-600));
  --vc-accent-700: rgb(var(--color-primary-700));
  --vc-accent-800: rgb(var(--color-primary-800));
  --vc-accent-900: rgb(var(--color-primary-900));
}
</style>