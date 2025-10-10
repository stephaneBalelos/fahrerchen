<template>
  <USelectMenu
    v-if="courses"
    v-model="model"
    :options="courses"
    :placeholder="t('search')"
    value-attribute="id"
    :search-attributes="['name', 'description']"
  >
    <template #label>
      <div v-if="selected">
        <span class="truncate ms-3">{{ g(`course_types.${selected.type}.name_full`) }}</span>
      </div>
      <div v-else>
        <span class="truncate ms-3">{{ t("select_a_course") }}</span>
      </div>
    </template>

    <template #option="{ option: course }">
      <span>{{ g(`course_types.${course.type}.name_full`) }}</span>
    </template>

    <template #option-empty="{ query }">
      {{ t("no_courses_found", { query }) }}
    </template>
    <template #empty>
      {{ t("no_courses") }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">

type Props = {
  orgid: string;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({ useScope: 'global' });

const model = defineModel<string>({ default: null });
const coursesStore = useCoursesStore();

const courses = computed(() => {
  if (!props.orgid) return null;
  return coursesStore.activeCourses
});
const selected = computed(() => {
  if (!courses.value) {
    return null;
  }
  return courses.value.find((course) => course.id === model.value);
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "search": "Nach Kursen suchen",
    "select_a_course": "Wähle einen Kurs",
    "no_courses_found": "Keine Kurse gefunden für '{query}'",
    "no_courses": "Keine Kurse gefunden"
  },
  "en": {
    "search": "Search for courses",
    "select_a_course": "Select a course",
    "no_courses_found": "No courses found for '{query}'",
    "no_courses": "No courses found"
  }
}
</i18n>
