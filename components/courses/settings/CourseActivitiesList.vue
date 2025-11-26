<template>
  <div>
    <div
      v-if="courseActivitiesStore.courseActivities.length > 0"
      class="space-y-4"
    >
      <BodyCollapseCard
        v-for="field in courseActivitiesStore.courseActivities"
        :key="field.id"
      >
        <template #header="{}">
          <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
            <div class="flex flex-col gap-1 grow">
              <div>
                <UBadge
                  :color="ACTIVITY_COLORS[field.activity_type] || 'gray'"
                  size="xs"
                  class="mb-1"
                >
                  {{ g(`activities.types.${field.activity_type}.name`) }}
                </UBadge>
              </div>
              <p class="font-semibold">{{ field.name }}</p>
              <span class="text-sm text-gray-500">{{ field.description }}</span>
            </div>
            <div class="flex flex-grow items-center gap-8 justify-end mr-4">
              <div class="flex flex-col items-end gap-1">
                <p class="text-sm text-gray-500">{{ g(`activities.price`) }}</p>
                <p class="font-medium break-all">
                  {{ formatCurrency(field.price) }}
                </p>
              </div>
              <div class="flex flex-col items-end gap-1">
                <p class="text-sm text-gray-500">
                  {{ g(`activities.required_attendance`) }}
                </p>
                <p class="font-medium break-all">
                  {{ field.required > 0 ? field.required : "-" }}
                </p>
              </div>
            </div>
            <UButton
              color="gray"
              variant="solid"
              @click.stop="openEditActivityForm(field.id)"
              >{{ t("edit") }}</UButton
            >
            <UButton
              color="red"
              variant="soft"
              :icon="'i-heroicons-trash'"
              @click.stop="courseActivitiesStore.deleteCourseActivity(field.id)"
            />
          </div>
        </template>
        <div class="grid grid-cols-1 gap-4">
          <div class="flex flex-col gap-1 lg:col-span-2">
            <div class="flex justify-between">
              <p class="text-sm text-gray-500 mb-2">
                {{ g(`activities.allowed_classes`) }}
              </p>
            </div>
            <UCard
              :ui="{
                base: 'overflow-hidden',
                body: {
                  padding: 'sm:p-0 py-0 px-0',
                },
              }"
            >
              <div
                class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800"
              >
                <ActivitiesAllowedCourseListItem
                  v-for="course in courseStore.activeCourses"
                  :key="field.id + course.id"
                  :course="course"
                  :activity-id="field.id"
                />
              </div>
            </UCard>
          </div>
        </div>
      </BodyCollapseCard>
    </div>
    <UAlert
      v-else
      :title="t('no_activities')"
      :description="t('no_activities_description')"
      :actions="[
        {
          label: t('add_activity'),
          color: 'primary',
          icon: 'i-heroicons-plus',
          variant: 'soft',
          size: '2xs',
          click: () => openEditActivityForm(''),
        },
        {
          label: t('add_activity_from_template'),
          color: 'green',
          icon: 'i-heroicons-check-circle',
          variant: 'soft',
          size: '2xs',
          click: () => {
            createActivitiesFromTemplate();
          },
        },
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import EditCourseActivityForm from "~/components/forms/EditCourseActivityForm.vue";
import BodyCollapseCard from "~/components/ui/Cards/BodyCollapseCard.vue";
import { formatCurrency } from "~/utils/formatters";
import ActivitiesAllowedCourseListItem from "./AllowedListItems/ActivitiesAllowedCourseListItem.vue";
import { ACTIVITY_COLORS } from "~/constants";

const slideover = useSlideover();
const toast = useToast();
const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});

const courseStore = useCoursesStore();
const courseActivitiesStore = useCourseActivitiesStore();

const openEditActivityForm = (id?: string) => {
  slideover.open(EditCourseActivityForm, {
    courseActivityId: id,
    "onActivity-saved": () => {
      slideover.close();
      toast.add({
        title: t("activity_saved"),
        description: t("activity_saved_description"),
        color: "green",
      });
    },
    "onActivity-deleted": () => {
      slideover.close();
      toast.add({
        title: t("activity_deleted"),
        description: t("activity_deleted_description"),
        color: "green",
      });
    },
  });
};

const createActivitiesFromTemplate = async () => {
  try {
    await courseActivitiesStore.createActivitiesFromTemplate();
    toast.add({
      title: t("activity_created"),
      description: t("activity_saved_description"),
      color: "green",
    });
  } catch (error) {
    toast.add({
      title: t("error"),
      description: (error as Error).message,
      color: "red",
    });
  }
};


</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_activities": "Kursaktivitäten",
    "set_activities": "Setze die Aktivitäten für diesen Kurs.",
    "add_activity": "Aktivität hinzufügen",
    "add_activity_from_template": "Aktivitäten aus Vorlage hinzufügen",
    "no_activities": "Keine Aktivitäten",
    "no_activities_description": "Es gibt keine Aktivitäten für diesen Kurs. Fügen Sie Aktivitäten hinzu.",
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
    "add_activity_from_template": "Add Activity from Template",
    "no_activities": "No activities",
    "no_activities_description": "There are no activities for this course. Add activities.",
    "edit": "Edit",
    "activity_saved": "Activity saved",
    "activity_saved_description": "The Activity has been saved successfully.",
    "activity_deleted": "Activity deleted",
    "activity_deleted_description": "The Activity has been deleted successfully.",
    "activity_created": "Activity created"
  }
}
</i18n>
