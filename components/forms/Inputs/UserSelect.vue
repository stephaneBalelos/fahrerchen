<template>
  <USelectMenu
    v-model="model"
    :searchable="search"
    :searchable-placeholder="t('search_by_name_or_email')"
    value-attribute="id"
    :search-attributes="['name', 'email']"
    :disabled="props.disabled"
    :variant="'none'"
  >
    <UButton
      block
      :color="props.color"
      :variant="props.variant || 'outline'"
      :size="props.size || 'md'"
    >
      <template #leading>
        <div v-if="selected">
          <UAvatar
            v-if="selected.fullname"
            :alt="selected.fullname"
            :size="'xs'"
          />
        </div>
        <div v-else>
          <UAvatar icon="i-heroicons-user-circle" :size="'xs'" />
        </div>
      </template>
      <div v-if="selected">
        <span class="truncate">{{ selected.fullname }}</span>
      </div>
      <div v-else>
        <span class="truncate">{{ t("select_a_person") }}</span>
      </div>
    </UButton>
    <template #option="{ option: person }">
      <UAvatar :alt="person.fullname" size="xs" />
      <span class="truncate">{{ person.fullname }}</span>
    </template>

    <template #option-empty="{ query }">
      {{ t("no_user_found", { query }) }}
    </template>
    <template #empty>
      {{ t("no_users") }}
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
type Props = {
  orgid: string;
  color?:
    | "primary"
    | "gray"
    | "white"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose";
  variant?: "outline" | "solid" | "ghost" | "link";
  size?: "md" | "2xs" | "xs" | "sm" | "lg" | "xl";
  disabled?: boolean;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const model = defineModel<string>({ default: null });
const users = ref<OrganizationMember[] | null>(null);
const organizationStore = useUserOrganizationsStore();
const selected = computed(() => {
  if (!users.value) {
    return null;
  }
  return users.value.find((user) => user.id === model.value);
});

async function search(q: string) {
  let result;
  if (q.length < 3) {
    result = await organizationStore.getOrganizationMembers(props.orgid, [
      "teacher",
      "manager",
      "owner",
    ]);
  } else {
    result = await organizationStore.getOrganizationMembers(
      props.orgid,
      ["teacher", "manager", "owner"],
      q
    );
  }
  result = result.filter((user) => user.firstname && user.lastname);
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
