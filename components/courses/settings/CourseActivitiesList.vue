<template>
  <UDashboardSection
    :title="t('course_activities')"
    :description="t('set_activities')"
    orientation="horizontal"
    class="px-4 py-6"
  >
    <template #links>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        variant="soft"
        size="2xs"
        @click="openEditActivityForm('')"
        >{{ t('add_activity') }}</UButton
      >
    </template>
    <UCard
      :ui="{
        body: {
          base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
        },
      }"
    >
      <div
        v-for="field in course_activities"
        class="flex items-center justify-between pt-4 first:pt-0 gap-2"
      >
        <div class="flex flex-col gap-1 grow">
          <p class="font-semibold">{{ field.name }}</p>
          <div class="flex justify-start gap-1">
            <UBadge color="primary" variant="subtle" size="xs"
              >{{ field.price }} &euro;</UBadge
            >
          </div>
          <span class="text-sm text-gray-500">{{ field.description }}</span>
        </div>
        <UButton
          color="gray"
          variant="solid"
          @click="openEditActivityForm(field.id)"
          >{{ t('edit') }}</UButton
        >
      </div>
    </UCard>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import EditCourseActivityForm from "~/components/forms/EditCourseActivityForm.vue";

const supabase = useSupabaseClient<Database>();
const slideover = useSlideover();
const toast = useToast();
const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const {
  data: course_activities,
  error,
  status,
  refresh,
} = useAsyncData(`course_activities_${props.courseid}`, async () => {
  const { data } = await supabase
    .from("course_activities")
    .select("*")
    .eq("course_id", props.courseid)
    .order("name", { ascending: false });
  return data;
});

const openEditActivityForm = (id?: string) => {
  slideover.open(EditCourseActivityForm, {
    courseid: props.courseid,
    orgid: props.orgid,
    course_activity_id: id,
    "onActivity-saved": () => {
      slideover.close();
      refresh();
      toast.add({
        title: t('activity_saved'),
        description: t('activity_saved_description'),
        color: "green",
      });
    },
    "onActivity-deleted": () => {
      slideover.close();
      refresh();
      toast.add({
        title: t('activity_deleted'),
        description: t('activity_deleted_description'),
        color: "green",
      });
    },
  });
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_activities": "Kursaktivitäten",
    "set_activities": "Setze die Aktivitäten für diesen Kurs.",
    "add_activity": "Aktivität hinzufügen",
    "edit": "Bearbeiten",
    "activity_saved": "Aktivität gespeichert",
    "activity_saved_description": "Die Aktivität wurde erfolgreich gespeichert.",
    "activity_deleted": "Aktivität gelöscht",
    "activity_deleted_description": "Die Aktivität wurde erfolgreich gelöscht.",
    "activity_created": "Aktivität erstellt"
  },
  "en": {
    "course_activities": "Course Activities",
    "set_activities": "Set the Activities for this course.",
    "add_activity": "Add Activity",
    "edit": "Edit",
    "activity_saved": "Activity saved",
    "activity_saved_description": "The Activity has been saved successfully.",
    "activity_deleted": "Activity deleted",
    "activity_deleted_description": "The Activity has been deleted successfully.",
    "activity_created": "Activity created"
  }
}
</i18n>