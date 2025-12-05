<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-4">
      <div
        v-if="activities && activities.length > 0"
        class="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div v-for="activity in activities" :key="activity.id">
          <CourseActivityCard :activity="activity" @updated="refresh" />
        </div>
      </div>
      <div v-else-if="activities && activities.length == 0" class="text-center py-16">
        <UAlert
          :title="t('no_activities')"
          :description="t('no_activities_description')"
          :actions="[
            {
              label: t('add_activity'),
              color: 'primary',
              icon: 'i-heroicons-plus',
              variant: 'soft',
              size: '2xs',
              click: () => createCourseActivity(),
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
      <div v-if="activities && activities.length > 0" class="flex items-center justify-end mb-4">
        <UButton
          color="primary"
          variant="solid"
          icon="i-heroicons-plus"
          @click="createCourseActivity"
        >
          {{ t("add_activity") }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CourseActivityCard from "../courses/CourseActivityCard.vue";
import EditCourseActivityForm from "../forms/EditCourseActivityForm.vue";

type Props = {
  organizationId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();
const slideover = useSlideover();
const toast = useToast();

const { data: activities, refresh } = await useAsyncData(
  `course-activities-${props.organizationId}`,
  async () => {
    return courseActivitiesStore.getCourseActivities(props.organizationId);
  }
);

function createCourseActivity() {
  slideover.open(EditCourseActivityForm, {
    "onActivity-saved": () => {
      slideover.close();
      refresh();
    },
    preventClose: true,
  });
}

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
    "no_activities": "Keine Aktivitäten",
    "no_activities_description": "Es wurden noch keine Aktivitäten für diesen Kurs erstellt.",
    "add_activity": "Neue Aktivität hinzufügen"
  },
  "en": {
    "no_activities": "No activities",
    "no_activities_description": "No activities have been created for this course yet.",
    "add_activity": "Add new activity"
  }
}
</i18n>
