<template>
  <UPageHeader
    :title="t('setup_your_subscriptions_settings')"
    :description="t('setup_your_subscriptions_settings_description')"
  >
    <template #links>
      <UButton
        v-if="isSubscriptionSettingsSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        >{{
          g("weiter")
        }}</UButton
      >
    </template>
    <div 
    v-if="organizationsStore.selectedOrganization"
      class="py-12">
    daslö
    </div>
  </UPageHeader>
</template>

<script setup lang="ts">


const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const organizationsStore = useUserOrganizationsStore();
const isSubscriptionSettingsSetupComplete = computed(() => {
  return true;
});
</script>

<style scoped>

</style>