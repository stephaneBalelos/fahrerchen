<template>
  <UCard
    :ui="{
      header: {
        padding: 'p-0 sm:p-0',
      },
      body: {
        base: `${
          isCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-screen'
        } transition-all duration-300 ease-in-out`,
        padding: `${isCollapsed ? 'py-0 sm:py-0' : 'p-4 sm:p-6'}`,
      },
    }"
  >
    <template #header>
      <div
        :class="`cursor-pointer px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800 ${
          isCollapsed ? '' : 'bg-gray-50 dark:bg-gray-800'
        }`"
        @click="toggleCollapse"
      >
        <slot name="header" :is-collapsed="isCollapsed" />
      </div>
    </template>
    <div
      :class="`${
        isCollapsed ? 'opacity-0' : 'opacity-100'
      } transition-opacity duration-300 ease-in-out`"
    >
      <slot :is-collapsed="isCollapsed" />
    </div>
  </UCard>
</template>

<script setup lang="ts">
const isCollapsed = defineModel("isCollapsed", {
  type: Boolean,
  default: true,
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<style scoped></style>
