<template>
  <UCard
    :ui="{
      body: {
        base: 'flex items-center min-h-14',
        padding: 'sm:p-3 p-3 px-4 sm:px-4',
      },
    }"
    @mouseover="
      () => {
        isHovering = true;
      }
    "
    @mouseleave="
      () => {
        isHovering = false;
      }
    "
  >
    <div class="flex flex-1 gap-4 items-center w-full">
      <div class="flex flex-1 flex-col justify-center w-full truncate">
        <p class="font-medium truncate text-gray-700 dark:text-gray-300">
          {{ props.label }}
        </p>
      </div>

      <slot v-if="isEditing" name="editing" />
      <slot v-else />

      <div
        v-if="isHovering || isEditing"
        class="flex items-center border-l pl-3 gap-2 border-gray-200 dark:border-gray-700"
      >
        <slot name="actions" :is-editing="isEditing" :set-is-editing="setIsEditing" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
type Props = {
  label: string;
};
const props = defineProps<Props>();

const isHovering = ref(false);
const isEditing = ref(false);

function setIsEditing(value: boolean) {
  isEditing.value = value;
}
</script>

<style scoped></style>
