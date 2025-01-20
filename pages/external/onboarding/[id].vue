<template>
  <UDashboardPanel grow>
    <UDashboardNavbar title="External">
      <template #title> Onboarding </template>
    </UDashboardNavbar>
    <UDashboardPanelContent>
      <ClientOnly>
        <!-- Prevent Hydration Mismatch 'caused by generated input Id-->
        <UContainer>
          <div
            v-if="status === 'pending'"
            class="mx-auto py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-5xl gap-16 sm:gap-y-24 grid lg:grid-cols-2 lg:items-center w-full"
          >
            <div>
              <USkeleton class="h-12 w-full" />
              <USkeleton class="h-12 w-1/2 mt-2" />
            </div>
            <div class="w-full aspect-square">
              <USkeleton class="w-full h-[350px] aspect-square rounded-md" />
            </div>
          </div>
          <div v-if="status === 'success' && org">
            <UForm
            ref="registrationForm"
              :schema="schema"
              :state="formData"
              class="space-y-4"
              :validate-on="['blur', 'submit']"
              @submit="onSubmit"
            >
              <ULandingSection
                :title="t('title', { org_name: org.name })"
                :description="t('description')"
                :links="[]"
                align="left"
              >
                <img
                  src="https://picsum.photos/360/360"
                  class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
                >
              </ULandingSection>
              <ULandingSection :title="t('personal_data')">
                <div class="grid grid-cols-2 gap-4">
                  <UFormGroup :label="t('form.firstname')" name="firstname">
                    <UInput v-model="formData.firstname" placeholder="Max" />
                  </UFormGroup>
                  <UFormGroup :label="t('form.lastname')" name="lastname">
                    <UInput
                      v-model="formData.lastname"
                      placeholder="Muestermann"
                    />
                  </UFormGroup>
                  <UFormGroup
                    class="col-span-2"
                    :label="t('form.email')"
                    name="email"
                  >
                    <UInput
                      v-model="formData.email"
                      placeholder="max.muestermann@email.de"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.phone_number')"
                    name="phone_number"
                  >
                    <UInput
                      v-model="formData.phone_number"
                      placeholder="+49 123 456 789"
                    />
                  </UFormGroup>

                  <UFormGroup :label="t('form.birth_date')">
                    <UPopover :popper="{ placement: 'top-start' }">
                      <UButton
                        icon="i-heroicons-calendar-days-20-solid"
                        :label="formatDate(formData.birth_date.toString())"
                        color="gray"
                        variant="solid"
                        block
                      />
                      <template #panel>
                        <DatePicker
                          v-model="formData.birth_date"
                          is-required
                        />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <UFormGroup
                    class="col-span-2"
                    :label="t('form.address_street')"
                    name="address_street"
                  >
                    <UInput
                      v-model="formData.address_street"
                      placeholder="Musterstraße 123"
                    />
                  </UFormGroup>
                  <UFormGroup :label="t('form.address_zip')" name="address_zip">
                    <UInput
                      v-model="formData.address_zip"
                      placeholder="12345"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.address_city')"
                    name="address_city"
                  >
                    <UInput
                      v-model="formData.address_city"
                      placeholder="Musterstadt"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.address_country')"
                    name="address_country"
                  >
                    <UInput
                      v-model="formData.address_country"
                      placeholder="Deutschland"
                    />
                  </UFormGroup>
                </div>
              </ULandingSection>
              <ULandingSection
                ref="courseInfosSection"
                :title="'An welcher Kurs wollen sie Teilnehmen'"
              >
                <div class="grid grid-cols-2 gap-4">
                  <ULandingCard
                    v-for="course in org.organization_courses"
                    :key="course.id"
                    class="cursor-pointer :"
                    :title="course.name"
                    :description="course.description"
                    color="primary"
                    @click="formData.requested_course_id = course.id"
                  >
                    <template #title>
                      <div class="flex justify-between">
                        {{ course.name }}
                        <UBadge
                          v-if="formData.requested_course_id === course.id"
                          size="xs"
                        >
                          {{ t("selected_course") }}</UBadge
                        >
                      </div>
                    </template>
                  </ULandingCard>
                </div>
                <div>
                  <UCheckbox
                    v-model="formData.has_a_license"
                    :label="t('form.has_a_license')"
                    help="Wenn du schon einen Führerschein besitzt, bitte lass es uns wissen"
                  />
                </div>
                <div class="py-6 grid place-items-center">
                  <UButton @click="onSubmit"> {{ t("cta_send") }} </UButton>
                </div>
              </ULandingSection>
            </UForm>
          </div>
          <div v-else class="py-24 sm:py-32">
            <ULandingCTA
              :title="t('error.404_title')"
              :description="t('error.404_description')"
              :links="[
                {
                  label: t('error.cta'),
                  color: 'gray',
                  trailingIcon: 'i-heroicons-arrow-right',
                  size: 'lg',
                  click: handleError,
                },
              ]"
              card
            />
          </div>
        </UContainer>
      </ClientOnly>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { z } from "zod";
