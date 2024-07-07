<template>
  <UDashboardLayout>
    <UDashboardPage>
      <UDashboardPanel grow>
        <UDashboardNavbar
          title="Dashboard"
          :badge="runtimeConfig.public.app_version"
        >
          <template #title>
            <NuxtLink to="/"> Dashboard </NuxtLink>
          </template>
          <template #right>
            <UserDropdown></UserDropdown>
          </template>
        </UDashboardNavbar>

        <slot></slot>
      </UDashboardPanel>
    </UDashboardPage>
  </UDashboardLayout>
</template>

<script setup lang="ts">
import UserDropdown from "@/navigation/UserMenu.vue";
const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const toast = useToast();

const runtimeConfig = useRuntimeConfig();
</script>

<style scoped></style>
