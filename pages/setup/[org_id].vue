<template>
  <ClientOnly>
    <UDashboardPanelContent>
      <UContainer class="w-full h-full">
        <UDashboardCard
          v-if="org"
          :ui="{
            base: 'flex flex-col h-full',
            body: {
              base: 'flex-grow relative',
            },
          }"
        >
          <template #header>
            <div class="w-full pb-4">
              <UTabs v-model="selected" :items="steps" />
            </div>
          </template>
          <div class="absolute inset-0 overflow-scroll">
            <div class="p-8">
              <FormsEditOrganizationForm
                v-if="selected === 0"
                :org-id="org.organization_id"
                :submit-label="t('continue')"
                @updated="onSchoolInformationsUpdated"
              />
              <div v-else-if="selected === 1">
                <CoursesSetup
                  :org-id="org.organization_id"
                  @course-setup-completed="onCourseSetupCompleted"
                />
              </div>
            </div>
          </div>
        </UDashboardCard>
      </UContainer>
    </UDashboardPanelContent>
  </ClientOnly>
</template>

<script setup lang="ts">
import CoursesSetup from "~/components/setup/CoursesSetup.vue";
definePageMeta({
  layout: "default",
});

const { t } = useI18n({
  useScope: "local",
});

const route = useRoute();
const org_id = route.params.org_id as string;
const organizationsStore = useUserOrganizationsStore();
const org = computed(() => {
  return (
    organizationsStore.organizations.find(
      (o) => o.organization_id === org_id
    ) || null
  );
});
const steps = [
  {
    key: "school_informations",
    label: t("driving_school_informations"),
    icon: "i-heroicons-building-office-20-solid",
  },
  {
    key: "courses_and_lessons",
    label: t("courses_and_lessons"),
    icon: "i-heroicons-book-open-20-solid",
  },
  {
    key: "setup_complete",
    label: t("setup_complete"),
    icon: "i-heroicons-check-circle-20-solid",
    content: "Finally, this is the content for Tab3",
  },
];

const selected = ref(0);

const onSchoolInformationsUpdated = () => {
  // Handle any actions needed after school informations are updated
  selected.value = 1; // Move to the next tab
  console.log("School informations updated, moving to next step.");
};

const onCourseSetupCompleted = () => {
  selected.value = 2; // Move to the final tab
  console.log("Course setup completed, moving to final step.");
};

watch(selected, (newValue) => {
  if (newValue < 0 || newValue >= steps.length) {
    selected.value = 0;
  }
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "driving_school_informations": "Fahrschul-Informationen",
    "courses_and_lessons": "Kurse und Fahrstunden",
    "setup_complete": "Einrichtung abgeschlossen",
    "continue": "Weiter"
  },
  "en": {
    "driving_school_informations": "Driving school informations",
    "courses_and_lessons": "Courses and lessons",
    "setup_complete": "Setup complete",
    "continue": "Continue"
  }
}
</i18n>
