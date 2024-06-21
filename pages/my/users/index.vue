<template>
  <UDashboardPanelContent>
    <UPageHeader
      headline="Fahrschüler:innen"
      title="Meine Fahrschüler:innen"
      description="Alle meine Fahrschüler:innen"
      :links="[
        {
          label: 'Neue Fahrschüler:in',
          color: 'white',
          icon: 'i-heroicons-folder-plus',
          click: () => (open = !open),
        },
      ]"
    />

    <UTable :rows="students ?? []" :columns="columns" :loading="pending">
      <template #actions-data="{ row }">
        edit
      </template>
      <template #loading-state>
        <div class="flex items-center justify-center h-32">
          <i class="loader --6" />
        </div>
      </template>
    </UTable>
  </UDashboardPanelContent>

  <UDashboardSlideover v-model="open" title="Create News Course">
    <CreateUserForm @submitted="onUserCreated" />
    <template #footer>
      <UButton @click="open = false">Cancel</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database, AppStudent } from "~/types/app.types";
import CreateUserForm from "~/components/forms/CreateUserForm.vue";

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
    .eq("organisation_id", org.value);

  return data;
});

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "firstname",
    label: "Firstname",
    sortable: true,
  },
  {
    key: "lastname",
    label: "Lastname",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const onUserCreated = async (d: any) => {
  refresh();
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
