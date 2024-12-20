<template>
  <UDashboardPanelContent>
    <UContainer class="w-full">
      <UDashboardSection
        v-if="studentStore.subscription"
        icon="i-heroicons-user"
        :title="t('hello', { name: studentStore.subscription.student_firstname })"
        :description="t('subscription_description', { course: studentStore.subscription.course_name })"
        orientation="vertical"
        card
      >
        <StudentsStudentActivitiesSection
          v-if="studentStore.subscription"
          :subscription_id="studentStore.subscription?.id"
        />
      </UDashboardSection>
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import { sub } from 'date-fns';

const studentStore = useStudentStore();

const { t } = useI18n({
  useScope: "local",
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "hello": "Hallo {name}",
    "subscription_description": "Du bist angemeldet für den Kurs {course}"
  },
  "en": {
    "hello": "Hello {name}",
    "subscription_description": "You are subscribed to the course {course}"
  }
}
</i18n>
