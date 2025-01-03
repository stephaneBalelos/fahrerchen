<template>
  <UDashboardSection
    :title="t('course_subscription')"
    :description="t('course_subscription_description')"
  >
    <div class="grid grid-cols-1 gap-4">
      <UDashboardCard
        :title="data?.course?.name"
        :description="data?.course?.description"
      >
        <template #links>
          <UButton
            :to="`/my/${data?.organization_id}/courses/${data?.course_id}`"
            variant="ghost"
          >
            {{ t("view_course") }}
          </UButton>
        </template>
      </UDashboardCard>
      <UDashboardCard
        v-if="data && data.course?.course_required_documents"
        class="mb-4"
        :title="t('course_required_documents')"
        :description="t('course_required_documents_description')"
      >
        <CourseRequiredDocumentItem
          v-for="doc in data.course.course_required_documents"
          :key="doc.id"
          :doc="doc"
          :bucket-id="'course_subscription_documents'"
          :path="`${doc.organization_id}/${data.id}/${doc.id}`"
        />
      </UDashboardCard>
      <UDivider />
        <UDashboardCard :title="t('archive_subscription_label')" :description="t('archive_subscription_description')">
            <template #links>
            <UButton
                variant="ghost"
                color="primary"
                @click="_archiveSubscription"
            >
                {{ t("archive_subscription") }}
            </UButton>
            </template>
        </UDashboardCard>
        <UDashboardCard :title="t('delete_subscription_label')" :description="t('delete_subscription_description')">
            <template #links>
            <UButton
                variant="ghost"
                color="red"
                @click="_deleteSubscription"
            >
                {{ t("delete_subscription") }}
            </UButton>
            </template>
        </UDashboardCard>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import CourseRequiredDocumentItem from "~/components/files/CourseDocuments/CourseRequiredDocumentItem.vue";

const { t } = useI18n({
  useScope: "local",
});

type Props = {
  subscription_id: string;
};

const props = useAttrs() as Props;

const client = useSupabaseClient<Database>();

const { data } = useAsyncData(
  `course_progression_${props.subscription_id}`,
  async () => {
    const { data, error } = await client
      .from("course_subscriptions")
      .select(
        "*, course:courses(id, name, description, course_required_documents(*), course_activities(*, attendances:course_activity_attendances(count)))"
      )
      .eq("id", props.subscription_id)

      .single();

    if (error) {
      throw error;
    }
    return data;
  }
);

function _archiveSubscription() {
  console.log("archive subscription");
}

function _deleteSubscription() {
  console.log("delete subscription");
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_subscription": "Führerschein Kurs",
    "course_subscription_description": "Angemeldet seit 12.12.2021",
    "view_course": "Kurs ansehen",
    "course_required_documents": "Anmeldeunterlagen",
    "course_required_documents_description": "Alle Dokumente, die für den Kurs benötigt werden.",
    "archive_subscription_label": "Subscription archivieren",
    "archive_subscription_description": "Tragen Sie den Studenten aus dem Kurs aus, ohne ihn zu löschen.",
    "archive_subscription": "Archivieren",
    "delete_subscription_label": "Subscription löschen",
    "delete_subscription_description": "Löschen dieses Student dauerhaft aus dem Kurs.",
    "delete_subscription": "Aus dem Kurs austragen"
  },
  "en": {
    "course_subscription": "Course Subscription",
    "course_subscription_description": "Enrolled since 12.12.2021",
    "view_course": "View Course",
    "course_required_documents": "Course Required Documents",
    "course_required_documents_description": "All documents required for the course.",
    "archive_subscription_label": "Archive Subscription",
    "archive_subscription_description": "Archive the student from the course without deleting them.",
    "archive_subscription": "Archive Subscription",
    "delete_subscription_label": "Delete Subscription",
    "delete_subscription_description": "Unsubscribe this student from the course permanently.",
    "delete_subscription": "Unsubscribe from course"
  }
}
</i18n>
