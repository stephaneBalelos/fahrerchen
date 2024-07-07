<template>
    <UDashboardLayout>
      <UDashboardPage>
        <UDashboardPanel grow>
          <UDashboardNavbar title="Dashboard" badge="premium">

            <template #title>
              <NuxtLink to="/">
                Dashboard 
              </NuxtLink>
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
import UserDropdown from '@/navigation/UserMenu.vue';
const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();

const user = useSupabaseUser();
const supabase = useSupabaseClient();
const toast = useToast();

</script>

<style scoped></style>
