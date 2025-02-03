<script setup lang="ts">
import type { Database } from "~/types/database.types";
import EditCourseForm from "~/components/forms/EditCourseForm.vue";

definePageMeta({
  layout: "orgs",
});

const supabase = useSupabaseClient<Database>();
const toast = useToast();
const slideover = useSlideover();
const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const { data, refresh } = await useAsyncData(
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return;
    }
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq(
        "organization_id",
        userOrganizationsStore.selectedOrganization.organization_id
      );
    if (error) {
      throw error;
    }
    return data;
  },
  { immediate: true }
);

onMounted(async () => {
  await refresh();
});

const openCreateCourseForm = () => {
  slideover.open(EditCourseForm, {
    "onCourse-created": () => {
      refresh();
      slideover.close();
      toast.add({
        title: "Course created",
        description: "Course has been created successfully",
        color: "green",
      });
    },
  });
};
</script>

<template>
  <UDashboardPanel grow>
    <UDashboardNavbar :title="t('title')" />
    <UDashboardPanelContent>
      <UPageHeader
        class="courses-header"
        :headline="t('headline')"
        :title="t('title')"
        :description="t('description')"
        :links="[
          {
            label: t('create_course'),
            color: 'white',
            icon: 'i-heroicons-folder-plus',
            click: () => openCreateCourseForm(),
          },
        ]"
      />
      <div v-if="data && data?.length > 0" class="grid grid-cols-1 gap-3">
        <UDashboardCard
          v-for="(d, index) in data"
          :key="index"
          :title="d.name"
          class="course-card"
          :description="d.description ? d.description : t('no_description')"
          :links="[
            {
              label: t('open_course'),
              color: 'gray',
              trailingIcon: 'i-heroicons-arrow-right-20-solid',
              to: userOrganizationsStore.relativePath(`/courses/${d.id}`),
            },
          ]"
        />
      </div>
      <div v-else class="flex flex-col items-center justify-center max-w-lg mx-auto py-12">

        <p class="text-lg text-center mb-4">{{ t('no_courses') }}</p>
        <p class="text-gray-500 text-center mb-4">{{ t('no_courses_description') }}</p>
        <UButton id="create-course-btn" @click="openCreateCourseForm"
          >Create your first course</UButton
        >
      </div>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Kurse",
    "headline": "Kurse",
    "description": "Hier findest du alle Kurse, die du erstellt hast.",
    "create_course": "Kurs erstellen",
    "open_course": "Kurs öffnen",
    "no_description": "Keine Beschreibung vorhanden",
    "no_courses": "Keine Kurse vorhanden",
    "no_courses_description": "Erstelle deinen ersten Kurs, um loszulegen."
  },
  "en": {
    "title": "Courses",
    "headline": "Courses",
    "description": "Here you can find all courses you have created.",
    "create_course": "Create course",
    "open_course": "Open course",
    "no_description": "No description available",
    "no_courses": "No courses available",
    "no_courses_description": "Create your first course to get started."
  }
}
</i18n>
