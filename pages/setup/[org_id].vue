<template>
  <div>
    <UHeader v-if="organization" :links="links">
      <template #logo>
        <div class="flex items-center gap-2">
          <UAvatar
            v-if="organization.avatar_path"
            :src="
              $publicStorageUrl(
                'organizations_avatars',
                organization.avatar_path
              ) ?? undefined
            "
            :size="'sm'"
            :alt="organization.name"
          />
          <UAvatar
            v-else
            :icon="'i-heroicons-building-office-20-solid'"
            :size="'sm'"
            :alt="organization.name"
          />
        </div>
      </template>
      <template #panel>

        <UNavigationTree :links="links" />
      </template>
      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>
    <UMain class="min-h-screen py-6">
      <UContainer class="w-full">
        <ClientOnly>
          <NuxtPage />
        </ClientOnly>
      </UContainer>
    </UMain>
  </div>
</template>

<script setup lang="ts">
const userOrganizationsStore = useUserOrganizationsStore();
const organization = computed(
  () => userOrganizationsStore.selectedOrganization
);

const route = useRoute();
const { t } = useI18n({
  useScope: "local",
});

const courseStore = useCoursesStore();
const courseActivitiesStore = useCourseActivitiesStore();
const courseCostsStore = useCourseCostsStore();
// const courseRequiredDocumentsStore = useCourseRequiredDocumentsStore();

const links = computed(() => {
  const basePath = `/setup/${organization.value?.id}`;
  return [
    {
      label: t("general_info"),
      to: `${basePath}`,
      icon: "i-heroicons-information-circle-20-solid",
      isActive: route.path === `${basePath}/general-info`,
      exact: true,
    },
    {
      label: t("courses"),
      to: `${basePath}/courses`,
      icon: "i-heroicons-academic-cap-20-solid",
      isActive: route.path === `${basePath}/courses`,
    },
    {
      label: t("courses_activities"),
      to: `${basePath}/activities`,
      icon: "i-heroicons-cube",
      isActive: route.path === `${basePath}/courses-activities`,
      disabled: courseStore.activeCourses.length === 0,
    },
    {
      label: t("course_costs"),
      to: `${basePath}/costs`,
      icon: "i-heroicons-currency-euro",
      isActive: route.path === `${basePath}/course-costs`,
      disabled:
        courseStore.activeCourses.length === 0 ||
        courseActivitiesStore.courseActivities.length === 0,
    },
    {
      label: t("required_documents"),
      to: `${basePath}/required-documents`,
      icon: "i-heroicons-document-text-20-solid",
      isActive: route.path === `${basePath}/required-documents`,
      disabled:
        courseStore.activeCourses.length === 0 ||
        courseActivitiesStore.courseActivities.length === 0 ||
        courseCostsStore.courseCosts.length === 0,
    },
  ];
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "general_info": "Allgemeine Informationen",
    "courses_activities": "Kursaktivitäten",
    "course_costs": "Kurskosten",
    "required_documents": "Erforderliche Dokumente"
  },
  "en": {
    "general_info": "General Info",
    "courses_activities": "Course Activities",
    "course_costs": "Course Costs",
    "required_documents": "Required Documents"
  }
}
</i18n>
