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
      <UButton
        color="gray"
        variant="solid"
        @click.stop="openEditCourseCostForm()"
        >{{ t("edit_cost") }}</UButton
      >
      <UButton
        color="red"
        variant="ghost"
        :icon="'i-heroicons-trash'"
        @click.stop="courseCostsStore.deleteCourseCost(props.cost.id)"
      />
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
import EditCourseCostForm from "../forms/EditCourseCostForm.vue";

type Props = {
  cost: AppCourseCost;
};

const { t } = useI18n({
  useScope: "local",
});
const props = defineProps<Props>();
const courseCostsStore = useCourseCostsStore();
const slideover = useSlideover();
const emits = defineEmits<{
  (e: "updated"): void;
}>();

const {
  data: allowedClasses,
  status,
  refresh,
} = useAsyncData(`costs-allowed-classes-${props.cost.id}`, async () => {
  return courseCostsStore.getAllowedCourseForCost(props.cost.id);
});

function openEditCourseCostForm() {
  slideover.open(EditCourseCostForm, {
    organizationId: props.cost.organization_id,
    courseCostId: props.cost.id,
    "onCost-saved": () => {
      slideover.close();
      emits("updated");
    },
    "onCost-deleted": () => {
      slideover.close();
      emits("updated");
    },
    preventClose: true,
    onVnodeUnmounted: () => {
      refresh();
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "edit_cost": "Kosten bearbeiten",
    "not_specified": "Nicht angegeben",
    "course_type": "Kurstyp",
    "base_price": "Grundpreis",
    "classes": "Klassen",
    "no_classes_assigned_to_cost": "Keine Klassen zu diesen Kosten zugewiesen",
    "error_loading_classes": "Fehler beim Laden der Klassen"
  },
  "en": {
    "edit_cost": "Edit Cost",
    "not_specified": "Not specified",
    "course_type": "Course Type",
    "base_price": "Base Price",
    "classes": "Classes",
    "no_classes_assigned_to_cost": "No classes assigned to these costs",
    "error_loading_classes": "Error loading classes"
  }
}
</i18n>
