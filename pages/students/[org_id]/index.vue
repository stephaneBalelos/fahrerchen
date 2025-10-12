<template>
  <UDashboardPanelContent>
    <UContainer v-if="studentStore.student" class="w-full">
      <UDashboardSection
        :description="studentStore.student?.email"
        class="mb-16"
      >
        <template #title>
          <p class="text-xl">
            {{
              t("hello_student", {
                student: `${studentStore.student?.firstname} ${studentStore.student?.lastname}`,
              })
            }}
          </p>
        </template>
        <template #links>
          <UButton
            :label="t('edit_profile')"
            color="gray"
            @click="openEditStudent"
          />
        </template>
        <div v-if="studentSubscription.length > 0">
          <div
            v-for="subscription in studentSubscription"
            :key="subscription.id"
            class="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            <UCard>
              <template #header>
                <div class="flex items-center gap-4">
                  <UAvatar
                    v-if="COURSE_ICONS[subscription.course.type]"
                    :icon="COURSE_ICONS[subscription.course.type]"
                  />
                  <div class="flex flex-col flex-1">
                    <p class="text-lg font-semibold">{{ g(`course_types.${subscription.course.type}.name_full`) }}</p>
                  </div>
                  <UBadge
                    v-if="subscription.archived_at"
                    color="white"
                    :title="t('archived_at', { date: formatDate(subscription.archived_at)})"
                    />
                </div>
              </template>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1">
                  <p class="text-xs text-gray-500">{{ t('subscription_costs') }}</p>
                  <p class="text-sm font-medium">
                    {{ formatCurrency(subscription.costs) }}
                  </p>
                </div>
              </div>
              <template #footer>
                <div class="flex justify-between items-center">
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ t('subscribed_at', { date: formatDate(subscription.inserted_at)}) }}
                  </div>
                  <UButton
                    :to="`/students/${studentStore.student?.organization_id}/subscription/${subscription.id}`"
                    icon="i-heroicons-arrow-right-solid"
                  />
                </div>
              </template>
            </UCard>
          </div>
        </div>
        <div v-else>
          <UAlert
            :title="t('no_subscriptions')"
            :description="t('no_subscriptions_description')"
          />
        </div>
      </UDashboardSection>

      <UDashboardSection
        v-if="organizationData"
        :title="t('my_driving_school')"
        :description="t('my_driving_school_description')"
      >
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col space-y-2">
              <div class="text-lg font-semibold">
                {{ organizationData.name }}
              </div>
              <div class="text-sm">
                {{ organizationData.description ?? t("not_specified") }}
              </div>
            </div>
            <div class="flex flex-col space-y-2">
              <div class="text-lg font-semibold">{{ t("org_address") }}</div>
              <div class="text-sm">
                {{ organizationData.address_street }}
              </div>
              <div class="text-sm">
                {{ organizationData.address_zip }}
                {{ organizationData.address_city }},
                {{ organizationData.address_country }}
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="flex flex-col space-y-2">
              <div class="text-lg font-semibold">
                {{ t("org_informations") }}
              </div>
              <div class="flex flex-col">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t("contact_email") }}
                </div>
                <div class="text-sm">
                  {{ organizationData.email ?? t("not_specified") }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t("contact_phone") }}
                </div>
                <div class="text-sm">
                  {{ organizationData.phone_number ?? t("not_specified") }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t("contact_website") }}
                </div>
                <div class="text-sm">
                  {{ organizationData.website ?? t("not_specified") }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="studentStore.courses.length > 0" class="pt-8">
            <div class="text-lg font-semibold">{{ t("org_courses") }}</div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <UCard v-for="course in studentStore.courses" :key="course.id">
                <div class="flex flex-col space-y-2">
                  <div class="text-lg font-semibold">
                    {{ g(`course_types.${course.type}.name_full`) }}
                  </div>
                  <div class="text-sm">
                    {{ g(`course_types.${course.type}.description`) }}
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </UDashboardSection>
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import EditStudentForm from "~/components/forms/EditStudentForm.vue";
import { COURSE_ICONS } from "~/constants";
import { formatCurrency, formatDate } from "~/utils/formatters";

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const userOrganizationsStore = useUserOrganizationsStore();
const studentStore = useStudentStore();
const toast = useToast();
const slideover = useSlideover();

const organizationData = computed(() => {
  return userOrganizationsStore.selectedOrganization ?? null;
});

const studentSubscription = computed(() => {
  return studentStore.subscriptions
    .map((sub) => {
      const course = studentStore.courses.find(
        (course) => course.id === sub.course_id
      );
      return { ...sub, course: course };
    })
    .filter(
      (sub) => sub.course !== undefined
    ) as ((typeof studentStore.subscriptions)[0] & {
    course: (typeof studentStore.courses)[0];
  })[];
});

async function openEditStudent() {
  if (!studentStore.student) {
    return;
  }
  slideover.open(EditStudentForm, {
    studentId: studentStore.student.id,
    organizationId: studentStore.student.organization_id,
    "onStudent-updated": () => {
      if (studentStore.student?.user_id) {
        studentStore.loadStudent(
          studentStore.student.organization_id,
          studentStore.student.user_id
        );
      }
      slideover.close();

      toast.add({
        title: t("profile_updated"),
        description: t("profile_updated_description"),
        color: "green",
      });
    },
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "hello_student": "Hallo {student}",
    "edit_profile": "Profil bearbeiten",
    "subscription_costs": "Kosten",
    "subscribed_at": "Angefangen am {date}",
    "archived_at": "Archiviert am {date}",
    "archived": "Archiviert",
    "my_driving_school": "Über Meine Fahrschule",
    "my_driving_school_description": "Hier findest du alle Informationen zu deiner Fahrschule",
    "org_address": "Adresse",
    "org_informations": "Kontaktinformationen",
    "org_courses": "Verfügbaren Kurse",
    "contact_email": "E-Mail",
    "contact_phone": "Telefon",
    "contact_website": "Webseite",
    "not_specified": "Nicht angegeben",
    "no_subscriptions": "Keine Einschreibungen gefunden",
    "no_subscriptions_description": "Es scheint, als hättest du noch keine Einschreibungen vorgenommen. Warte bis dein Fahrlehrer dich einschreibt.",
    "profile_updated": "Profil aktualisiert",
    "profile_updated_description": "Dein Profil wurde erfolgreich aktualisiert."
  },
  "en": {
    "hello_student": "Hello {student}",
    "edit_profile": "Edit Profile",
    "subscription_costs": "Costs",
    "subscribed_at": "Started at {date}",
    "archived_at": "Archived at {date}",
    "archived": "Archived",
    "my_driving_school": "About My Driving School",
    "my_driving_school_description": "Here you can find all information about your driving school",
    "org_address": "Address",
    "org_informations": "Contact Information",
    "org_courses": "Available Courses",
    "contact_email": "Email",
    "contact_phone": "Phone",
    "contact_website": "Website",
    "not_specified": "Not specified",
    "no_subscriptions": "No subscriptions found",
    "no_subscriptions_description": "It seems you haven't made any subscriptions yet. Wait until your driving instructor subscribes you.",
    "profile_updated": "Profile updated",
    "profile_updated_description": "Your profile has been successfully updated."
  }
}
</i18n>
