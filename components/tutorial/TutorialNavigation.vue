<template>
  <div v-if="tutorialStore.steps.length > 0" class="flex flex-col">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">{{ t("title") }}</h3>
        <p class="text-sm text-gray-500">
          {{ t("description") }}
        </p>
      </div>
    </div>
    <div>
      <UProgress
        :value="tutorialStore.progress"
        :max="100"
        :indicator="true"
        color="primary"
      >
        <template #indicator="{ percent }">
          <div class="text-right">
            <span>{{ Math.ceil(percent) }}% {{ t("progress") }}</span>
          </div>
        </template>
      </UProgress>
    </div>
    <UAccordion :items="items" class="mt-4">
      <template #default="{ item, index, open }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-b border-gray-200 dark:border-gray-700"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-2' } }"
        >
          <template #leading>
            <div
              v-if="item.content.completed"
              class="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center -my-1"
            >
              <UIcon
                name="i-heroicons-check-circle"
                class="w-4 h-4 text-white dark:text-gray-900"
              />
            </div>
            <div
              v-else
              class="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center -my-1"
            >
              <UIcon
                name="i-heroicons-information-circle"
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
              />
            </div>
          </template>

          <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

          <template #trailing>
            <UIcon
              name="i-heroicons-chevron-right-20-solid"
              class="w-5 h-5 ms-auto transform transition-transform duration-200"
              :class="[open && 'rotate-90']"
            />
          </template>
        </UButton>
      </template>
      <template #item="{ item }">
        <p class="italic text-gray-900 dark:text-white text-center">
          {{ item.description }}
        </p>
      </template>

      <template v-for="(item, idx) in items" :key="idx" #[item.slot]>
        <div class="text-gray-900 dark:text-white">
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ item.content.description }}
          </p>
          <div v-if="item.content.show_complete_button && item.content.can_complete" class="mt-4">
            <UButton
              color="primary"
              @click="tutorialStore.completeStep(item.content.id)"
              >{{ t("complete_step") }}</UButton
            >
          </div>
        </div>
      </template>
    </UAccordion>
  </div>
</template>

<script setup lang="ts">
const tutorialStore = useTutorialStore();
const userStore = useUserStore();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const items = computed(() => {
  return tutorialStore.steps.map((step, index) => ({
    label: g(`tutorial.steps.${step.id}.title`),
    slot: `step-${index}`,
    content: {
      id: step.id,
      description: g(`tutorial.steps.${step.id}.description`),
      completed: step.completed,
      show_complete_button: step.show_complete_button,
      can_complete: tutorialStore.steps[index - 1]?.completed,
    },
  }));
});

onMounted(() => {
  if (!userStore.user) return;
  tutorialStore.initTutorial(userStore.user.id);
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Schnellstart Tutorial",
    "description": "Lernen Sie die Grundlagen mit diesem Step-by-Step Tutorial.",
    "progress": "Fortschritt",
    "complete_step": "Schritt abschließen"
  },
  "en": {
    "title": "Quick Start Tutorial",
    "description": "Learn the basics with this step-by-step tutorial.",
    "progress": "Progress",
    "complete_step": "Complete Step"
  }
}
</i18n>
