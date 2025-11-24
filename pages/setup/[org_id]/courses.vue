<template>
  <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full">
        <div class="flex items-center gap-4 justify-between">
          <div class="flex flex-col">
            <h3
              class="text-xl font-semibold leading-6 text-gray-900 dark:text-white mb-2"
            >
              {{ t("driving_school_informations") }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t("please_verify") }}
            </p>
          </div>
        </div>
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <UContainer class="w-full max-w-full">
          <CoursesSetup
            v-if="userOrganizationsStore.selectedOrganization"
            :org-id="userOrganizationsStore.selectedOrganization?.id"
            @course-setup-completed="
              () =>
                navigateTo(
                  `/setup/${userOrganizationsStore.selectedOrganization?.id}/activities`
                )
            "
          />
        </UContainer>
      </div>
    </div>
    <div
      class="w-full relative py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end px-8"
    >
      <UButton
        v-if="userOrganizationsStore.selectedOrganization"
        data-label="next-step"
        :to="`/setup/${userOrganizationsStore.selectedOrganization.id}/activities`"
      >
        {{ t("continue_setup") }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import CoursesSetup from "~/components/setup/CoursesSetup.vue";
const userOrganizationsStore = useUserOrganizationsStore();
// const coursesStore = useCoursesStore();

const { t } = useI18n({
  useScope: "local",
});
</script>

<style scoped></style>
