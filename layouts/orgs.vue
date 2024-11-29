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

        <!-- <UDashboardSidebarLinks :links="links" /> -->

        <UDivider />

        <!-- <UDashboardSidebarLinks
            :links="[{ label: 'Colors', draggable: false, children: colors }]"
            @update:links="(links) => (defaultColors = links)"
          /> -->

        <div class="flex-1" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- <UDashboardSidebarLinks :links="footerLinks" /> -->
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <ClientOnly>
      <slot></slot>
    </ClientOnly>
  </UDashboardLayout>
</template>

<script setup lang="ts">
import TeamsDropdown from "~/components/sidebar/TeamsDropdown.vue";

const runtimeConfig = useRuntimeConfig();


const { t } = useI18n({
  useScope: "local",
});

const links = computed(() => [
  {
    id: "dashboard",
    label: "Dashboard [NOT IMPLEMENTED]",
    icon: "i-heroicons-chart-pie",
    to: "/my",
    tooltip: {
      text: "Dashboard",
      shortcuts: ["G", "D"],
    },
  },
  {
    id: "students",
    label: "Students",
    icon: "i-heroicons-user-group",
    to: "/my/students",
    tooltip: {
      text: "Students",
      shortcuts: ["G", "U"],
    },
  },
  {
    id: "courses",
    label: "Courses",
    icon: "i-heroicons-book-open",
    to: "/my/courses",
    tooltip: {
      text: "Courses",
      shortcuts: ["G", "C"],
    },
  },
  {
    id: "bills",
    label: "Bills",
    icon: "i-heroicons-credit-card",
    to: "/my/bills",
    tooltip: {
      text: "Bills",
      shortcuts: ["G", "B"],
    },
  },
  {
    id: "settings",
    label: "Settings",
    to: "/my/settings",
    icon: "i-heroicons-cog-8-tooth",
    children: [
      {
        label: "General [NOT IMPLEMENTED]",
        to: "/my/settings",
        exact: true,
      },
      {
        label: "Members",
        to: "/my/settings/members",
      },
      {
        label: "Payments",
        to: "/my/settings/payments",
      },
    ],
    tooltip: {
      text: "Settings",
      shortcuts: ["G", "S"],
    },
  },
]);

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
