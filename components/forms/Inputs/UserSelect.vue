<template>
    <USelectMenu
    v-model="model"
    :options="users ?? []"
    placeholder="Select a person"
    searchable
    searchable-placeholder="Search by name or email"
    value-attribute="id"
    :search-attributes="['name', 'email']"
  >

  <template #label>
    <div v-if="selected">
        <UAvatar v-if="selected.fullname" :alt="selected.fullname" size="xs" />
        <span class="truncate ms-3">{{ selected.name }}</span>
    </div>
    <div v-else>
        <UAvatar icon="i-heroicons-user-circle" size="xs" />
        <span class="truncate ms-3">Assign to someone</span>
    </div>
  </template>

    <template #option="{ option: person }">
        <UAvatar :alt="'dsa dsd'" size="2xs" />
      <span class="truncate">{{ person.name }}</span>
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import type { AppUser, Database } from '~/types/app.types';

type Props = {
  orgid: string;
};
const props = useAttrs() as Props;
const client = useSupabaseClient<Database>();

const model = defineModel<string>({ default: null });
const selected = ref<Omit<AppUser & {name: string}, "status"> | null>(null);

const {
  data: users,
  error,
  refresh,
} = useAsyncData(`users_${props.orgid}`, async () => {
  const { data, error } = await client.from("users").select('*').limit(10);
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
}, {
    transform: (data) => {
      return data.map((user) => {
        if (!user.firstname || !user.lastname) {
          return {
            ...user,
            name: user.email,
          };
        }
        return {
          ...user,
          name: `${user.firstname} ${user.lastname}`,
        };
      });
    }
});


watch(model, (value) => {
  if (!value) {
    return;
  }
  if (!users.value) {
    return;
  }
  const user = users.value.find((user) => user.id === value);
  if (user) {
    selected.value = user;
  }
}, { immediate: true });
</script>

<style scoped></style>
