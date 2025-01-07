<template>
  <USelectMenu
    v-model="model"
    :searchable="search"
    :searchable-placeholder="t('search_by_name_or_email')"
    value-attribute="id"
    :search-attributes="['name', 'email']"
  >
    <template #label>
      <div v-if="selected">
        <UAvatar v-if="selected.user_fullname" :alt="selected.user_fullname" size="xs" />
        <span class="truncate ms-3">{{ selected.user_fullname }}</span>
      </div>
      <div v-else>
        <UAvatar icon="i-heroicons-user-circle" size="xs" />
        <span class="truncate ms-3">{{ t('select_a_person') }}</span>
      </div>
    </template>

    <template #option="{ option: person }">
      <UAvatar :alt="person.user_fullname" size="xs" />
      <span class="truncate">{{ person.user_fullname }}</span>
    </template>

    <template #option-empty="{ query }">
      {{ t('no_user_found', { query }) }}
    </template>
    <template #empty>
      {{ t('no_users') }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  orgid: string;
};
const props = useAttrs() as Props;

const { t } = useI18n({
  useScope: "local",
});

const model = defineModel<string>({ default: null });
const users = ref<Database['public']['Views']['organization_members_view']['Row'][] | null>(null);
const selected = computed(() => {
  if (!users.value) {
    return null;
  }
  return users.value.find((user) => user.id === model.value);
});


async function search(q: string) {
  let result;
  if (q.length < 3) {
    result = await useOrganizationMembers(props.orgid, ["teacher", "manager", "owner"]);
  } else {
    result = await useOrganizationMembers(props.orgid, ["teacher", "manager", "owner"], q);
  }
  users.value = result;
  return result;
}
</script>

<style scoped></style>


<i18n lang="json">
{
  "de": {
    "search_by_name_or_email": "Suche nach Name oder E-Mail",
    "select_a_person": "Wähle eine Person aus",
    "no_user_found": "'{query}' nicht gefunden",
    "no_users": "Keine Benutzer"
  },
  "en": {
    "search_by_name_or_email": "Search by name or email",
    "select_a_person": "Select a person",
    "no_user_found": "'{query}' not found",
    "no_users": "No users"
  }
}
</i18n>
