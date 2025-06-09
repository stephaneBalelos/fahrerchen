<template>
    <USelectMenu
      v-model="model"
      :searchable="searchStudentsSubscription"
      :searchable-placeholder="t('search_by_name_or_email')"
      :placeholder="t('select_a_person')"
      value-attribute="id"
      :search-attributes="['name', 'email']"
    >
      <template #label>
        <div v-if="selected">
          <UAvatar
            v-if="selected.student_firstname"
            :alt="`${selected.student_firstname} ${selected.student_lastname}`"
            size="xs"
          />
          <span class="truncate ms-3">{{
            `${selected.student_firstname} ${selected.student_lastname}`
          }}</span>
        </div>
        <div v-else>
          <UAvatar icon="i-heroicons-user-circle" size="xs" />
          <span class="truncate ms-3">{{ t("select_a_person") }}</span>
        </div>
      </template>
  
      <template #option="{ option: person }">
        <UAvatar :alt="`${person.student_firstname} ${person.student_lastname}`" size="xs" />
        <span class="truncate">{{ `${person.student_firstname} ${person.student_lastname}` }}</span>
        <CoursesCourseTypeBadge :type="person.course_type" />
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
  import type { AppCourseSubscriptionsView } from "~/types/app.types";
  
  type Props = {
    orgid: string;
  };
  const props = defineProps<Props>();
  
  const { t } = useI18n({
    useScope: "local",
  });
  
  const client = useSupabaseClient();
  
  const model = defineModel<string>({ default: null });
  const subscriptions = ref<AppCourseSubscriptionsView[] | null>(null);
  const selected = computed(() => {
    if (!subscriptions.value) {
      return null;
    }
    return subscriptions.value.find((s) => s.id === model.value);
  });
  
  async function searchStudentsSubscription(search: string) {
    let q;
    if (search.length < 3) {
      q = client.from("course_subscriptions_view").select("*").eq("organization_id", props.orgid).limit(5);
    } else {
      q = client
        .from("course_subscriptions_view")
        .select("*")
        .eq("organization_id", props.orgid)
        .or(
          `student_firstname.ilike.%${search}%,student_lastname.ilike.%${search}%,student_email.ilike.%${search}%`
        ).limit(5);
    }
    const { data, error } = await q.overrideTypes<AppCourseSubscriptionsView[]>();
    if (error) {
      throw error;
    }
    subscriptions.value = data;
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
  