<template>
  <UDashboardSlideover :ui="{ width: 'w-screen max-w-xl' }" prevent-close>
    <template #header>
      <div v-if="student" class="flex justify-between items-center w-full">
        <div class="flex items-center space-x-2">
          <UButton
            icon="i-heroicons-arrow-left"
            color="gray"
            variant="ghost"
            size="xs"
            @click="$emit('close')"
          />
        </div>
        <div class="flex items-center space-x-2">
          <UButton
            v-if="student.activeSubscription"
            icon="i-heroicons-document-text"
            variant="solid"
            size="xs"
            :label="t('course_profile')"
            @click="closeAndNavigateTo(userOrganizationsStore.relativePath(`/students/${student.activeSubscription.id}`))"
          />
          <UButton
            v-if="!student.activeSubscription"
            icon="i-heroicons-plus-circle-16-solid"
            variant="solid"
            size="xs"
            :label="t('subscribe_student')"
            @click="subscribeStudent()"
          />
          <UButton
            v-if="!student.activeSubscription"
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            size="xs"
            @click="deleteStudent(student.id)"
          />
        </div>
      </div>
    </template>
    <template v-if="student">
      <UDashboardSection
        :title="`${student?.firstname} ${student?.lastname}`"
        :description="`${student.email}`"
        orientation="vertical"
      >
        <template #icon>
          <UAvatar
            :alt="`${student.firstname} ${student.lastname}`"
            size="xl"
          />
        </template>
        <template #title>
          <p class="font-semibold text-xl">
            {{ `${student.firstname} ${student.lastname}` }}
          </p>
        </template>
        <template #description>
          <p class="font-medium text-lg">{{ student.email }}</p>
        </template>

        <div class="grid grid-cols-2 gap-4 items-center">
          <div class="font-semibold">
            {{ t("current_subscription") }}
          </div>
          <div class="font-medium">
            <UBadge
              v-if="student.activeSubscription"
              :color="'green'"
              variant="soft"
              size="lg"
            >
              {{
                g(`course_types.${student.activeSubscription.course.type}.name`)
              }}
            </UBadge>
            <div v-else class="font-medium">
              <UAlert
                :color="'amber'"
                :title="t('no_active_subscription')"
                variant="soft"
                :size="'xs'"
              />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="font-semibold">
            {{ t("registerer_since") }}
          </div>
          <div class="font-medium">
            {{ formatDate(student.created_at) || "-" }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="font-semibold">
            {{ t("phone_number") }}
          </div>
          <div class="font-medium">
            {{ student.phone_number || "-" }}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="font-semibold">
            {{ t("address") }}
          </div>
          <div class="font-medium">
            <address class="not-italic">
              {{ student.address_street || "-" }}<br >
              {{ student.address_zip || "-" }} {{ student.address_city || "-"
              }}<br >
              {{ student.address_country || "-" }}
            </address>
          </div>
        </div>
      </UDashboardSection>
    </template>
    <div v-else>
      <div v-if="status === 'pending'" class="p-4">
        <p>Loading...</p>
      </div>
      <div v-else-if="error" class="p-4">
        <p class="text-red-500">Error: {{ error.message }}</p>
      </div>
      <div v-else class="p-4">
        <p>No student found.</p>
      </div>
    </div>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type Props = {
  studentId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const studentsStore = useStudentsStore();
const toast = useToast();
const modal = useModal();
const $emit = defineEmits<{
  (e: "close", shouldRefresh?: boolean): void;
  (e: "close-and-navigate", path: string): void;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (e: "close-and-subscribe", studentId: string): void;
}>();

const {
  data: student,
  status,
  error,
} = useAsyncData(
  `student-${props.studentId}`,
  async () => {
    const { data, error } = await client
      .from("students")
      .select("*, subscriptions:course_subscriptions(*, course:courses(*))")
      .eq("id", props.studentId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  {
    server: false,
    transform: (data) => {
      if (!data) {
        return null;
      }
      const activeSubscription = data.subscriptions.find(
        (sub) => sub.archived_at === null
      );
      return {
        ...data,
        activeSubscription,
      };
    },
  }
);


const deleteStudent = async (studentId: string) => {
  modal.open(ConfirmModal, {
    title: t("confirm_delete_student"),
    description: t("confirm_delete_student_description"),
    confirmLabel: t("delete"),
    cancelLabel: t("cancel"),
    action: async () => {
      try {
        await studentsStore.deleteStudent(studentId);
        toast.add({
          title: t("student_deleted"),
          description: t("student_deleted_successfully"),
          color: "green",
        });
        modal.close();
      } catch (err) {
        toast.add({
          title: t("error"),
          description: t("error_deleting_student"),
          color: "red",
        });
        console.error(err);
      }
    },
  });
};

const subscribeStudent = async () => {
  if (!student.value) return;
  $emit("close-and-subscribe", student.value.id);
};

const closeAndNavigateTo = (path: string) => {
  $emit("close-and-navigate", path);
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_profile": "Kursprofil",
    "course_profile_desc": "Kursprofil",
    "subscribe_student": "Schüler einschreiben",
    "current_subscription": "Aktueller Kurs",
    "no_active_subscription": "Kein aktiver Kurs",
    "registerer_since": "Registriert seit",
    "phone_number": "Telefonnummer",
    "address": "Adresse",
    "confirm_delete_student": "Schüler löschen",
    "confirm_delete_student_description": "Möchten Sie diesen Schüler wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
    "delete": "Löschen",
    "cancel": "Abbrechen",
    "student_deleted": "Schüler gelöscht",
    "student_deleted_successfully": "Der Schüler wurde erfolgreich gelöscht.",
    "error": "Fehler",
    "error_deleting_student": "Fehler beim Löschen des Schülers.",
    "student_not_found": "Schüler nicht gefunden.",
    "no_courses_available": "Keine Kurse verfügbar.",
    "course_not_found": "Kurs nicht gefunden.",
    "student_subscribed": "Schüler eingeschrieben",
    "student_subscribed_successfully": "Der Schüler wurde erfolgreich eingeschrieben.",
    "error_subscribing_student": "Fehler beim Einschreiben des Schülers."
  },
  "en": {
    "course_profile": "Course profile",
    "course_profile_desc": "Course profile",
    "subscribe_student": "Subscribe student",
    "current_subscription": "Current subscription",
    "no_active_subscription": "No active subscription",
    "registerer_since": "Registered since",
    "phone_number": "Phone number",
    "address": "Address",
    "confirm_delete_student": "Delete student",
    "confirm_delete_student_description": "Are you sure you want to delete this student? This action cannot be undone.",
    "delete": "Delete",
    "cancel": "Cancel",
    "student_deleted": "Student deleted",
    "student_deleted_successfully": "The student has been successfully deleted.",
    "error": "Error",
    "error_deleting_student": "Error deleting the student.",
    "student_not_found": "Student not found.",
    "no_courses_available": "No courses available.",
    "course_not_found": "Course not found.",
    "student_subscribed": "Student subscribed",
    "student_subscribed_successfully": "The student has been successfully subscribed.",
    "error_subscribing_student": "Error subscribing the student."
  }
}
</i18n>
