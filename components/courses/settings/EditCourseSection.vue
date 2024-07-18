<template>
  <UDashboardSection
    :title="t('general_settings_title')"
    :description="t('general_settings_desc')"
    orientation="horizontal"
    class="px-4 py-6"
  >
    <UCard v-if="status === 'success'"
      :ui="{
        body: {
          base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
        },
      }"
    >
      <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
        <div class="flex flex-col gap-1 grow">
          <div class="flex justify-start gap-1">
            <p class="font-semibold me-2">{{ course?.name }}</p>
            <UBadge color="primary" variant="subtle" size="xs"
              >Klasse {{ course?.type.type }}</UBadge
            >
          </div>
          <span class="text-sm text-gray-500">{{ course?.description }}</span>
        </div>
        <UButton
          color="gray"
          variant="solid"
          @click="openCourseEditForm()"
          >{{ t('change') }}</UButton
        >
      </div>
    </UCard>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import EditCourseForm from "~/components/forms/EditCourseForm.vue";
import { useCourseTypes } from "~/composables/useCourseTypes";

const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();
const slideover = useSlideover();

const { data:course, error, status, refresh }  = useAsyncData(async () => {
  const { data, error } = await client
    .from("courses")
    .select("*")
    .eq("id", props.courseid)
    .single();
    if (error) {
      console.error(error);
      throw error;
    }
  return data;
}, {
  transform: async (data) => {
    const courseType = await useCourseTypes(data.type);
    return {
      ...data,
      type: courseType,
    };
  },
});

function openCourseEditForm() {
  slideover.open(EditCourseForm, {
    course_id: props.courseid,
    "onCourse-updated": async () => {
      await refresh();
    },
  });
}

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "general_settings_title": "Allgemeine Einstellungen",
    "general_settings_desc": "Allgemeine Einstellungen für den Kurs",
    "change": "Ändern"
  },
  "en": {
    "general_settings_title": "General Settings",
    "general_settings_desc": "General settings for the course",
    "change": "Edit"
  }
}
</i18n>
