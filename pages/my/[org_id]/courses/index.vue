<template>
  <UDashboardPanelContent>
    <UPageHeader
      class="courses-header"
      :headline="t('headline')"
      :title="t('title')"
      :description="t('description')"
    />
    <div
      v-if="coursesStore.courses && coursesStore.courses.length > 0"
      class="grid grid-cols-1 lg:grid-cols-2 gap-2"
    >
      <UCard v-for="(d, index) in coursesStore.courses" :key="index">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <div class="flex flex-col flex-1 items-start">
              <p class="font-medium">
                {{ g(`course_types.${d.type}.name_full`) }}
              </p>
              <!-- <p class="text-xs text-gray-500 truncate w-full">{{ g(`course_types.${d.type}.description`) }}</p> -->
            </div>
            <UButton
              color="white"
              size="xs"
              icon="i-heroicons-pencil"
              @click="() => {}"
              >{{ t("open_course") }}</UButton
            >
          </div>
        </template>
        <div class="flex flex-col gap-8">
          <CourseCostsList :course-id="d.id" />
          <CourseActivitiesList :course-id="d.id" />
        </div>
        <template #footer>
          <div class="flex justify-between items-center gap-4">
            <div class="flex gap-2">
              <UBadge
                v-if="d.is_active"
                color="green"
                variant="soft"
                :label="t('active')"
              />
              <UBadge v-if="d.is_active" color="white">
                {{
                  t("active_subscription_count", {
                    count: subscriptionStore.subscriptions.filter(
                      (s) => s.course_id === d.id && s.archived_at === null
                    ).length,
                  })
                }}
              </UBadge>
              <UBadge v-else color="white">
                {{
                  t("total_subscription_count", {
                    count: subscriptionStore.subscriptions.filter(
                      (s) => s.course_id === d.id
                    ).length,
                  })
                }}
              </UBadge>
            </div>
            <div class="flex flex-col items-end">
              <p class="text-sm text-gray-500">
                {{ t("total_costs") }}
              </p>
              <p class="font-medium">
                {{ formatCurrency(1200) }}
              </p>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import CourseCostsList from "~/components/courses/CourseCostsList.vue";
import CourseActivitiesList from "~/components/courses/CourseActivitiesList.vue";
import { formatCurrency } from "~/utils/formatters";

definePageMeta({
  layout: "orgs",
});

// const toast = useToast();
// const slideover = useSlideover();
const coursesStore = useCoursesStore();
const subscriptionStore = useSubscriptionStore();

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});
</script>
<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Kurseangebote",
    "headline": "Kurse",
    "description": "Hier findest du alle Kurse, die deine Fahrschule anbietet.",
    "open_course": "Kurs bearbeiten",
    "no_courses": "Es sind noch keine Kurse angelegt.",
    "no_courses_description": "Lege jetzt deinen ersten Kurs an, um Fahrstunden zu buchen.",
    "active": "Aktiv",
    "active_subscription_count": "{count} aktive Anmeldung(en)",
    "total_subscription_count": "{count} Anmeldung(en)",
    "total_costs": "Kurs gesamt ab"
  },
  "en": {
    "title": "Course offerings",
    "headline": "Courses",
    "description": "Here you can find all the courses your driving school offers.",
    "open_course": "Edit course",
    "no_courses": "No courses have been created yet.",
    "no_courses_description": "Create your first course now to book driving lessons.",
    "active": "Active",
    "active_subscription_count": "{count} active subscription(s)",
    "total_subscription_count": "{count} subscription(s)",
    "total_costs": "Course total from"
  }
}
</i18n>
