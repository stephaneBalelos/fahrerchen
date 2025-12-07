<template>
  <ULandingHero
    :title="t('setup_completed_title')"
    :description="t('setup_completed_description')"
    :ui="{
      wrapper: 'py-0 sm:py-0 md:py-0',
    }"
  >
    <template #headline>
      <Icon name="i-heroicons-sparkles-20-solid" class="w-6 h-6 text-primary" />
    </template>
    <div>
      <p class="text-lg font-medium text-left">
        {{ t("setup_completed_next_steps") }}
      </p>
      <p class="text-sm text-left">
        {{ t("setup_completed_next_steps_description") }}
      </p>
      <div class="grid grid-cols-1 gap-4 mt-8 lg:grid-cols-2 text-left">
        <UAlert
          :actions="[
            {
              variant: 'solid',
              color: 'gray',
              label: t('go_to_course_management'),
              click: () => navigateToAfterSetup('/courses'),
            },
          ]"
          :title="t('course_management')"
          :description="t('course_management_description')"
        >
          <template #icon>
            <UAvatar
              size="lg"
              color="gray"
              icon="i-heroicons-book-open-20-solid"
            />
          </template>
        </UAlert>
        <UAlert
          :actions="[
            {
              variant: 'solid',
              color: 'gray',
              label: t('go_to_online_payments'),
              click: () => navigateToAfterSetup('/settings/payments'),
            },
          ]"
          :title="t('online_payments')"
          :description="t('online_payments_description')"
        >
          <template #icon>
            <UAvatar
              size="lg"
              color="gray"
              icon="i-heroicons-credit-card-20-solid"
            />
          </template>
        </UAlert>
        <UAlert
          :actions="[
            {
              variant: 'solid',
              color: 'gray',
              label: t('go_to_team_management'),
                click: () => navigateToAfterSetup('/settings/members'),

            },
          ]"
          :title="t('team_management')"
          :description="t('team_management_description')"
        >
          <template #icon>
            <UAvatar size="lg" color="gray" icon="i-heroicons-users-20-solid" />
          </template>
        </UAlert>
      </div>
    </div>
  </ULandingHero>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: "local",
});

const userOrganizationsStore = useUserOrganizationsStore();

const navigateToAfterSetup = async (url: string) => {
  if (userOrganizationsStore.selectedOrganization) {
    await userOrganizationsStore.updateOrganizationById(
      userOrganizationsStore.selectedOrganization.id,
      { setup_completed: true }
    );

    navigateTo(userOrganizationsStore.relativePath(url));
  } else {
    await navigateTo(`/my/`);
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "setup_completed_title": "Es kann losgehen!",
    "setup_completed_description": "Deine Fahrschule ist bereit. Du kannst jetzt beginnen, deine Fahrschüler:innen, deinen Staff und deine Termine hinzuzufügen.",
    "setup_completed_next_steps": "Nächste Schritte",
    "setup_completed_next_steps_description": "Hier sind einige Vorschläge, was du als nächstes tun kannst um das Beste aus Karjolen herauszuholen.",
    "course_management": "Kursverwaltung & Planung",
    "course_management_description": "Sehen Sie sich Ihre Kursangebote an und passen Sie die Details an.",
    "go_to_course_management": "Zur Kursverwaltung",
    "online_payments": "Online Zahlungen",
    "online_payments_description": "Richte Online Zahlungen ein, damit deine Fahrschüler:innen direkt online bezahlen können.",
    "go_to_online_payments": "Zu den Online Zahlungen",
    "team_management": "Team Verwaltung",
    "team_management_description": "Füge dein Team hinzu und verwalte deren Rollen und Berechtigungen.",
    "go_to_team_management": "Zur Team Verwaltung"
  },
  "en": {
    "setup_completed_title": "Setup Completed",
    "setup_completed_description": "Your driving school setup is now complete. You can now start adding courses and lessons to your organization.",
    "setup_completed_next_steps": "Next Steps",
    "setup_completed_next_steps_description": "Here are some suggestions for what you can do next to get the most out of Karjolen.",
    "course_management": "Course Management & Planning",
    "course_management_description": "View your course offerings and adjust the details.",
    "go_to_course_management": "Go to Course Management",
    "online_payments": "Online Payments",
    "online_payments_description": "Set up online payments so your students can pay directly online.",
    "go_to_online_payments": "Go to Online Payments",
    "team_management": "Team Management",
    "team_management_description": "Add your team and manage their roles and permissions.",
    "go_to_team_management": "Go to Team Management"
  }
}
</i18n>
