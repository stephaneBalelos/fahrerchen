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
        <UAvatar
          :icon="'i-heroicons-document-text'"
          size="2xs"
        />
        <span class="truncate ms-3">{{
          `${selected.name}`
        }}</span>
      </div>
      <div v-else>
        <UAvatar icon="i-heroicons-document-text" size="2xs" />
        <span class="truncate ms-3">{{ t("select_a_course_activity") }}</span>
      </div>
    </template>

    <template #option="{ option: activity }">
      <span class="truncate">{{
        `${activity.name}`
      }}</span>
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
import type {
  AppCourseActivity,
  Database,
} from "~/types/app.types";

type Props = {
  orgId: string;
  courseId: string;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();

const model = defineModel<string>({ default: null });
const courseActivties = ref<AppCourseActivity[] | null>(null);
const selected = computed(() => {
  if (!courseActivties.value) {
    return null;
  }
  return courseActivties.value.find((ca) => ca.id === model.value);
});

async function searchCourseActivity(search: string) {
  let q;
  if (search.length < 3) {
    q = client
      .from("course_activities")
      .select("*")
      .eq("organization_id", props.orgId)
      .eq("course_id", props.courseId)
      .limit(5);
  } else {
    q = await client
      .from("course_activities")
      .select("*")
      .eq("organization_id", props.orgId)
      .eq("course_id", props.courseId)
      .or(
        `name.ilike.%${search}%,description.ilike.%${search}%`
      )
      .limit(5);
  }
  const { data, error } = await q;
  if (error) {
    throw error;
  }
  courseActivties.value = data;
  return data;
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
