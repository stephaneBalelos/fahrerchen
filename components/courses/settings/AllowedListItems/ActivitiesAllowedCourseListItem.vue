<template>
  <AllowedCourseListItemTemplate
    :is-loading="status !== 'success'"
    :is-allowed="data ? true : false"
    :course="props.course"
    :remove-course-from-allowed-courses="removeCourseFromAllowedCourses"
    :add-course-to-allowed-courses="addCourseToAllowedCourses"
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
              {{ t('form.price.description', { type: props.course.type}) }}
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
          :placeholder="formatCurrency(data.activity.price)"
          :disabled="!data || isUpdating"
          @blur="() => updateCombination()"
        >
        <template #trailing>
          <span :class="`text-sm ${state.price ? '' : 'text-gray-500'}`">€</span>
        </template>
        </UInput>
      </div>
      <div class="flex items-center gap-1 w-32">
        <UPopover mode="hover">
          <UButton
            icon="i-heroicons-information-circle"
            size="2xs"
            variant="ghost"
          />
          <template #panel>
            <p class="max-w-xs p-4 text-center">
              {{ t('form.required.description', { type: props.course.type}) }}
            </p>
          </template>
        </UPopover>
        <UInput
          v-model="state.required"
          :label="t('form.required.label')"
          type="number"
          size="sm"
          step="1"
          min="0"
          max="100"
          variant="none"
          :placeholder="data.activity.required?.toString() || ''"
          :disabled="!data || isUpdating"
          @blur="() => updateCombination()"
        />
      </div>
    </UForm>
  </AllowedCourseListItemTemplate>
</template>

<script setup lang="ts">
import type { AppCourse } from "~/types/app.types";
import AllowedCourseListItemTemplate from "./AllowedCourseListItemTemplate.vue";
import { z } from "zod";
import { formatCurrency } from "~/utils/formatters";

type Props = {
  course: AppCourse;
  activityId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();
const isUpdating = ref(false);

const { data, refresh, status } = await useAsyncData(
  `course_activities_combination_${props.activityId}_${props.course.id}`,
  async () =>
    await courseActivitiesStore.getAllowedCourseForActivity(
      props.activityId,
      props.course.id
    ),
  {
    transform: (data) => data[0] || null,
    immediate: true,
    watch: [() => props.activityId, () => props.course.id],
  }
);

const addCourseToAllowedCourses = async () => {
  await courseActivitiesStore.addCourseToAllowedCourses(
    props.activityId,
    props.course.id
  );
  await refresh();
};

const removeCourseFromAllowedCourses = async () => {
  await courseActivitiesStore.removeCourseFromAllowedCourses(
    props.activityId,
    props.course.id
  );
  await refresh();
};

const schema = z.object({
  price: z.number().min(0).optional(),
  required: z.number().min(0).max(100).optional(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Schema>({
  price: data.value?.price || undefined,
  required: data.value?.required || undefined,
});


const updateCombination = async () => {
  if (!data.value) return;
  try {
    isUpdating.value = true;
    await courseActivitiesStore.updateCourseActivityCombination(data.value.id, state);
  } catch (error) {
    console.error("Failed to update combination:", error);
  } finally {
    isUpdating.value = false;
  }
}

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "form": {
      "price": {
        "label": "Preis €",
        "description": "Der Preis für diese Aktivität, für die Teilnehmer:innen der Klasse {type}."
      },
      "required": {
        "label": "Erforderliche Teilnahmen",
        "description": "Die Anzahl der erforderlichen Teilnahmen für diese Aktivität, für die Teilnehmer:innen der Klasse {type}."
      }
    }
  },
  "en": {
    "form": {
      "price": {
        "label": "Price €",
        "description": "The price for this activity, for participants of driving license type {type}."
      },
      "required": {
        "label": "Required attendances",
        "description": "The number of required attendances for this activity, for participants of driving license type {type}."
      }
    }
  }
}
</i18n>
