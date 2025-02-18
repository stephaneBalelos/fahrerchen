<template>
  <UDashboardPanel grow>
    <UDashboardNavbar>
      <template #left>
        <h2 class="font-semibold text-gray-900 dark:text-white">
          {{ t("students") }}
          <UBadge color="primary" variant="soft">{{
            students?.length ?? 0
          }}</UBadge>
        </h2>
      </template>
      <template #right>
        <UDropdown
          :items="createUserOptions"
          :popper="{
            placement: 'bottom-start',
          }"
          :ui="{
            width: 'w-72',
          }"
        >
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
    </UDashboardNavbar>

    <UDashboardToolbar>
      <template #left>
        <UInput
          ref="input"
          v-model="q"
          icon="i-heroicons-funnel"
          autocomplete="off"
          :placeholder="t('filter_users')"
          class="hidden lg:block"
          @keydown.esc="$event.target.blur()"
        />
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

    </UDashboardToolbar>

    <UDashboardPanelContent class="p-0">
      <UTable
        v-model:sort="sort"
        :rows="students ?? []"
        :columns="columns"
        :loading="status === 'pending'"
        sort-mode="manual"
        class="w-full"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
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
            :label="(row.subscriptions_count ?? 0 )? t('status_subscribed', { count: row.subscriptions_count }) : t('status_not_subscribed')"
            :color="
              (row.subscriptions_count ?? 0)
                ? 'green'
                : 'orange'
            "
            variant="subtle"
            class="capitalize"
          />
        </template>
        <template #actions-data="{ row }">
          <div class="flex gap-2">
            <UButton
              color="gray"
              variant="solid"
              icon="i-heroicons-pencil"
              @click="(e) => openStudentForm(row.id)"
            />
            <UButton
              color="gray"
              variant="solid"
              icon="i-heroicons-eye"
              @click="(e) => openStudentSubscriptionsSlideOver(row.id)"
            />
          </div>
        </template>
      </UTable>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";
import EditStudentForm from "~/components/forms/EditStudentForm.vue";
import AddStudentModal from "~/components/forms/AddStudentModal.vue";
import OnboardingLinkModal from "~/components/students/OnboardingLinkModal.vue";
import StudentSubscriptionsSlideover from "~/components/students/StudentSubscriptionsSlideover.vue";

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
const columns = [
  {
    key: "name",
    label: t("table.name"),
  },
  {
    key: "email",
    label: t("table.email"),
  },
  {
    key: "status",
    label: t("table.status"),
  },
  {
    key: "actions",
  },
];
const q = ref("");
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
    const query = client
      .from("students_view")
      .select("*")
      .eq(
        "organization_id",
        userOrganizationsStore.selectedOrganization.organization_id
      );

      if (q.value) {
        query.or(`firstname.ilike.%${q.value}%,lastname.ilike.%${q.value}%,email.ilike.%${q.value}%`);
      }

    const { data } = await query;
    return data;
  },
  {
    watch: [q],
    transform: (data) => {
      return data
        ? data.map((item) => {       
            return {
              ...item,
              name: `${item.firstname} ${item.lastname}`
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
          },
        });
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
          },
        });
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

const openStudentSubscriptionsSlideOver = (id: string) => {
  slideover.open(StudentSubscriptionsSlideover, {
    studentId: id,
    onClose: (path) => {
      slideover.close();
      navigateTo(path);
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
    "manual_registration": "Manuelle Registrierung",
    "status_subscribed": "In {count} Kursen eingeschrieben",
    "status_not_subscribed": "Nicht eingeschrieben",
    "table": {
      "name": "Name",
      "email": "E-Mail",
      "status": "Status",
      "actions": "Aktionen"
    }
  },
  "en": {
    "students": "Students",
    "new_user": "New Student",
    "filter_users": "Filter students...",
    "pre_registration": "Pre-registration",
    "invite_user_per_email": "Invite student per email",
    "copy_invite_link": "Copy invite link",
    "manual_registration": "Manual registration",
    "status_subscribed": "Subscribed to {count} courses",
    "status_not_subscribed": "Not subscribed",
    "table": {
      "name": "Name",
      "email": "Email",
      "status": "Status",
      "actions": "Actions"
    }
  }
}
</i18n>
