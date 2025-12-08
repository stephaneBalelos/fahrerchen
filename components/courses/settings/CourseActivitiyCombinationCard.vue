<template>
  <UCard
    :ui="{
      body: {
        padding: 'sm:p-4 p-4',
      },
    }"
  >
    <div class="flex">
      <div class="flex flex-1 flex-col justify-center">
        <p class="font-medium">
          {{ props.activity.name }}
        </p>
      </div>
      <UForm v-if="data" class="flex gap-6" :schema="schema" :state="state">
        <div class="flex items-center gap-1 w-32">
          <UInput
            v-model="state.price"
            type="number"
            size="sm"
            step="0.01"
            min="0"
            variant="none"
            :placeholder="formatCurrency(data.activity.price)"
            :disabled="!data || isUpdating"
            @blur="
              () => {
                updateCombination();
              }
            "
          >
            <template #trailing>
              <span :class="`text-sm ${state.price ? '' : 'text-gray-500'}`"
                >€</span
              >
            </template>
          </UInput>
        </div>
        <div class="flex items-center gap-1 w-32">
          <UInput
            v-model="state.required"
            type="number"
            size="sm"
            step="1"
            min="0"
            max="100"
            variant="none"
            :placeholder="data.activity.required?.toString() || ''"
            :disabled="!data || isUpdating"
            @blur="
              () => {
                updateCombination();
              }
            "
          />
        </div>
      </UForm>
      <div class="flex items-center ms-4">
        <UPopover mode="click">
          <UButton
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            size="sm"
            :disabled="isUpdating || !data"
          />
          <template #panel="{ close }">
            <div class="flex flex-col p-4 gap-4 max-w-xs">
              <p class="font-medium">
                {{ t("form.delete_confirmation.title") }}
              </p>
              <p class="text-sm text-gray-600">
                {{ t("form.delete_confirmation.description") }}
              </p>
              <div class="flex justify-end gap-2">
                <UButton
                  :label="t('form.delete_confirmation.cancel')"
                  variant="ghost"
                  size="sm"
                  @click="close"
                />
                <UButton
                  :label="t('form.delete_confirmation.confirm')"
                  color="red"
                  variant="solid"
                  size="sm"
                  @click="
                    () => {
                      deleteCombination();
                    }
                  "
                />
              </div>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import z from "zod";
import type { AppCourseActivity } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";

type Props = {
  courseId: string;
  activity: AppCourseActivity;
};
const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});

const $emits = defineEmits<{
  (e: "updated" | "removed", id: string): void;
}>();

const isUpdating = ref(false);

const courseActivitiesStore = useCourseActivitiesStore();

const { data } = await useAsyncData(
  `course-activity-combinations-for-course-${props.courseId}-activity-${props.activity.id}`,
  () => {
    return courseActivitiesStore.getAllowedCourseForActivity(
      props.activity.id,
      props.courseId
    );
  },
  {
    transform: (data) => {
      console.log("Fetched course activity combination:", data);
      if (data.length > 0) {
        return data[0];
      }
      return null;
    },
  }
);

const schema = z.object({
  price: z.number().min(0).optional(),
  required: z.number().min(0).max(100).optional(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Schema>({
  price: data.value && data.value.price !== null ? data.value.price : undefined,
  required:
    data.value && data.value.required !== null
      ? data.value.required
      : undefined,
});

const updateCombination = async () => {
  if (!data.value) {
    return;
  }
  isUpdating.value = true;
  try {
    await courseActivitiesStore.updateCourseActivityCombination(data.value.id, {
      price: state.price !== undefined ? state.price : null,
      required: state.required !== undefined ? state.required : null,
    });
    $emits("updated", data.value.id);
  } catch (error) {
    console.error("Error updating course activity combination:", error);
  } finally {
    isUpdating.value = false;
  }
};

const deleteCombination = async () => {
  if (!data.value) {
    return;
  }
  isUpdating.value = true;
  try {
    await courseActivitiesStore.removeCourseActivityCombination(data.value.id);
    $emits("removed", data.value.id);
  } catch (error) {
    console.error("Error deleting course activity combination:", error);
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
      "delete_confirmation": {
        "title": "Kombination löschen",
        "description": "Sind Sie sicher, dass Sie diese Kurs-Aktivitäts-Kombination löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
        "confirm": "Löschen",
        "cancel": "Abbrechen"
      }
    }
  },
  "en": {
    "form": {
      "delete_confirmation": {
        "title": "Delete Combination",
        "description": "Are you sure you want to delete this course-activity combination? This action cannot be undone.",
        "confirm": "Delete",
        "cancel": "Cancel"
      }
    }
  }
}
</i18n>
