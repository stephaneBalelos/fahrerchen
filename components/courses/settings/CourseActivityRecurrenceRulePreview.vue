<template>
  <div
    v-if="status == 'success' && recurrenceRulePreview"
    class="flex gap-4 items-center border border-gray-400 dark:border-gray-600 rounded-lg p-2 px-4"
  >
    <UIcon name="i-heroicons-arrow-path-20-solid" class="text-gray-500" />
    <div class="flex flex-col items-start space-y-2">
        <p class="text-sm">
            {{ g("schedules.recurring_event") }}
        </p>
        <p class="font-bold text-gray-900 dark:text-gray-200">
          {{ recurrenceRulePreview }}
        </p>
    </div>
    <UButton
      size="xs"
      color="gray"
      variant="solid"
      icon="i-heroicons-pencil"
      @click="openEditCourseActivityRecurrenceRule()"
    />
  </div>
  <div v-else-if="status == 'pending'">
    <USkeleton class="h-12 w-full rounded-md" />
  </div>
  <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
    {{ t("no_recurrence_rule_found") }}
  </div>
</template>

<script setup lang="ts">
import { RRule } from "rrule";
import EditCourseActivityRecurrenceRules from "~/components/forms/EditCourseActivityRecurrenceRules.vue";
import { WEEKDAYS } from "~/constants";

type Props = {
  activityRecurrenceRuleId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const courseActivitiesStore = useCourseActivitiesStore();

const { data, status, refresh } = useAsyncData(
  `recurrence-rule-${props.activityRecurrenceRuleId}`,
  async () => {
    const data = await courseActivitiesStore.getRecurrenceRuleById(
      props.activityRecurrenceRuleId
    );
    console.log("Fetched recurrence rule data:", data);
    return {
        ...data,
        ruleParsed: RRule.fromString(data.rrule)
    }
  }
);

const recurrenceRulePreview = computed(() => {
  if (data.value) {
    const days = WEEKDAYS.filter((_, index) =>
      data.value!.ruleParsed.options.byweekday?.includes(index)
    ).map((day) => g(`dates.weekdays.${day}`)).join(", ");

      console.log("RRule days:", days);
    return g("dates.weekly_on_days", { days });
  }
  return null;
});

const slideover = useSlideover();

const openEditCourseActivityRecurrenceRule = () => {
  if (!data.value) {
    return;
  }
  slideover.open(EditCourseActivityRecurrenceRules, {
    activityRecurrenceRuleId: props.activityRecurrenceRuleId,
    activityId: data.value.activity.id,
    activityName: data.value.activity.name,
    activityDescription: data.value.activity.description,
    organizationId: data.value.activity.organization_id,
    onClose: () => {
      refresh();
    },
  });
};
</script>

<style scoped></style>
