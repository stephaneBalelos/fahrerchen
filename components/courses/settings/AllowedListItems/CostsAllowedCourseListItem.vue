<template>
  <AllowedCourseListItemTemplate
    :is-loading="status !== 'success'"
    :is-allowed="data ? true : false"
    :course="props.course"
    :remove-course-from-allowed-courses="detachCostFromCourse"
    :add-course-to-allowed-courses="attachCostToCourse"
  >
    <UForm v-if="data" class="flex gap-6" :schema="schema" :state="state">
      <div class="flex items-center gap-1 w-32">
        <UPopover mode="hover">
          <UButton
            icon="i-heroicons-information-circle"
            size="2xs"
            variant="ghost"
          />
          <template #panel>
            <p class="max-w-xs p-4 text-center">
              {{ t("form.price.description", { type: props.course.type }) }}
            </p>
          </template>
        </UPopover>
        <UInput
          v-model="state.price"
          :label="t('form.price.label')"
          type="number"
          size="sm"
          step="0.01"
          min="0"
          variant="none"
          :placeholder="formatCurrency(data.cost.price)"
          :disabled="!data || isUpdating"
          @blur="() => updateCombination()"
        >
          <template #trailing>
            <span :class="`text-sm ${state.price ? '' : 'text-gray-500'}`"
              >€</span
            >
          </template>
        </UInput>
      </div>
    </UForm>
  </AllowedCourseListItemTemplate>
</template>

<script setup lang="ts">
import type { AppCourse } from "~/types/app.types";
import AllowedCourseListItemTemplate from "./AllowedCourseListItemTemplate.vue";
import { formatCurrency } from "~/utils/formatters";
import { z } from "zod";

type Props = {
  course: AppCourse;
  costId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const courseCostsStore = useCourseCostsStore();

const { data, refresh, status } = await useAsyncData(
  `course_cost_combination_${props.costId}_${props.course.id}`,
  async () =>
    await courseCostsStore.getAllowedCourseForCost(
      props.costId,
      props.course.id
    ),
  {
    transform: (data) => data[0] || null,
    immediate: true,
    watch: [() => props.costId, () => props.course.id],
  }
);

const attachCostToCourse = async () => {
  await courseCostsStore.addCostToCourse(props.costId, props.course.id);
  await refresh();
};

const detachCostFromCourse = async () => {
  await courseCostsStore.removeCostFromCourse(props.costId, props.course.id);
  await refresh();
};

const schema = z.object({
  price: z.number().min(0).optional(),
});

type Schema = z.infer<typeof schema>;
const state = reactive<Schema>({
  price: (data.value && data.value.price !== null) ? data.value.price : undefined,
});
const isUpdating = ref(false);

const updateCombination = async () => {
  if (!data.value) return;
  try {
    isUpdating.value = true;
    await courseCostsStore.updateCourseCostCombination(data.value.id, {
      price: state.price,
    });
  } finally {
    isUpdating.value = false;
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "form": {
      "price": {
        "label": "Preis",
        "description": "Der Preis, der für diesen Kurs berechnet wird. Wenn leer, wird der Standardpreis von {type} verwendet."
      }
    }
  },
  "en": {
    "form": {
      "price": {
        "label": "Price",
        "description": "The price charged for this course. If empty, the standard price for {type} will be used."
      }
    }
  }
}
</i18n>
