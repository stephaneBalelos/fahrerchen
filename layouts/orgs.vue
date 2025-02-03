<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="250"
      :resizable="{ min: 200, max: 300 }"
      collapsible
    >
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <ClientOnly>
            <TeamsDropdown />
          </ClientOnly>
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

       <SidebarLinks />

        <UDivider />

        <!-- <UDashboardSidebarLinks
            :links="[{ label: 'Colors', draggable: false, children: colors }]"
            @update:links="(links) => (defaultColors = links)"
          /> -->

        <div class="flex-1" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <LocaleSwitcher />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <ClientOnly>
      <slot></slot>
    </ClientOnly>
  </UDashboardLayout>
</template>

<script setup lang="ts">
import LocaleSwitcher from "~/components/settings/LocaleSwitcher.vue";
import SidebarLinks from "~/components/sidebar/SidebarLinks.vue";
import TeamsDropdown from "~/components/sidebar/TeamsDropdown.vue";

const runtimeConfig = useRuntimeConfig();


const { t } = useI18n({
  useScope: "local",
});



const footerLinks = [
  {
    label: "Invite people",
    icon: "i-heroicons-plus",
    to: "/my/settings/members",
  },
  {
    label: "v" + runtimeConfig.public.app_version,
  },
];

const defaultColors = ref(
  ["green", "teal", "cyan", "sky", "blue", "indigo", "violet"].map((color) => ({
    label: color,
    chip: color,
    click: () => console.log(color),
  }))
);
const colors = computed(() =>
  defaultColors.value.map((color) => ({ ...color, active: false }))
);
</script>

<style scoped></style>
