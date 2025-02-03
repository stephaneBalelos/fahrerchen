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
                align="center"
              >
              <template #icon>
                <UAvatar 
                  v-if="org.avatar_path"
                  :src="$publicStorageUrl('organizations_avatars', org.avatar_path)"
                  size="lg"
                  class="w-16 h-16"
                />
                <template v-else>
                  <UAvatar :alt="org.name ?? ''" size="lg" class="w-16 h-16" />
                </template>
              </template>
                <!-- <img
                  src="https://picsum.photos/360/360"
                  class="w-full rounded-md shadow-xl ring-1 ring-gray-300 dark:ring-gray-700"
                > -->
              </ULandingSection>
              <ULandingSection :title="t('personal_data')">
                <div class="grid grid-cols-2 gap-4">
                  <UFormGroup
                    :label="t('form.firstname.label')"
                    name="firstname"
                  >
                    <UInput v-model="formData.firstname" placeholder="Max" />
                  </UFormGroup>
                  <UFormGroup :label="t('form.lastname.label')" name="lastname">
                    <UInput
                      v-model="formData.lastname"
                      placeholder="Muestermann"
                    />
                  </UFormGroup>
                  <UFormGroup
                    class="col-span-2"
                    :label="t('form.email.label')"
                    name="email"
                  >
                    <UInput
                      v-model="formData.email"
                      placeholder="max.muestermann@email.de"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.phone_number.label')"
                    name="phone_number"
                  >
                    <UInput
                      v-model="formData.phone_number"
                      placeholder="+49 123 456 789"
                    />
                  </UFormGroup>

                  <UFormGroup :label="t('form.birth_date.label')">
                    <UPopover :popper="{ placement: 'top-start' }">
                      <UButton
                        icon="i-heroicons-calendar-days-20-solid"
                        :label="formatDate(formData.birth_date.toString())"
                        color="gray"
                        variant="solid"
                        block
                      />
                      <template #panel>
                        <DatePicker v-model="formData.birth_date" is-required />
                      </template>
                    </UPopover>
                  </UFormGroup>
                </div>

                <div class="grid grid-cols-3 gap-4">
                  <UFormGroup
                    class="col-span-2"
                    :label="t('form.address_street.label')"
                    name="address_street"
                  >
                    <UInput
                      v-model="formData.address_street"
                      placeholder="Musterstraße 123"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.address_zip.label')"
                    name="address_zip"
                  >
                    <UInput
                      v-model="formData.address_zip"
                      placeholder="12345"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.address_city.label')"
                    name="address_city"
                  >
                    <UInput
                      v-model="formData.address_city"
                      placeholder="Musterstadt"
                    />
                  </UFormGroup>
                  <UFormGroup
                    :label="t('form.address_country.label')"
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
                :title="t('course_infos')"
              >
                <div class="grid grid-cols-2 gap-4">
                  <ULandingCard
                    v-for="course in org.organization_courses"
                    :key="course.id"
                    class="cursor-pointer"
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
                    :label="t('form.has_a_license.label')"
                    :help="t('form.has_a_license.help')"
                  />
                </div>
                <div>
                  <NuxtTurnstile v-model="turnstileToken" />
                </div>
                <div class="py-6 grid place-items-center">
                  <UButton type="submit"> {{ t("cta_send") }} </UButton>
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
        <UModal v-model="isOpen">
          <UCard>
            <div class="">
              <h2 class="text-xl font-semibold mb-4">{{ t("success_message") }}</h2>
              <p>{{ t("success_description") }}</p>
            </div>
            <template #footer>
              <div class="flex justify-end">
                <UButton class="ms-auto" @click="closeModal">{{ t("close") }}</UButton>
              </div>
            </template>
          </UCard>
        </UModal>
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

const { t: g } = useI18n({
  useScope: "global",
});

const org_id = useRoute().params.id as string;
const registrationForm = ref<HTMLFormElement | null>(null);
const isOpen = ref(false);

const client = useSupabaseClient<Database>();
const { data: org, status } = useAsyncData(
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

    return data;
  },
  {
    transform: (data) => {
      const courses = data.organization_courses as AppCourse[];

      return {
        ...data,
        organization_courses: courses
          .map((course) => {
            return {
              ...course,
              id: course.id,
            };
          })
          .filter((course) => course.is_active),
      };
    },
  }
);

