<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="300"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar class="border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <ClientOnly>
            <TeamsDropdown />
          </ClientOnly>
        </template>
        <template #right>
          <ClientOnly>
            <!-- <NotificationsButton /> -->
          </ClientOnly>
        </template>
      </UDashboardNavbar>
      

      <UDashboardSidebar>
        <template #header>
          <!-- <UDashboardSearchButton /> -->
        </template>

       <SidebarLinks />

        <UDivider />

        <!-- <UDashboardSidebarLinks
            :links="[{ label: 'Colors', draggable: false, children: colors }]"
            @update:links="(links) => (defaultColors = links)"
          /> -->

        <template #footer>
            <UButton
              icon="i-heroicons-bell"
              size="sm"
              color="primary"
              square
              variant="ghost"
              @click="openNotificationsSlideover"
            />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <ClientOnly>
      <slot/>
      <!-- <LazyUiAppSearchComponent /> -->
    </ClientOnly>
  </UDashboardLayout>
</template>

<script setup lang="ts">
import NotificationsSlideover from "~/components/account/NotificationsSlideover.vue";
import SidebarLinks from "~/components/sidebar/SidebarLinks.vue";
import TeamsDropdown from "~/components/sidebar/TeamsDropdown.vue";


// const { t } = useI18n({
//   useScope: "local",
// });

const slideover = useSlideover();

const openNotificationsSlideover = () => {
  slideover.open(NotificationsSlideover)
};


// const footerLinks = [
//   {
//     label: "Invite people",
//     icon: "i-heroicons-plus",
//     to: "/my/settings/members",
//   },
//   {
//     label: "v" + runtimeConfig.public.app_version,
//   },
// ];

// const defaultColors = ref(
//   ["green", "teal", "cyan", "sky", "blue", "indigo", "violet"].map((color) => ({
//     label: color,
//     chip: color,
//     click: () => console.log(color),
//   }))
// );
// const colors = computed(() =>
//   defaultColors.value.map((color) => ({ ...color, active: false }))
// );
</script>

<style scoped></style>
