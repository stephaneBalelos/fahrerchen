<template>
  <div class="">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-200">
        {{ g(`activities.recurrence_rules`) }}
      </h2>
      <UTooltip :text="t('add_recurrence_rule')">
          <UButton size="sm" color="gray" icon="i-heroicons-plus" @click="openEditRecurrenceRuleForm()" />
      </UTooltip>
    </div>
    <div v-if="status == 'success' && data && data.length > 0">
      <div class="space-y-4">
        <div
          v-for="rule in data"
          :key="rule.id"
          class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-path-rounded-square" class="text-gray-500" />
              <p class="font-medium text-gray-900 dark:text-gray-200">
                {{
                  rule.ruleParsed
                    ? rule.ruleParsed.toText()
                    : t("invalid_recurrence_rule")
                }}
              </p>
            </div>
            <div class="flex space-x-2">
              <UButton
                size="xs"
                color="gray"
                variant="solid"
                @click="openEditRecurrenceRuleForm(rule.id)"
              >
                {{ t("edit") }}
              </UButton>
              <UButton
                size="xs"
                color="red"
                variant="soft"
                @click="courseActivitiesStore.deleteRecurrenceRule(rule.id).then(() => refresh())"
              >
                {{ t("delete") }}
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="status == 'pending'">
      <USkeleton class="h-12 w-full rounded-md" />
    </div>
    <div v-else class="text-center text-gray-500 dark:text-gray-400 py-8">
      {{ t("no_recurrence_rules_found") }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { RRule } from "rrule";
import type {
  AppCourseActivityRecurrenceRule,
} from "~/types/app.types";

import EditCourseActivityRecurrenceRules from "~/components/forms/EditCourseActivityRecurrenceRules.vue";

type Props = {
  activityId: string;
  activityName: string;
  activityDescription: string;
  organizationId: string;
};

type AppRecurenceRuleParsed = AppCourseActivityRecurrenceRule & {
  ruleParsed?: RRule;
};

const props = defineProps<Props>();
const slideover = useSlideover();
const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const courseActivitiesStore = useCourseActivitiesStore();

const { data, status, refresh } = useAsyncData(
  `recurrence-rules-activity-${props.activityId}`,
  () => {
    return courseActivitiesStore.getRecurrenceRulesForActivity(
      props.activityId
    );
  },
  {
    transform: (data) => {
      if (!data) {
        return [] as AppRecurenceRuleParsed[];
      }
      return data.map((rule) => {
        let ruleParsed: RRule | undefined = undefined;
        try {
          ruleParsed = RRule.fromString(rule.rrule);
        } catch (e) {
          console.error("Failed to parse RRule string:", rule.rrule, e);
        }
        return {
          ...rule,
          ruleParsed,
        };
      });
    },
  }
);

const openEditRecurrenceRuleForm = (recurrence_rule_id?: string) => {
  slideover.open(EditCourseActivityRecurrenceRules, {
    activityRecurrenceRuleId: recurrence_rule_id,
    activityId: props.activityId,
    activityName: props.activityName,
    activityDescription: props.activityDescription,
    organizationId: props.organizationId,

    "onClose": () => {
      slideover.close();
      refresh();
    },
  });
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "recurrence_rules": "Recurrence Rules",
    "add_recurrence_rule": "Add Recurrence Rule",
    "edit": "Edit",
    "delete": "Delete",
    "no_recurrence_rules_found": "No recurrence rules found.",
    "invalid_recurrence_rule": "Invalid recurrence rule"
  },
  "de": {
    "recurrence_rules": "Wiederholungsregeln",
    "add_recurrence_rule": "Wiederholungsregel hinzufügen",
    "edit": "Bearbeiten",
    "delete": "Löschen",
    "no_recurrence_rules_found": "Keine Wiederholungsregeln gefunden.",
    "invalid_recurrence_rule": "Ungültige Wiederholungsregel"
  }
}
</i18n>
