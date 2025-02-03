<template>
  <USelectMenu
    v-model="model"
    :searchable="searchStudents"
    :searchable-placeholder="t('search_by_name_or_email')"
    :placeholder="t('select_a_person')"
    value-attribute="id"
    :search-attributes="['name', 'email']"
  >
    <template #label>
      <div v-if="selected">
        <UAvatar
          v-if="selected.firstname"
          :alt="`${selected.firstname} ${selected.lastname}`"
          size="xs"
        />
        <span class="truncate ms-3">{{
          `${selected.firstname} ${selected.lastname}`
        }}</span>
      </div>
      <div v-else>
        <UAvatar icon="i-heroicons-user-circle" size="xs" />
        <span class="truncate ms-3">{{ t("select_a_person") }}</span>
      </div>
    </template>

    <template #option="{ option: person }">
      <UAvatar :alt="`${person.firstname} ${person.lastname}`" size="xs" />
      <span class="truncate">{{ `${person.firstname} ${person.lastname}` }}</span>
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
import type { AppStudent, Database } from "~/types/app.types";

type Props = {
  orgid: string;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();

const model = defineModel<string>({ default: null });
const students = ref<AppStudent[] | null>(null);
const selected = computed(() => {
  if (!students.value) {
    return null;
  }
  return students.value.find((s) => s.id === model.value);
});

async function searchStudents(search: string) {
  let q;
  if (search.length < 3) {
    q = client.from("students").select("*").eq("organization_id", props.orgid).limit(5);
  } else {
    q = await client
      .from("students")
      .select("*")
      .eq("organization_id", props.orgid)
      .or(
        `firstname.ilike.%${search}%,lastname.ilike.%${search}%,email.ilike.%${search}%`
      ).limit(5);
  }
  const { data, error } = await q;
  if (error) {
    throw error;
  }
  students.value = data;
  return data;
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "search_by_name_or_email": "Suche nach Name oder E-Mail",
    "select_a_person": "Wähle eine Schüler:in aus",
    "no_user_found": "'{query}' nicht gefunden",
    "no_users": "Keine Schüler:in"
  },
  "en": {
    "search_by_name_or_email": "Search by name or email",
    "select_a_person": "Select a student",
    "no_user_found": "'{query}' not found",
    "no_users": "No Student"
  }
}
</i18n>
