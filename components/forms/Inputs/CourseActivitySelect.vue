<template>
  <USelectMenu
    v-model="model"
    :searchable="searchCourseActivity"
    :searchable-placeholder="t('search_by_name_or_description')"
    :placeholder="t('select_a_course_activity')"
    value-attribute="id"
    :search-attributes="['name', 'email']"
  >
    <template #label>
      <div v-if="selected">
        <UAvatar :icon="'i-heroicons-document-text'" size="2xs" />
        <span class="truncate ms-3">{{ `${selected.name}` }}</span>
      </div>
      <div v-else>
        <UAvatar icon="i-heroicons-document-text" size="2xs" />
        <span class="truncate ms-3">{{ t("select_a_course_activity") }}</span>
      </div>
    </template>

    <template #option="{ option: activity }">
      <span class="truncate">{{ `${activity.name}` }}</span>
    </template>

    <template #option-empty="{ query }">
      {{ t("no_activity_found", { query }) }}
    </template>
    <template #empty>
      {{ t("no_activities") }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import type { AppCourseActivity } from "~/types/app.types";

type Props = {
  orgId: string;
  courseId?: string;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const courseActivitiesStore = useCourseActivitiesStore();
const model = defineModel<string>();
const courseActivities = ref<AppCourseActivity[]>([]);
const selected = computed(() => {
  return courseActivities.value.find((ca) => ca.id === model.value);
});

async function searchCourseActivity(search: string) {
  const res = await courseActivitiesStore.getCourseActivities(
    props.orgId,
    props.courseId,
    search.length >= 3 ? search : undefined
  );
  courseActivities.value = res;
  return res;
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "search_by_name_or_description": "Suche nach Name oder Beschreibung",
    "select_a_course_activity": "Wähle eine Kursaktivität",
    "no_activity_found": "'{query}' nicht gefunden",
    "no_activities": "Keine Kursaktivitäten"
  },
  "en": {
    "search_by_name_or_description": "Search by name or description",
    "select_a_course_activity": "Select a course activity",
    "no_activity_found": "'{query}' not found",
    "no_activities": "No course activities"
  }
}
</i18n>
