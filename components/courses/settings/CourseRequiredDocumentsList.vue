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
          >{{ t('create_btn_label') }}</UButton
        >
      </template>
      <UCard
        :ui="{
          body: {
            base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
          },
        }"
      >
        <div
          v-for="field in required_documents"
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
            >{{ t('change') }}</UButton
          >
        </div>
      </UCard>
    </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

const { t } = useI18n({
  useScope: 'local'
})


const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const client = useSupabaseClient<Database>()

  const { data:required_documents, error, status } = useAsyncData(`course_${props.courseid}_required_documents`, async () => {
    const { data, error } = await client.from('course_required_documents').select('*').eq('course_id', props.courseid)
    if (error) {
      console.log(error)
      throw error
    }
    return data ?? []
  })

function openEditCourseRequiredDocument(id: string) {
  console.log(id)
}
</script>

<style scoped>
</style>

<i18n lang="json">
  {
    "de": {
      "required_documents_settings_title": "Erforderliche Dokumente",
      "required_documents_settings_desc": "Erforderliche Dokumente, die Student:innen hochladen müssen",
      "create_btn_label": "Dokument hinzufügen",
      "change": "Ändern"
    },
    "en": {
      "required_documents_settings_title": "Required Documents",
      "required_documents_settings_desc": "Theses document have to be uploaded by the student",
      "create_btn_label": "Add document",
      "change": "Edit"
    }
  }
</i18n>