const schema = z.object({
  firstname: z
    .string()
    .min(2, g("form_errors.min", { min: 2, field: t("form.firstname.label") }))
    .max(
      255,
      g("form_errors.max", { max: 255, field: t("form.firstname.label") })
    ),
  lastname: z
    .string()
    .min(2, g("form_errors.min", { min: 2, field: t("form.lastname.label") }))
    .max(
      255,
      g("form_errors.max", { max: 255, field: t("form.lastname.label") })
    ),
  email: z.string().email(g("form_errors.email")),
  phone_number: z
    .string()
    .min(
      6,
      g("form_errors.min", { min: 2, field: t("form.phone_number.label") })
    )
    .max(
      14,
      g("form_errors.max", { max: 255, field: t("form.phone_number.label") })
    ),
  birth_date: z
    .date()
    .min(
      new Date(1900, 1, 1),
      g("form_errors.min_date", {
        min: formatDate(new Date(1900, 1, 1).toISOString()),
      })
    )
    .max(
      new Date(),
      g("form_errors.max_date", { max: formatDate(new Date().toISOString()) })
    ),
  address_street: z
    .string()
    .min(
      2,
      g("form_errors.min", { min: 2, field: t("form.address_street.label") })
    )
    .max(
      255,
      g("form_errors.max", { max: 255, field: t("form.address_street.label") })
    ),
  address_zip: z
    .string()
    .min(
      2,
      g("form_errors.min", { min: 2, field: t("form.address_zip.label") })
    )
    .max(
      8,
      g("form_errors.max", { max: 255, field: t("form.address_zip.label") })
    ),
  address_city: z
    .string()
    .min(
      2,
      g("form_errors.min", { min: 2, field: t("form.address_city.label") })
    )
    .max(
      255,
      g("form_errors.max", { max: 255, field: t("form.address_city.label") })
    ),
  address_country: z
    .string()
    .min(
      2,
      g("form_errors.min", { min: 2, field: t("form.address_country.label") })
    )
    .max(
      255,
      g("form_errors.max", { max: 255, field: t("form.address_country.label") })
    ),
  has_a_license: z.boolean(),
  requested_course_id: z.string().uuid(),
  organization_id: z.string().uuid(),
});

const formData = ref<
  Omit<
    AppStudentRegistrationRequest,
    "id" | "inserted_at" | "status" | "birth_date"
  > & { birth_date: Date }
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
const turnstileToken = ref<string>("");

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
        "x-turnstile-token": turnstileToken.value,
      },
      body: JSON.stringify(data),
    });

    console.log(res);
    isOpen.value = true;
    registrationForm.value?.clear();
  } catch (error) {
    console.error(error);
  }
}

function closeModal() {
  isOpen.value = false;
  navigateTo("/");
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
    "course_infos": "An welchem Kurs bist du interessiert?",
    "selected_course": "Gewünschter Kurs",
    "cta_continue": "Weiter",
    "cta_send": "Senden",
    "success_message": "Erfolgreich angemeldet",
    "success_description": "Deine Anmeldung wurde erfolgreich übermittelt. Wir werden uns in Kürze bei dir melden.",
    "close": "Schließen & Zurück zur Startseite",
    "form": {
      "firstname": {
        "label": "Vorname"
      },
      "lastname": {
        "label": "Nachname"
      },
      "email": {
        "label": "Email"
      },
      "phone_number": {
        "label": "Telefonnummer"
      },
      "birth_date": {
        "label": "Geburtsdatum"
      },
      "address_street": {
        "label": "Straße"
      },
      "address_zip": {
        "label": "PLZ"
      },
      "address_city": {
        "label": "Stadt"
      },
      "address_country": {
        "label": "Land"
      },
      "has_a_license": {
        "label": "Hast du bereits einen Führerschein?",
        "help": "Wenn du bereits einen Führerschein hast, bitte ankreuzen."
      },
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
    "course_infos": "Which course are you interested in?",
    "selected_course": "Desired course",
    "cta_continue": "Continue",
    "cta_send": "Send",
    "success_message": "Successfully registered",
    "success_description": "Your registration has been successfully submitted. We will contact you shortly.",
    "close": "Close & Back to Homepage",
    "form": {
      "firstname": {
        "label": "First name"
      },
      "lastname": {
        "label": "Last name"
      },
      "email": {
        "label": "Email"
      },
      "phone_number": {
        "label": "Phone number"
      },
      "birth_date": {
        "label": "Date of birth"
      },
      "address_street": {
        "label": "Street"
      },
      "address_zip": {
        "label": "ZIP"
      },
      "address_city": {
        "label": "City"
      },
      "address_country": {
        "label": "Country"
      },
      "has_a_license": {
        "label": "Do you already have a driver's license?",
        "help": "If you already have a driver's license, please check."
      },
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
