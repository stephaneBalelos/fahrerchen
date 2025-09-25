<template>
  <UDashboardSection
    :title="t('required_documents_settings_title')"
    :description="t('required_documents_settings_desc')"
    orientation="horizontal"
    class="px-4 py-6"
  >
    <template #links>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        variant="soft"
        size="2xs"
        @click="openEditCourseRequiredDocument('')"
        >{{ t("create_btn_label") }}</UButton
      >
    </template>
    <UCard
      v-if="required_documents && required_documents.length > 0"
      :ui="{
        body: {
          base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
        },
      }"
    >
      <div
        v-for="field in required_documents"
        :key="field.id"
        class="flex items-center justify-between pt-4 first:pt-0 gap-2"
      >
        <div class="flex flex-col gap-1 grow">
          <p class="font-semibold">{{ field.name }}</p>
          <span class="text-sm text-gray-500">{{ field.description }}</span>
        </div>
        <UButton
          color="gray"
          variant="solid"
          @click="openEditCourseRequiredDocument(field.id)"
          >{{ t("change") }}</UButton
        >
      </div>
    </UCard>
    <UAlert
      v-else
      :title="t('no_documents')"
      :description="t('no_documents_description')"
    />
  </UDashboardSection>
</template>

<script setup lang="ts">
import EditCourseRequirementFrom from "~/components/forms/EditCourseRequirementFrom.vue";
const { t } = useI18n({
  useScope: "local",
});

const coursesStore = useCoursesStore();

const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const slideover = useSlideover();
const { data: required_documents, refresh } = await useAsyncData(
  async () => {
    return await coursesStore.getCourseRequiredDocuments(props.courseid);
  }, { immediate: true }
);

function openEditCourseRequiredDocument(id?: string) {
  slideover.open(EditCourseRequirementFrom, {
    courseid: props.courseid,
    orgid: props.orgid,
    requirementid: id,
    "onRequirement-created": () => {
      refresh();
      slideover.close();
    },
    "onRequirement-saved": () => {
      refresh();
      slideover.close();
    },
  });

}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "required_documents_settings_title": "Erforderliche Dokumente",
    "required_documents_settings_desc": "Erforderliche Dokumente, die Student:innen hochladen müssen",
    "create_btn_label": "Dokument hinzufügen",
    "change": "Ändern",
    "no_documents": "Keine Dokumente",
    "no_documents_description": "Es wurden noch keine Dokumente Anforderungen festgelegt"
  },
  "en": {
    "required_documents_settings_title": "Required Documents",
    "required_documents_settings_desc": "Theses document have to be uploaded by the student",
    "create_btn_label": "Add document",
    "change": "Edit",
    "no_documents": "No documents",
    "no_documents_description": "No document requirements have been set yet"
  }
}
</i18n>
