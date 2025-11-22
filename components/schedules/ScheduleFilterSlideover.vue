<template>
  <UDashboardSlideover :title="t('filter_schedules')" :width="'md'">
    <UAccordion :items="items" :ui="{ wrapper: 'flex flex-col w-full' }">
      <template #default="{ item, index, open }">
        <UButton
          color="gray"
          variant="ghost"
          class="border-b border-gray-200 dark:border-gray-700"
          :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
        >
          <template #leading>
            <div
              class="w-6 h-6 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center -my-1"
            >
              <UIcon
                :name="item.icon"
                class="w-4 h-4 text-white dark:text-gray-900"
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
      <template #assigned-user>
        <div class="p-4">
            Filter by assigned user (to be implemented)
        </div>
      </template>
    </UAccordion>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { CourseActivityScheduleQuery } from "~/composables/useCourseActivitySchedules";

type Props = {
  form: Partial<CourseActivityScheduleQuery>;
};

const { t } = useI18n({
  useScope: "local",
});
const props = defineProps<Props>();
const _userOrganizationsStore = useUserOrganizationsStore();

const _schema = z.object({
  activity_id: z.string().uuid().optional(),
  status: z.enum(["PLANNED", "CANCELED", "COMPLETED"]).optional(),
  assigned_to: z.string().uuid().optional(),
  start_at: z.coerce.date().optional(),
});

console.log(props.form);

// const _filterForm = ref<z.infer<typeof _schema>>({
//   activity_id: props.form.activity_id,
//   status: props.form.status,
//   assigned_to: props.form.assigned_to,
//   start_at: props.form.start_at,
// });

const items = [
  {
    label: t("assigned_user"),
    icon: "i-heroicons-user-group-solid",
    defaultOpen: true,
    slot: "assigned-user",
  },
];
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "filter_schedules": "Termine filtern"
  },
  "en": {
    "filter_schedules": "Filter Schedules"
  }
}
</i18n>