import type {
  AppStudentRegistrationRequest,
  AppCourse,
  Database,
} from "~/types/app.types";
import DatePicker from "~/components/forms/Inputs/Datepicker.vue";
import { formatDate } from "~/utils/formatters";
import { sub } from "date-fns";

definePageMeta({
  validate: async (route) => {
    const org_id = route.params.id;
    console.log(org_id);
    if (!org_id) {
      return false;
    }
    // Check if the id is made up of digits
    return true;
  },
});

const { t } = useI18n({
  useScope: "local",
});

const org_id = useRoute().params.id as string;
const registrationForm = ref<HTMLFormElement | null>(null);

const client = useSupabaseClient<Database>();
const {
  data: org,
  status,
} = useAsyncData(
  async () => {
    const { data, error } = await client
      .from("organizations_view")
      .select("*")
      .eq("id", org_id)
      .single();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error(t("error.404_title"));
    }

    console.log(data);

    return data;
  },
  {
    transform: (data) => {
      const courses = data.organization_courses as AppCourse[];

      return {
        ...data,
        organization_courses: courses.map((course) => {
          return {
            ...course,
            id: course.id,
          };
        }),
      };
    },
  }
);

const schema = z.object({
  firstname: z.string().min(2),
  lastname: z.string().min(2),
  email: z.string().email(),
  phone_number: z.string(),
  birth_date: z.date().min(new Date(1900, 1, 1)).max(new Date()),
  address_street: z.string(),
  address_zip: z.string(),
  address_city: z.string(),
  address_country: z.string(),
  has_a_license: z.boolean(),
  requested_course_id: z.string().uuid(),
  organization_id: z.string().uuid(),
});

const formData = ref<
  Omit<AppStudentRegistrationRequest, "id" | "inserted_at" | "status" | "birth_date"> & {birth_date: Date}
>({
  firstname: "",
  lastname: "",
  email: "",
  phone_number: "",
  birth_date: sub(new Date(), { years: 18 }),
  address_street: "",
  address_zip: "",
  address_city: "",
  address_country: "",
  has_a_license: true,
  requested_course_id: "",
  organization_id: org_id,
});

async function onSubmit() {
  try {
    const parsed = schema.parse(formData.value);

    const data = {
      ...parsed,
      birth_date: parsed.birth_date.toISOString(),
    };

    const res = await $fetch("/api/external/register-student", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
}

function handleError() {
  clearError({
    redirect: "/",
  });
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Willkommen bei {org_name}",
    "description": "Fülle das Formular aus, um dich bei dieser Fahrschule anzumelden",
    "personal_data": "Persönliche Daten",
    "selected_course": "Gewünschter Kurs",
    "cta_continue": "Weiter",
    "cta_send": "Senden",
    "form": {
      "firstname": "Vorname",
      "lastname": "Nachname",
      "email": "E-Mail",
      "phone_number": "Telefonnummer",
      "birth_date": "Geburtsdatum",
      "address_street": "Straße und Hausnummer",
      "address_zip": "PLZ",
      "address_city": "Stadt",
      "address_country": "Land",
      "has_a_license": "Hast du bereits einen Führerschein?",
      "selected_course": "Gewünschter Kurs"
    },
    "error": {
      "404_title": "404 - Fahrscule nicht gefunden",
      "404_description": "Die Fahrscule, die Sie suchen, wurde nicht gefunden.",
      "cta": "Kontaktieren Sie uns"
    }
  },
  "en": {
    "title": "Welcome to {org_name}",
    "description": "Fill out the form to register with this driving school",
    "personal_data": "Personal data",
    "selected_course": "Desired course",
    "cta_continue": "Continue",
    "cta_send": "Send",
    "form": {
      "firstname": "First name",
      "lastname": "Last name",
      "email": "Email",
      "phone_number": "Phone number",
      "birth_date": "Date of birth",
      "address_street": "Street and house number",
      "address_zip": "ZIP",
      "address_city": "City",
      "address_country": "Country",
      "has_a_license": "Do you already have a driver's license?",
      "selected_course": "Desired course"
    },
    "error": {
      "404_title": "404 - Fahrscule not found",
      "404_description": "The Fahrscule you are looking for was not found.",
      "cta": "Contact us"
    }
  }
}
</i18n>
