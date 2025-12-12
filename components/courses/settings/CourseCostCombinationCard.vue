<template>
  <EditInplaceCard :label="props.cost.name">
    <div class="flex items-center">
      <div class="flex items-center gap-4">
        <p class="font-semibold">
          {{
            formatCurrency(
              data
                ? data.price !== null
                  ? data.price
                  : props.cost.price
                : props.cost.price
            )
          }}
        </p>
      </div>
    </div>
    <template #editing>
      <UForm
        v-if="data"
        class="flex-1 gap-6"
        :schema="schema"
        :state="state"
      >
        <div class="flex items-center gap-1">
          <UInput
            v-model="state.price"
            :icon="'i-heroicons-currency-euro'"
            :size="'sm'"
            type="number"
            step="0.01"
            min="0"
            :placeholder="
              (state.price ? state.price : props.cost.price).toString()
            "
            :disabled="!data || isUpdating"
          />
        </div>
      </UForm>
    </template>
    <template #actions="{ isEditing, setIsEditing }">
       <UTooltip v-if="!isEditing" :text="t('edit')">
          <UButton
            icon="i-heroicons-pencil-square"
            color="gray"
            variant="ghost"
            :size="'2xs'"
            :disabled="isUpdating || !data"
            @click="() => setIsEditing(true)"
          />
        </UTooltip>
        <UButton
          v-else
          :loading="isUpdating"
          icon="i-heroicons-check"
          color="green"
          variant="soft"
          :size="'2xs'"
          :disabled="isUpdating || !data"
          @click="() => {
            updateCombination();
            setIsEditing(false);
          }"
        />
        <UPopover mode="click">
          <UButton
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            :size="'2xs'"
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
    </template>
  </EditInplaceCard>
</template>

<script setup lang="ts">
import z from "zod";
import type { AppCourseCost } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";
import EditInplaceCard from "~/components/ui/Cards/EditInplaceCard.vue";

type Props = {
  courseId: string;
  cost: AppCourseCost;
};
const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});

const $emits = defineEmits<{
  (e: "updated" | "removed", id: string): void;
}>();

const isUpdating = ref(false);

const courseCostsStore = useCourseCostsStore();

const { data, refresh } = await useAsyncData(
  `course-cost-combinations-for-course-${props.courseId}-cost-${props.cost.id}`,
  () => {
    return courseCostsStore.getAllowedCourseForCost(
      props.cost.id,
      props.courseId
    );
  },
  {
    transform: (data) => {
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
});

const updateCombination = async () => {
  if (!data.value) {
    return;
  }
  isUpdating.value = true;
  try {
    await courseCostsStore.updateCourseCostCombination(data.value.id, {
      price: state.price ? state.price : undefined,
    });
    $emits("updated", data.value.id);
  } catch (error) {
    console.error("Error updating course cost combination:", error);
  } finally {
    isUpdating.value = false;
    refresh();
  }
};

const deleteCombination = async () => {
  if (!data.value) {
    return;
  }
  isUpdating.value = true;
  try {
    await courseCostsStore.removeCourseCostCombination(data.value.id);
    $emits("removed", data.value.id);
  } catch (error) {
    console.error("Error deleting course cost combination:", error);
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
        "title": "Kostenstelle aus dem Kurs entfernen",
        "description": "Dieser Kostenstelle wird aus dem Kurs entfernt. Neue Einschreibungen zu diesem Kurs werden diese Kostenstelle nicht mehr enthalten.",
        "confirm": "Löschen",
        "cancel": "Abbrechen"
      }
    }
  },
  "en": {
    "form": {
      "delete_confirmation": {
        "title": "Remove Cost from Course",
        "description": "This cost will be removed from the course. New enrollments to this course will no longer include this cost.",
        "confirm": "Delete",
        "cancel": "Cancel"
      }
    }
  }
}
</i18n>
