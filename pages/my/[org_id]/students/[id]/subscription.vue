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
      <UDashboardCard
        v-if="!data?.archived_at"
        :title="t('archive_subscription_label')"
        :description="t('archive_subscription_description')"
      >
        <template #links>
          <UButton
            variant="ghost"
            color="primary"
            @click="archiveSubscription"
          >
            {{ t("archive_subscription") }}
          </UButton>
        </template>
      </UDashboardCard>
      <UDashboardCard
        :title="t('delete_subscription_label')"
        :description="t('delete_subscription_description')"
      >
        <template #links>
          <UButton variant="ghost" color="red" @click="deleteSubscription">
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

const route = useRoute();
const subscription_id = route.params.id as string;

const client = useSupabaseClient<Database>();

const toast = useToast();

const { data, refresh } = useAsyncData(async () => {
    const { data, error } = await client
      .from("course_subscriptions")
      .select(
        "*, course:courses(id, name, description, course_required_documents(*))"
      )
      .eq("id", subscription_id)

      .single();

    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  }
);

async function archiveSubscription() {
  try {
    const { error } = await client
      .from("course_subscriptions")
      .update({
        archived_at: new Date().toISOString(),
      })
      .eq("id", subscription_id);

    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: t("subscription_archived"),
      description: t("subscription_archived_description"),
      color: "green",
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while archiving the subscription.",
      color: "red",
    });
  } finally {
    refresh();
  }
}

async function deleteSubscription() {
  if(!data.value) {
    return
  }
  try {
    const { error } = await client
      .from("course_subscriptions")
      .delete()
      .eq("id", subscription_id);

    if (error) {
      console.error(error);
      throw error;
    }
    toast.add({
      title: t("subscription_deleted"),
      description: t("subscription_deleted_description"),
      color: "green",
    });
    navigateTo(`/my/${data.value.organization_id}/students`);
  } catch (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description: "An error occurred while deleting the subscription.",
      color: "red",
    });
  }
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
    "delete_subscription": "Aus dem Kurs austragen",
    "subscription_archived": "Subscription archiviert",
    "subscription_archived_description": "Der Student wurde erfolgreich aus dem Kurs archiviert.",
    "subscription_deleted": "Subscription gelöscht",
    "subscription_deleted_description": "Der Student wurde erfolgreich aus dem Kurs gelöscht."
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
    "delete_subscription": "Unsubscribe from course",
    "subscription_archived": "Subscription archived",
    "subscription_archived_description": "The student has been successfully archived from the course.",
    "subscription_deleted": "Subscription deleted",
    "subscription_deleted_description": "The student has been successfully deleted from the course."
  }
}
</i18n>
