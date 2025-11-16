<template>
  <UDashboardSlideover :title="t('title')" :description="t('description')">
    <UForm ref="form" :schema="schema" :state="state" @submit="onSubmit">
      <UDashboardSection
        :title="props.activityName"
        :description="props.activityDescription"
      >
        <UFormGroup
          name="startDate"
          :label="t('form.startDate.label')"
          :description="t('form.startDate.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <div class="grid grid-cols-2 gap-4">
            <UPopover :popper="{ placement: 'bottom-start' }">
              <div class="w-full">
                <UButton
                  block
                  color="white"
                  variant="solid"
                  icon="i-heroicons-calendar-days-20-solid"
                  :size="'md'"
                  :label="format(new Date(state.startDate), 'd MMM, yyy')"
                />
              </div>
              <template #panel="">
                <DatePicker
                  v-model="state.startDate"
                  is-required
                  :mode="'dateTime'"
                />
              </template>
            </UPopover>
          </div>
        </UFormGroup>

        <UFormGroup
          name="daysOfWeek"
          :label="t('form.daysOfWeek.label')"
          :description="t('form.daysOfWeek.description')"
          required
          :ui="{ container: '' }"
        >
          <div class="flex flex-col gap-2 py-6">
            <UCheckbox
              v-for="(option, index) in dayOfWeekOption"
              :id="'day-of-week-' + index"
              :key="'day-of-week-' + index"
              v-model="state.daysOfWeek"
              :name="`daysOfWeek-${option.value}`"
              :value="option.value"
              :label="option.label"
            />
          </div>
        </UFormGroup>

        <div>
          {{ rule.toString() }}
        </div>
        <div>
          {{ rule.toText() }}
        </div>
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">
        {{ t("save") }}
      </UButton>
      <UButton color="red" variant="ghost" @click="$emits('close')">
        {{ t("cancel") }}
      </UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { Form, FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";
import { RRule } from "rrule";
import DatePicker from "./Inputs/Datepicker.vue";

type Props = {
  activityRecurrenceRuleId?: string;
  activityId: string;
  activityName: string;
  activityDescription: string;
  organizationId: string;
};

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();
const $emits = defineEmits<{
  (e: "close"): void;
}>();

const { t } = useI18n({
  useScope: "local",
});

const dayOfWeekOption = [
  {
    label: t("form.daysOfWeek.options.monday"),
    value: 1,
    rruleValue: RRule.MO,
  },
  {
    label: t("form.daysOfWeek.options.tuesday"),
    value: 2,
    rruleValue: RRule.TU,
  },
  {
    label: t("form.daysOfWeek.options.wednesday"),
    value: 3,
    rruleValue: RRule.WE,
  },
  {
    label: t("form.daysOfWeek.options.thursday"),
    value: 4,
    rruleValue: RRule.TH,
  },
  {
    label: t("form.daysOfWeek.options.friday"),
    value: 5,
    rruleValue: RRule.FR,
  },
  {
    label: t("form.daysOfWeek.options.saturday"),
    value: 6,
    rruleValue: RRule.SA,
  },
  {
    label: t("form.daysOfWeek.options.sunday"),
    value: 7,
    rruleValue: RRule.SU,
  },
];

const schema = z
  .object({
    startDate: z.date().min(new Date()),
    daysOfWeek: z.array(z.number().min(1).max(7)).min(1),
  })
  .refine(
    (data) => {
      // Check that daysOfWeek are unique
      const uniqueDays = new Set(data.daysOfWeek);
      return uniqueDays.size === data.daysOfWeek.length;
    },
    {
      message: "Days of the week must be unique",
    }
  );

type FormSchema = z.infer<typeof schema>;
const form = ref<Form<FormSchema>>();

const rule = computed(() => {
  return new RRule({
    freq: RRule.WEEKLY,
    dtstart: state.value.startDate,
    byweekday: state.value.daysOfWeek.map(
      (day) =>
        dayOfWeekOption.find((option) => option.value === day)!.rruleValue
    ),
  });
});

const state = ref<FormSchema>({
  startDate: new Date(),
  daysOfWeek: [],
});

const onSubmit = (_data: FormSubmitEvent<FormSchema>) => {
    const rruleString = rule.value.toString();
    console.log("RRULE String:", rruleString);
    if (props.activityRecurrenceRuleId) {
        courseActivitiesStore
        .updateRecurrenceRule(props.activityRecurrenceRuleId, rruleString)
        .then(() => {
            $emits("close");
        })
        .catch((error) => {
            console.error("Failed to update recurrence rule:", error);
        });
    } else {
        courseActivitiesStore
        .createRecurrenceRule(props.organizationId, props.activityId, rruleString)
        .then(() => {
            $emits("close");
        })
        .catch((error) => {
            console.error("Failed to create recurrence rule:", error);
        });
    }
};

onMounted(async () => {
  if (props.activityRecurrenceRuleId) {
    try {
      const ruleData = await courseActivitiesStore.getRecurrenceRuleById(
        props.activityRecurrenceRuleId
      );
      if (ruleData) {
        const rrule = RRule.fromString(ruleData.rrule);
        state.value.startDate = rrule.options.dtstart || new Date();
        state.value.daysOfWeek = rrule.options.byweekday
          ? rrule.options.byweekday.map((weekday) => {
              return dayOfWeekOption.find(
                (o) => o.rruleValue.weekday === weekday
              )!.value;
            })
          : [];
      }
    } catch (error) {
      console.error("Failed to load recurrence rule:", error);
    }
  }
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Wiederholungsregeln bearbeiten",
    "description": "Legen Sie die Wiederholungsregeln für diese Aktivität fest.",
    "form": {
      "startDate": {
        "label": "Startdatum",
        "description": "Wählen Sie das Startdatum für die Wiederholungsregeln."
      },
      "daysOfWeek": {
        "label": "Wochentage",
        "description": "Wählen Sie die Wochentage aus, an denen die Aktivität wiederholt werden soll.",
        "options": {
          "monday": "Montag",
          "tuesday": "Dienstag",
          "wednesday": "Mittwoch",
          "thursday": "Donnerstag",
          "friday": "Freitag",
          "saturday": "Samstag",
          "sunday": "Sonntag"
        }
      }
    },
    "save": "Speichern",
    "cancel": "Abbrechen"
  },
  "en": {
    "title": "Edit Recurrence Rules",
    "description": "Set the recurrence rules for this activity.",
    "form": {
      "startDate": {
        "label": "Start Date",
        "description": "Select the start date for the recurrence rules."
      },
      "daysOfWeek": {
        "label": "Days of the Week",
        "description": "Select the days of the week on which the activity should recur.",
        "options": {
          "monday": "Monday",
          "tuesday": "Tuesday",
          "wednesday": "Wednesday",
          "thursday": "Thursday",
          "friday": "Friday",
          "saturday": "Saturday",
          "sunday": "Sunday"
        }
      }
    },
    "save": "Save",
    "cancel": "Cancel"
  }
}
</i18n>
