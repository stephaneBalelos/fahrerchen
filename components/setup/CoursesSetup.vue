<template>
  <UDashboardSection
    icon="i-heroicons-user"
    :title="t('compose_your_courses')"
    :description="t('compose_your_courses_description')"
  >
  <template #links>

      <UDropdown :items="createOptions">
        <UButton
          color="gray"
          icon="i-heroicons-plus"
          :label="t('create_new_course')"
          />
      </UDropdown>
      <UButton
        v-if="isCourseSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="$emits('course-setup-completed')"
        >{{ t("course_setup_complete") }}</UButton
      >
    </template>
    <div v-if="!coursesStore.isLoadingCourses && coursesStore.courses.length > 0">
      <UDashboardSection
        v-for="course in coursesStore.courses"
        :key="course.id"
        :title="course.name"
        :description="course.description"
        class="p-4 mt-0 border border-gray-400 dark:border-gray-800 rounded-lg mb-4"
      >
        <template #icon>
          <UAvatar size="lg" color="primary" :icon="COURSE_ICONS['A']" />
        </template>
        <template #links>
          <UButton
            size="sm"
            color="gray"
            :label="t('edit_course')"
            icon="i-heroicons-pencil-square"
            @click="() => {
                openCreateCourseModal(course.id);
            }"
          />
          <UButton
            size="sm"
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            @click="() => deleteCourse(course.id)"
          />
        </template>
        <CourseCostsList
          :orgid="course.organization_id"
          :courseid="course.id"
        />

        <CourseActivitiesList
          :orgid="course.organization_id"
          :courseid="course.id"
        />

        <CourseRequirementsList
          :orgid="course.organization_id"
          :courseid="course.id"
        />
      </UDashboardSection>
    </div>
    <div v-else>
      <UPageHero
        :title="t('no_courses')"
        :description="t('no_courses_description')"
        :align="'center'"
        :links="[
          {
            label: t('use_default_course_template'),
            click: () => openCreateCourseFromTemplateModal(),
            color: 'primary',
          },
          {
            label: t('manually_create_new_course'),
            click: () => openCreateCourseModal(),
            color: 'gray',
          },
        ]"
      />
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { COURSE_ICONS } from "~/constants";
import EditCourseForm from "../forms/EditCourseForm.vue";
import CourseActivitiesList from "../courses/settings/CourseActivitiesList.vue";
import CourseCostsList from "../courses/settings/CourseCostsList.vue";
import CourseRequirementsList from "../courses/settings/CourseRequiredDocumentsList.vue";
import CreateCourseFromTemplateModal from "../forms/CreateCourseFromTemplateModal.vue";

const { t } = useI18n({
  useScope: "local",
});

const modal = useModal();
const userOrganizationsStore = useUserOrganizationsStore();
const coursesStore = useCoursesStore();
const $emits = defineEmits(["course-setup-completed"]);

const createOptions = ref([[
  {
    label: t("use_default_course_template"),
    click: () => openCreateCourseFromTemplateModal(),
  },
  {
    label: t("manually_create_new_course"),
    click: () => openCreateCourseModal(),
  },
]]);



const openCreateCourseModal = (course_id?: string) => {
  if (userOrganizationsStore.selectedOrganization) {
    modal.open(EditCourseForm, {
      organizationId:
        userOrganizationsStore.selectedOrganization.organization_id,
        courseId: course_id,
      "onCourse-created": async () => {
        await coursesStore.loadCourses();
        modal.close();
      },
      "onCourse-updated": async () => {
        await coursesStore.loadCourses();
        modal.close();
      },
    });
  }
};

const openCreateCourseFromTemplateModal = () => {
  if (userOrganizationsStore.selectedOrganization) {
    modal.open(CreateCourseFromTemplateModal, {
      "onCourse-created": async () => {
        console.log("Course created from template");
        modal.close();
        await nextTick();
        await coursesStore.loadCourses();
      },
      "onClose": () => {
        modal.close();
      },
    });
  }
};

const deleteCourse = async (course_id: string) => {
  if (confirm(t("confirm_delete_course"))) {
    await coursesStore.deleteCourse(course_id);
    await coursesStore.loadCourses();
  }
};

const isCourseSetupComplete = computed(() => {
  return (
    coursesStore.courses &&
    coursesStore.courses.length > 0
  );
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "compose_your_courses": "Kurse zusammenstellen",
    "compose_your_courses_description":
      "Erstellen Sie Kurse und fügen Sie Aktivitäten, Kosten und erforderliche Dokumente hinzu.",
    "create_new_course": "Neuen Kurs erstellen",
    "use_default_course_template": "Standard-Kursvorlage verwenden",
    "manually_create_new_course": "Neuen Kurs manuell erstellen",
    "course_setup_complete": "Kurseinrichtung abgeschlossen",
    "no_courses": "Keine Kurse",
    "no_courses_description":
      "Es wurden noch keine Kurse erstellt. Klicken Sie unten, um Ihren ersten Kurs zu erstellen.",
    "create_course": "Kurs erstellen",
    "edit_course": "Kurs bearbeiten",
    "confirm_delete_course": "Sind Sie sicher, dass Sie diesen Kurs löschen möchten?",
    "course_saved": "Kurs gespeichert",
    "course_saved_description": "Der Kurs wurde erfolgreich gespeichert.",
    "course_deleted": "Kurs gelöscht",
    "course_deleted_description": "Der Kurs wurde erfolgreich gelöscht."
  },
  "en": {
    "compose_your_courses": "Compose your courses",
    "compose_your_courses_description":
      "Create courses and add activities, costs, and required documents.",
    "create_new_course": "Create new course",
    "use_default_course_template": "Use default course template",
    "manually_create_new_course": "Manually create new course",
    "course_setup_complete": "Course setup complete",
    "no_courses": "No courses",
    "no_courses_description":
      "No courses have been created yet. Click below to create your first course.",
    "create_course": "Create course",
    "edit_course": "Edit course",
    "confirm_delete_course": "Are you sure you want to delete this course?",
    "course_saved": "Course saved",
    "course_saved_description": "The course has been successfully saved.",
    "course_deleted": "Course deleted",
    "course_deleted_description": "The course has been successfully deleted."
  }
}
</i18n>"
