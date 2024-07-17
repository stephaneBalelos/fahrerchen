<template>
  <UDashboardPanel grow>
    <UDashboardToolbar>
      <template #left>
        <h2 class="font-semibold text-gray-900 dark:text-white">
          Students
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
          placeholder="Filter users..."
          class="hidden lg:block"
          @keydown.esc="$event.target.blur()"
        >
          <template #trailing>
            <UKbd value="/" />
          </template>
        </UInput>

        <UButton
          label="New user"
          trailing-icon="i-heroicons-plus"
          color="gray"
          @click="open = true"
        />
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

    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="students ?? []"
      :columns="columns"
      :loading="pending"
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
        <UButton :to="`/my/students/${row.id}`" color="primary" variant="soft" icon="i-heroicons-eye"></UButton>
      </template>
    </UTable>
  </UDashboardPanel>

  <UDashboardSlideover v-model="open" title="Create News Student">
    <CreateUserForm @submitted="onUserCreated" />
    <template #footer>
      <UButton @click="open = false">Cancel</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppUser, Database } from "~/types/app.types";
import CreateUserForm from "~/components/forms/CreateStudentForm.vue";

const { org } = useGlobalOrgState();

definePageMeta({
  layout: "orgs",
});

const open = ref(false);
const client = useSupabaseClient<Database>();

const {
  data: students,
  pending,
  error,
  refresh,
} = await useAsyncData("students", async () => {
  const { data } = await client
    .from("students")
    .select("*")
    .eq("organization_id", org.value);

  return data;
}, {
  watch: [org],
  transform: (data) => {
    return data ? data.map((item: any) => {
      return {
        ...item,
        name: `${item.firstname} ${item.lastname}`, 
      };
    }) : [];
  },
});

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

const onUserCreated = async (d: any) => {
  refresh();
};

function onSelect(row: AppUser) {
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}
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
