<template>
  <UCard>
    <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
      <div class="flex flex-col gap-1 grow">
        <p class="font-semibold">{{ props.cost.name }}</p>
        <span class="text-sm text-gray-500">{{ props.cost.description }}</span>
      </div>
      <div class="flex">
        <div class="text-lg font-medium mr-4">
          {{ formatCurrency(props.cost.price) }}
        </div>
      </div>
      <UTooltip :text="t('edit_cost')" :popper="{ placement: 'top' }">
        <UButton
          color="white"
          variant="solid"
          icon="i-heroicons-pencil-square"
          @click="$emits('edit', props.cost.id)"
        />
      </UTooltip>
      <UTooltip :text="t('delete_cost')" :popper="{ placement: 'top' }">
        <UButton
          color="red"
          variant="ghost"
          :icon="'i-heroicons-trash'"
          @click="$emits('delete', props.cost.id)"
        />
      </UTooltip>
    </div>
    <template #footer>
      <div class="flex gap-4">
        <p>{{ t("classes") }}</p>
        <div
          v-if="allowedClasses && allowedClasses.length > 0"
          class="flex flex-wrap"
        >
          <CourseTypeBadge
            v-for="courseCombination in allowedClasses"
            :key="courseCombination.id"
            :type="courseCombination.course.type"
            class="mr-2 mb-2"
          />
        </div>
        <p
          v-else-if="allowedClasses && allowedClasses.length == 0"
          class="text-sm text-gray-500"
        >
          {{ t("no_classes_assigned_to_cost") }}
        </p>
        <p v-else-if="status == 'pending'" class="flex items-center gap-2">
          <USkeleton class="w-8" />
        </p>
        <p v-else class="text-sm text-red-500">
          {{ t("error_loading_classes") }}
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { AppCourseCost } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";
import CourseTypeBadge from "./CourseTypeBadge.vue";
import { USkeleton } from "#components";

type Props = {
  cost: AppCourseCost;
};

const { t } = useI18n({
  useScope: "local",
});
const props = defineProps<Props>();
const courseCostsStore = useCourseCostsStore();
const $emits = defineEmits<{
  (e: "edit" | "delete", id: string): void;
}>();

const {
  data: allowedClasses,
  status,
} = useAsyncData(`costs-allowed-classes-${props.cost.id}`, async () => {
  return courseCostsStore.getAllowedCourseForCost(props.cost.id);
});

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "edit_cost": "Kosten bearbeiten",
    "delete_cost": "Kosten löschen",
    "not_specified": "Nicht angegeben",
    "course_type": "Kurstyp",
    "base_price": "Grundpreis",
    "classes": "Klassen",
    "no_classes_assigned_to_cost": "Keine Klassen zu diesen Kosten zugewiesen",
    "error_loading_classes": "Fehler beim Laden der Klassen"
  },
  "en": {
    "edit_cost": "Edit Cost",
    "delete_cost": "Delete Cost",
    "not_specified": "Not specified",
    "course_type": "Course Type",
    "base_price": "Base Price",
    "classes": "Classes",
    "no_classes_assigned_to_cost": "No classes assigned to these costs",
    "error_loading_classes": "Error loading classes"
  }
}
</i18n>
