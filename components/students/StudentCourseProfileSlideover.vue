<template>
  <UDashboardSlideover :ui="{ width: 'w-screen max-w-xl' }">
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
            variant="ghost"
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
const coursesStore = useCoursesStore();
const toast = useToast();
const modal = useModal();
const $emit = defineEmits<{
  (e: "close", shouldRefresh?: boolean): void;
  (e: "close-and-navigate", path: string): void;
}>();

const {
  data: student,
  refresh,
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
  // Should Open Subscription Modal
  if (!student.value) {
    toast.add({
      title: t("error"),
      description: t("student_not_found"),
      color: "red",
    });
    return;
  }
  if (coursesStore.courses.length === 0) {
    toast.add({
      title: t("error"),
      description: t("no_courses_available"),
      color: "red",
    });
    return;
  }
  const course = coursesStore.courses[0];
  if (!course) {
    toast.add({
      title: t("error"),
      description: t("course_not_found"),
      color: "red",
    });
    return;
  }

  try {
    await studentsStore.subscribeStudent(student.value.id, course.id, student.value.organization_id);
    toast.add({
      title: t("student_subscribed"),
      description: t("student_subscribed_successfully"),
      color: "green",
    });
    refresh();
  } catch (err) {
    toast.add({
      title: t("error"),
      description: t("error_subscribing_student"),
      color: "red",
    });
    console.error(err);
  }
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
    "course_profile_desc": "Kursprofil"
  },
  "en": {
    "course_profile": "Course profile",
    "course_profile_desc": "Course profile"
  }
}
</i18n>
