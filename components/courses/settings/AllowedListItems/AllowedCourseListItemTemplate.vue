<template>
  <div
    v-if="!isLoading"
    :class="`py-4 px-4 w-full`"
  >
    <div class="flex items-center gap-4">
      <div class="flex items-center flex-1 gap-2">
        <p class="text-sm font-medium break-all">
          {{
            t("driving_license_of_type", {
              type: g(`course_types.${props.course.type}.name`),
            })
          }}
        </p>
        <div v-if="isAllowed" class="flex items-center gap-2">
          <UBadge color="primary" variant="soft" size="sm">{{
            t("course_allowed")
          }}</UBadge>
        </div>
        <div v-else class="flex items-center gap-2">
          <UBadge color="white" variant="solid" size="sm">{{
            t("course_not_allowed")
          }}</UBadge>
        </div>
      </div>
      <div>
        <slot />
      </div>
      <div class="ml-auto">
        <div v-if="isAllowed" class="flex items-center gap-2">
          <UButton
            size="2xs"
            color="red"
            variant="soft"
            icon="i-heroicons-minus-circle"
            @click="() => removeCourseFromAllowedCourses()"
          />
        </div>
        <div v-else class="flex items-center gap-2">
          <UButton
            size="2xs"
            color="black"
            variant="solid"
            icon="i-heroicons-plus-circle"
            @click="() => addCourseToAllowedCourses()"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center py-4 px-4">
    <USkeleton class="h-6 w-full" />
  </div>
</template>

<script setup lang="ts">
import type { AppCourse } from "~/types/app.types";

type Props = {
  isLoading: boolean;
  isAllowed: boolean;
  course: AppCourse;
  removeCourseFromAllowedCourses: () => Promise<void>;
  addCourseToAllowedCourses: () => Promise<void>;
};

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "course_allowed": "Applied to class",
    "course_not_allowed": "Not applied",
    "driving_license_of_type": "Driving license of type {type}"
  },
  "de": {
    "course_allowed": "Auf der Klasse angewendet",
    "course_not_allowed": "Nicht angewendet",
    "driving_license_of_type": "Führerschein der Klasse {type}"
  }
}
</i18n>
