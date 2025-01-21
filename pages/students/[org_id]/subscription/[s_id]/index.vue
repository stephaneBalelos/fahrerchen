<template>
  <UDashboardPanelContent>
    <UContainer v-if="subscription && studentStore.student" class="w-full">
      <StudentsStudentSubscriptionStats :subscription-id="subscription.id" />
    </UContainer>
    <UContainer v-if="subscription && studentStore.student" class="w-full pt-8">
      <StudentCourseProfile
        :title="t('progression')"
        :description="t('progression_desc')"
        :subscription-id="subscription.id"
        :student="studentStore.student"
      />
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import StudentCourseProfile from "~/components/courses/StudentCourseProfile.vue";
import type { Database } from "~/types/app.types";

const studentStore = useStudentStore();

const { t } = useI18n({
  useScope: "local",
});

const route = useRoute();
const subscriptionId = route.params.s_id as string;
const client = useSupabaseClient<Database>();

const { data: subscription } = useAsyncData(
  async () => {
    const { data, error } = await client
      .from("course_subscriptions_view")
      .select("*")
      .eq("id", subscriptionId)
      .single();
    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },
  { immediate: true }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "hello": "Hallo {name}",
    "subscription_description": "Du bist angemeldet für den Kurs {course}",
    "progression": "Kursfortschritt",
    "progression_desc": "Übersicht über deinen Kursfortschritt"
  },
  "en": {
    "hello": "Hello {name}",
    "subscription_description": "You are subscribed to the course {course}",
    "progression": "Course Progression",
    "progression_desc": "Overview of your course progression"
  }
}
</i18n>
