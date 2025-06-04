<template>
  <UDashboardPanelContent>
    <UContainer class="w-full">
      <UDashboardSection
        :title="
          t('hello_student', {
            student: `${studentStore.student?.firstname} ${studentStore.student?.lastname}`,
          })
        "
        :description="studentStore.student?.email"
        class="py-12"
      >
        <template #links>
          <UButton
            :label="t('edit_profile')"
            color="gray"
            @click="openEditStudent"
          />
        </template>
        <div v-if="studentStore.subscriptions.length > 0">
          <div
            v-for="subscription in studentStore.subscriptions"
            :key="subscription.id"
          >
            <UButton
              :to="`/students/${org_id}/subscription/${subscription.id}`"
            >
              {{ subscription.course_name }}
            </UButton>
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
                {{
                  organizationData.name
                }}
              </div>
              <div class="text-sm">
                {{
                  organizationData.description ??
                  t("not_specified")
                }}
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
                {{
                  organizationData.address_country
                }}
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
                  {{
                    organizationData.email ??
                    t("not_specified")
                  }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t("contact_phone") }}
                </div>
                <div class="text-sm">
                  {{
                    organizationData.phone_number ??
                    t("not_specified")
                  }}
                </div>
              </div>
              <div class="flex flex-col">
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ t("contact_website") }}
                </div>
                <div class="text-sm">
                  {{
                    organizationData.website ??
                    t("not_specified")
                  }}
                </div>
              </div>
            </div>
          </div>
          <div v-if="coursesData" class="pt-8">
            <div class="text-lg font-semibold">{{ t("org_courses") }}</div>
            <div class="grid grid-cols-2 gap-4 mt-4">
              <UCard
                v-for="course in coursesData"
                :key="course.id"
              >
                <div class="flex flex-col space-y-2">
                  <div class="text-lg font-semibold">{{ course.name }}</div>
                  <div class="text-sm">{{ course.description }}</div>
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

const studentStore = useStudentStore();

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient();
const route = useRoute();
const org_id = route.params.org_id as string;
const toast = useToast();
const slideover = useSlideover();


const { data: organizationData } = await useAsyncData(
  "organization/" + org_id,
  async () => {
    if (!org_id) return false;
    const { data, error } = await client
      .from("organizations")
      .select("*")
      .eq("id", org_id)
      .single();
    if (error) {
      console.error("Error fetching organization:", error);
      return false;
    }
    return data;
  }
);

const { data: coursesData } = await useAsyncData(
  "organization_courses/" + org_id,
  async () => {
    if (!org_id) return false;
    const { data, error } = await client
      .from("courses")
      .select("*")
      .eq("organization_id", org_id);
    if (error) {
      console.error("Error fetching organization courses:", error);
      return false;
    }
    return data;
  }
);

async function openEditStudent() {
  if (!studentStore.student) {
    return;
  }
  slideover.open(EditStudentForm, {
    studentId: studentStore.student.id,
    organizationId: org_id,
    "onStudent-updated": () => {
      if (studentStore.student?.user_id) {
        studentStore.loadStudent(org_id, studentStore.student.user_id);
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
