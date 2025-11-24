<template>
  <div>
    <div
      v-if="coursesStore.courses.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-12"
    >
      <UCard
        v-for="course in coursesStore.courses"
        :key="course.id"
        :ui="{
          base: 'flex flex-col',
          ring: `${course.is_active ? 'ring-2 ring-primary-500 ring-inset' : 'ring-gray-200 dark:ring-gray-800'}`,

          body: {
            base: 'flex-1',
          },
        }"
      >
        <template #header>
          <div class="flex items-center gap-4">
            <UAvatar
              size="lg"
              color="primary"
              :icon="COURSE_ICONS[course.type]"
            />
            <div class="flex items-center gap-2">
              <span class="text-lg font-semibold">{{
                t("driving_license_of_type", {
                  type: g(`course_types.${course.type}.name`),
                })
              }}</span>
            </div>
          </div>
        </template>
        <p>
          {{ g(`course_types.${course.type}.description`) }}
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              v-if="!course.is_active"
              data-label="activate-course"
              size="sm"
              color="primary"
              icon="i-heroicons-plus-circle"
              @click="() => coursesStore.setCourseActiveStatus(course.id, true)"
              >{{ t("activate_course") }}</UButton
            >
            <UBadge
              v-if="course.is_active"
              color="green"
              variant="soft"
              size="sm"
              >{{ t("course_activated") }}</UBadge
            >
            <UButton
              v-if="course.is_active"
              size="sm"
              color="red"
              variant="soft"
              icon="i-heroicons-trash"
              @click="
                () => coursesStore.setCourseActiveStatus(course.id, false)
              "
            />
          </div>
        </template>
      </UCard>
    </div>
    <div v-else>
      <div v-if="coursesStore.isLoadingCourses" class="space-y-2">
        <USkeleton class="h-24 w-full" />
        <USkeleton class="h-24 w-full" />
      </div>
      <UAlert
        v-else
        icon="i-heroicons-exclamation-triangle-20-solid"
        color="red"
        variant="subtle"
        :title="t('failed_to_load_courses')"
        :description="t('failed_to_load_courses_description')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { COURSE_ICONS } from "~/constants";

const { t } = useI18n({
  useScope: "parent",
});

const { t: g } = useI18n({
  useScope: "global",
});
const coursesStore = useCoursesStore();

</script>

<style scoped></style>
