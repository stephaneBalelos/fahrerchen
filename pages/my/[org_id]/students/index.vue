<template>
  <UDashboardPage>
    <UDashboardPanel id="student-list" grow>
      <UDashboardNavbar>
        <template #left>
          <h2 class="font-semibold text-gray-900 dark:text-white">
            {{ t("students") }}
            <UBadge color="primary" variant="soft">{{
              students?.length ?? 0
            }}</UBadge>
          </h2>
        </template>
        <template #center>
          <UAlert
            v-if="error"
            :color="'red'"
            :variant="'solid'"
            :closable="false"
            class="w-full"
          >
            {{ error.message }}
          </UAlert>
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
        <template #right>
          <UButton
            color="gray"
            size="xs"
            icon="i-heroicons-arrow-path"
            @click="refresh"
          />
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
              <UAvatar
                v-if="row.avatar_path"
                :src="
                  $publicStorageUrl('users_avatars', row.avatar_path) ??
                  undefined
                "
                :alt="`${row.firstname} ${row.lastname}`"
                size="xs"
              />
              <UAvatar
                v-else
                :alt="`${row.firstname} ${row.lastname}`"
                size="xs"
              />
              <div class="flex flex-col">
                <span class="text-md text-gray-900 dark:text-white font-medium">
                  {{ row.firstname }} {{ row.lastname }}
                </span>
                <span class="text-gray-500 text-sm">{{ row.email }}</span>
              </div>
            </div>
          </template>
          <template #status-data="{ row }">
            <UBadge
              v-if="row.active_subscriptions.length === 0"
              :label="t('status_not_subscribed')"
              :color="'orange'"
              variant="subtle"
              class="capitalize"
            />
            <UBadge
              v-else-if="row.active_subscriptions.length > 0"
              :label="
                t('status_subscribed', { count: row.subscriptions_count })
              "
              :color="'green'"
              variant="subtle"
              class="capitalize"
            />
            <!-- <UBadge
                v-if="row.subscriptions_count > 0"
                :label="t('status_subscribed', { count: row.subscriptions_count })"
                :color="'green'"
                variant="subtle"
                class="capitalize"
              />
              <UBadge
                v-else
                :label="t('status_not_subscribed')"
                :color="'orange'"
                variant="subtle"
                class="capitalize"
              /> -->
          </template>
          <template #actions-data="{ row }">
            <div class="flex gap-2">
              <UButton
                color="gray"
                variant="solid"
                icon="i-heroicons-pencil"
                @click="() => openStudentForm(row.id)"
              />
              <UButton
                color="gray"
                variant="solid"
                icon="i-heroicons-eye"
                @click="() => openStudentProfileSlideover(row.id)"
              />
            </div>
          </template>
        </UTable>
      </UDashboardPanelContent>
      <div
        class="flex justify-center p-4 border-t border-gray-200 dark:border-gray-800"
      >
        <UPagination
          :active-button="{ variant: 'outline' }"
          :inactive-button="{ color: 'gray' }"
          :model-value="1"
          :total="100"
        />
      </div>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import EditStudentForm from "~/components/forms/EditStudentForm.vue";
import AddStudentModal from "~/components/forms/AddStudentModal.vue";
import OnboardingLinkModal from "~/components/students/OnboardingLinkModal.vue";
import StudentCourseProfileSlideover from "~/components/students/StudentCourseProfileSlideover.vue";

definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});

const studentsStore = useStudentsStore();
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
  error,
} = await useAsyncData(
  "students",
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return null;
    }
    return await studentsStore.queryStudents({
      org_id: userOrganizationsStore.selectedOrganization.id,
      search: q.value,
    });
  },
  {
    watch: [q],
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
          orgid: userOrganizationsStore.selectedOrganization.id,
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
          orgid: userOrganizationsStore.selectedOrganization.id,
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
    organizationId: userOrganizationsStore.selectedOrganization.id,
    studentId: id,
    "onStudent-created": () => {
      console.log("student created");
      refresh();
    },
    "onStudent-updated": () => {
      console.log("student updated");
      refresh();
    },
  });
};

const openStudentProfileSlideover = (id: string) => {
  slideover.open(StudentCourseProfileSlideover, {
    studentId: id,
    onClose: (shouldRefresh) => {
      slideover.close();
      if (shouldRefresh) {
        refresh();
      }
    },
    "onClose-and-navigate": async (path: string) => {
      await slideover.close();
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
