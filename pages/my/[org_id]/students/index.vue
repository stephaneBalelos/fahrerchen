<template>
  <UDashboardPanel grow>
    <UDashboardToolbar>
      <template #left>
        <h2 class="font-semibold text-gray-900 dark:text-white">
          {{ t("students") }}
          <UBadge color="primary" variant="soft">{{
            students?.length ?? 0
          }}</UBadge>
        </h2>
      </template>
      <template #right>
        <UInput
          ref="input"
          v-model="q"
          icon="i-heroicons-funnel"
          autocomplete="off"
          :placeholder="t('filter_users')"
          class="hidden lg:block"
          @keydown.esc="$event.target.blur()"
        >
          <template #trailing>
            <UKbd value="/" />
          </template>
        </UInput>

        <UDropdown 
        :items="createUserOptions"
        :popper="{
          placement: 'bottom-start',
        }"
        :ui="{
          width: 'w-72',
        }">
          <UButton
            :label="t('new_user')"
            trailing-icon="i-heroicons-plus"
            color="gray"
          />
        </UDropdown>
        <UButton
          color="gray"
          variant="solid"
          size="2xs"
          :to="userOrganizationsStore.relativePath('/students/requests')"
        >
          {{ t("pre_registration") }}
        </UButton>
      </template>
    </UDashboardToolbar>

    <UDashboardToolbar>
      <template #left>
        <!-- <USelectMenu
            v-model="selectedStatuses"
            icon="i-heroicons-check-circle"
            placeholder="Status"
            multiple
            :options="defaultStatuses"
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu
            v-model="selectedLocations"
            icon="i-heroicons-map-pin"
            placeholder="Location"
            :options="defaultLocations"
            multiple
          /> -->
      </template>

      <template #right>
        <USelectMenu
          v-model="selectedColumns"
          icon="i-heroicons-adjustments-horizontal-solid"
          :options="columns"
          multiple
          class="hidden lg:block"
        >
          <template #label> Display </template>
        </USelectMenu>
      </template>
    </UDashboardToolbar>

    <UDashboardPanelContent class="p-0">
      <UTable
        v-model="selected"
        v-model:sort="sort"
        :rows="students ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
        @select="onSelect"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />
            <span class="text-gray-900 dark:text-white font-medium">{{
              row.name
            }}</span>
          </div>
        </template>
        <template #status-data="{ row }">
          <UBadge
            :label="row.status ?? 'unknown'"
            :color="
              row.status === 'subscribed'
                ? 'green'
                : row.status === 'bounced'
                ? 'orange'
                : 'red'
            "
            variant="subtle"
            class="capitalize"
          />
        </template>
        <template #actions-data="{ row }">
          <UButton
            :to="userOrganizationsStore.relativePath(`/students/${row.id}`)"
            color="primary"
            variant="soft"
            icon="i-heroicons-eye"
          />
          <UButton
            color="primary"
            variant="soft"
            icon="i-heroicons-pencil"
            @click="(e) => openStudentForm(row.id)"
          />
        </template>
      </UTable>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { AppStudent, AppUser, Database } from "~/types/app.types";
import EditStudentForm from "~/components/forms/EditStudentForm.vue";
import AddStudentModal from "~/components/forms/AddStudentModal.vue";
import OnboardingLinkModal from "~/components/students/OnboardingLinkModal.vue";

definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();
const slideover = useSlideover();
const modal = useModal();
const userOrganizationsStore = useUserOrganizationsStore();
const selected = ref<AppUser[]>([]);
const columns = [
  {
    key: "avatar",
  },
  {
    key: "name",
    label: "Fullname",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
  },
];
const q = ref("");
const selectedColumns = ref(columns);
const sort = ref({ column: "id", direction: "asc" as const });

const {
  data: students,
  status,
  refresh,
} = await useAsyncData(
  "students",
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return null;
    }
    const { data } = await client
      .from("students")
      .select("*")
      .eq(
        "organization_id",
        userOrganizationsStore.selectedOrganization.organization_id
      );

    return data;
  },
  {
    transform: (data) => {
      return data
        ? data.map((item) => {
            return {
              ...item,
              name: `${item.firstname} ${item.lastname}`,
            };
          })
        : [];
    },
  }
);

const createUserOptions = ref([
  [
    {
      label: t("invite_user_per_email"),
      icon: "i-heroicons-envelope",
      click: () => {
        if (!userOrganizationsStore.selectedOrganization) {
          return;
        }
        modal.open(AddStudentModal, {
          orgid: userOrganizationsStore.selectedOrganization.organization_id,
          onClose: () => {
            modal.close();
          }
        })
      },
    },
    {
      label: t("copy_invite_link"),
      icon: "i-heroicons-link",
      click: () => {
        if (!userOrganizationsStore.selectedOrganization) {
          return;
        }
        modal.open(OnboardingLinkModal, {
          orgid: userOrganizationsStore.selectedOrganization.organization_id,
          onClose: () => {
            modal.close();
          }
        })
      },
    },
    {
      label: t("manual_registration"),
      icon: "i-heroicons-user-plus",
      click: () => {
        openStudentForm();
      },
    },
  ],
]);

function onSelect(row: AppUser) {
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

const openStudentForm = (id?: string) => {
  if (!userOrganizationsStore.selectedOrganization) {
    return;
  }
  slideover.open(EditStudentForm, {
    organizationId: userOrganizationsStore.selectedOrganization.organization_id,
    studentId: id,
    "onStudent-created": (student: AppStudent) => {
      console.log("student created", student);
      refresh();
    },
    "onStudent-updated": (student: AppStudent) => {
      console.log("student updated", student);
      refresh();
    },
  });
};
</script>

<style scoped>
/* https://codepen.io/jenning/pen/YzNmzaV */

.loader {
  --color: rgb(var(--color-primary-400));
  --size-mid: 6vmin;
  --size-dot: 1.5vmin;
  --size-bar: 0.4vmin;
  --size-square: 3vmin;

  display: block;
  position: relative;
  width: 50%;
  display: grid;
  place-items: center;
}

.loader::before,
.loader::after {
  content: "";
  box-sizing: border-box;
  position: absolute;
}

/**
    loader --6
**/
.loader.--6::before {
  width: var(--size-square);
  height: var(--size-square);
  background-color: var(--color);
  top: calc(50% - var(--size-square));
  left: calc(50% - var(--size-square));
  animation: loader-6 2.4s cubic-bezier(0, 0, 0.24, 1.21) infinite;
}

@keyframes loader-6 {
  0%,
  100% {
    transform: none;
  }

  25% {
    transform: translateX(100%);
  }

  50% {
    transform: translateX(100%) translateY(100%);
  }

  75% {
    transform: translateY(100%);
  }
}
</style>

<i18n lang="json">
{
  "de": {
    "students": "Fahrschüler:innen",
    "new_user": "Neuer Fahrschüler:in",
    "filter_users": "Fahrschüler:innen filtern...",
    "pre_registration": "Voranmeldungen",
    "invite_user_per_email": "Fahrschüler:in per E-Mail einladen",
    "copy_invite_link": "Einladungslink kopieren",
    "manual_registration": "Manuelle Registrierung"
  },
  "en": {
    "students": "Students",
    "new_user": "New Student",
    "filter_users": "Filter students...",
    "pre_registration": "Pre-registration",
    "invite_user_per_email": "Invite student per email",
    "copy_invite_link": "Copy invite link",
    "manual_registration": "Manual registration"
  }
}
</i18n>
