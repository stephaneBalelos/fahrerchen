<template>
  <UDashboardPanel grow>
    <UDashboardToolbar>
      <template #left>
        <UButton
          class="me-2"
          icon="i-heroicons-arrow-left"
          size="2xs"
          color="gray"
          square
          variant="solid"
          to="/my/students"
        />
        <h2 class="font-semibold text-gray-900 dark:text-white">
          {{ t("pre_registrations") }}
          <UBadge color="primary" variant="soft">{{
            requests?.length ?? 0
          }}</UBadge>
        </h2>
      </template>
      <template #right>
        <UButton
          v-if="selected && selected.length > 0"
          :label="t('confirm_registration', { count: selected.length })"
          color="primary"
          @click="confirmSelectedRequests"
        />
        <UButton
          v-if="selected && selected.length > 0"
          :label="t('delete')"
          color="red"
          variant="soft"
          @click="deleteSelectedRequests"
        />
      </template>
    </UDashboardToolbar>
    <UTable
      v-if="requests && selected"
      v-model="selected"
      :rows="requests"
      :columns="columns"
    >
      <template #student-data="{ row }">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ row.student.name }}
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            <UBadge
              v-if="row.student.has_a_license"
              color="primary"
              variant="soft"
              >{{ t("has_a_license") }}</UBadge
            >
            <UBadge v-else color="primary" variant="soft">{{
              t("has_no_license")
            }}</UBadge>
          </p>
        </div>
      </template>
      <template #address-data="{ row }">
        <div>
          <p class="text-gray-900 dark:text-white font-medium">
            {{ row.address.street }}
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            {{ row.address.city }}, {{ row.address.zip }}
          </p>
          <p class="text-gray-500 dark:text-gray-400">
            {{ row.address.country }}
          </p>
        </div>
      </template>
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">{{ t("no_new_requests") }} </span>
          <UButton :label="t('back_to_my_students')" to="/my/students" />
        </div>
      </template>
    </UTable>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});

const toast = useToast();
const userOrganizationsStore = useUserOrganizationsStore();
const client = useSupabaseClient<Database>();
const {
  data: requests,
  status,
  error,
  refresh,
} = await useAsyncData(
  `students_registrations_${userOrganizationsStore.selectedOrganization?.organization_id}`,
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return [];
    }
    const { data, error } = await client
      .from("students_registration_requests")
      .select("*")
      .eq("organization_id", userOrganizationsStore.selectedOrganization.organization_id)
      .eq("status", 0)
      .order("inserted_at", { ascending: false });

    if (error) {
      throw error;
    }
    if (!data) {
      return [];
    }

    return data;
  },
  {
    transform: (data) => {
      return data.map((request) => {
        const row = {
          id: request.id,
          inserted_at: formatDate(request.inserted_at),
          student: {
            name: `${request.firstname} ${request.lastname}`,
            has_a_license: request.has_a_license,
          },
          birthdate: formatDate(request.birth_date),
          email: request.email,
          address: {
            street: request.address_street,
            city: request.address_city,
            zip: request.address_zip,
            country: request.address_country,
          },
        };
        return row;
      });
    },
  }
);

const selected = ref<typeof requests.value>([]);

const columns = [
  {
    key: "inserted_at",
    label: t("requested_at"),
    sortable: true,
  },
  {
    key: "student",
    label: t("student"),
    sortable: true,
  },
  {
    key: "birthdate",
    label: t("birth_date"),
  },
  {
    key: "email",
    label: t("email"),
    sortable: true,
  },
  {
    key: "address",
    label: t("address"),
  },
  {
    key: "select",
    class: "w-2",
  },
];

async function confirmSelectedRequests() {
  console.log(selected.value);

  if (!selected.value) {
    return;
  }

  // update selected requests status
  try {
    const { data, error } = await client
    .from("students_registration_requests")
    .update({ status: 1 })
    .in("id", selected.value.map((item) => item.id));

    if (error) {
      throw error;
    }

    toast.add({
      title: "Success",
      description: "Requests confirmed",
      color: "green",
    });
    selected.value = [];
    refresh();
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "Failed to confirm requests",
      color: "red",
    });
  }

}

async function deleteSelectedRequests() {
  console.log(selected.value);

  if (!selected.value) {
    return;
  }

  // delete selected requests
  try {
    const { data, error } = await client
    .from("students_registration_requests")
    .delete()
    .in("id", selected.value.map((item) => item.id));

    if (error) {
      throw error;
    }

    toast.add({
      title: "Success",
      description: "Requests deleted",
      color: "green",
    });
    selected.value = [];
    refresh();
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "Failed to delete requests",
      color: "red",
    });
  }
}

// test array of 50 requests
const request_tests = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  inserted_at: formatDate(new Date().toISOString()),
  student: {
    name: `Max Mustermann ${i}`,
    has_a_license: i % 2 === 0,
  },
  birthdate: formatDate(new Date().toISOString()),
  email: `email${i}@gmail.com`,
  address: {
    street: `Musterstraße ${i}`,
    city: `Musterstadt ${i}`,
    zip: `12345 ${i}`,
    country: `Deutschland ${i}`,
  },
}));
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "pre_registrations": "Voranmeldungen",
    "confirm_registration": "{count} Voranmeldung(en) bestätigen",
    "delete": "Löschen",
    "requested_at": "Angefragt am",
    "student": "Schüler",
    "birth_date": "Geburtsdatum",
    "email": "E-Mail",
    "address": "Adresse",
    "has_a_license": "Besitzt eine Fahrerlaubnis",
    "has_no_license": "Besitzt keine Fahrerlaubnis",
    "no_new_requests": "Sie haben keine neuen Voranmeldungen",
    "back_to_my_students": "Zurück zu meine Studenten"
  },
  "en": {
    "pre_registrations": "Pre-Registrations",
    "confirm_registration": "Confirm {count} registration(s)",
    "delete": "Delete",
    "requested_at": "Requested At",
    "student": "Student",
    "birth_date": "Birthdate",
    "email": "Email",
    "address": "Address",
    "has_a_license": "Has a license",
    "has_no_license": "Has no license",
    "no_new_requests": "You have no new pre-registrations",
    "back_to_my_students": "Back to my students"
  }
}
</i18n>
