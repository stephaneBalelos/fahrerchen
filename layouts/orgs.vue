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

          <UDashboardSidebarLinks :links="links" />

          <UDivider />

          <UDashboardSidebarLinks
            :links="[{ label: 'Colors', draggable: false, children: colors }]"
            @update:links="(links) => (defaultColors = links)"
          />

          <div class="flex-1" />

          <UDivider class="sticky bottom-0" />

          <template #footer>
            <UDashboardSidebarLinks :links="footerLinks" />
          </template>
        </UDashboardSidebar>
      </UDashboardPanel>
      <UDashboardPage>
        <UDashboardPanel grow>
          <UDashboardNavbar title="Home">
            <template #right>
              <UTooltip text="Notifications" :shortcuts="['N']">
                <UButton color="gray" variant="ghost" square>
                  <UChip color="red" inset>
                    <UIcon name="i-heroicons-bell" class="w-5 h-5" />
                  </UChip>
                </UButton>
              </UTooltip>
              <UserDropdown></UserDropdown>
            </template>
          </UDashboardNavbar>

          <ClientOnly>
            <slot :orgid="org"></slot>
          </ClientOnly>
        </UDashboardPanel>

      </UDashboardPage>
    </UDashboardLayout>
</template>

<script setup lang="ts">
import TeamsDropdown from '~/components/sidebar/TeamsDropdown.vue';
import UserDropdown from '@/navigation/UserMenu.vue';


const route = useRoute();
const appConfig = useAppConfig();
const { isHelpSlideoverOpen } = useDashboard();
const runtimeConfig = useRuntimeConfig();


const user = useSupabaseUser();
const supabase = useSupabaseClient();
const toast = useToast();

const { org, orgData } = useGlobalOrgState();

const links = [
  {
    id: "dashboard",
    label: "Dashboard [NOT IMPLEMENTED]",
    icon: "i-heroicons-view-dashboard",
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
      }
    ],
    tooltip: {
      text: "Settings",
      shortcuts: ["G", "S"],
    },
  },
];

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

const groups = [
  {
    key: "links",
    label: "Go to",
    commands: links.map((link) => ({
      ...link,
      shortcuts: link.tooltip?.shortcuts,
    })),
  },
  {
    key: "code",
    label: "Code",
    commands: [
      {
        id: "source",
        label: "View page source",
        icon: "i-simple-icons-github",
        click: () => {
          window.open(
            `https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${
              route.path === "/" ? "/index" : route.path
            }.vue`,
            "_blank"
          );
        },
      },
    ],
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
