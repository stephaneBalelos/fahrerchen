<template>
  <UDashboardPanelContent>
    <ClientOnly>
      <UContainer class="w-full">
        <UForm
          ref="form"
          :state="state"
          class="space-y-4"
          :schema="schema"
          :validate-on="['submit', 'blur']"
          :onSubmit="saveStudent"
        >
          <UDashboardSection
            :title="t('welcome', { org_name: organization?.name })"
            :description="t('description')"
          >
            <UFormGroup :label="t('form.firstname.label')" name="firstname" required>
              <UInput v-model="state.firstname" />
            </UFormGroup>
            <UFormGroup :label="t('form.lastname.label')" name="lastname" required>
              <UInput v-model="state.lastname" />
            </UFormGroup>
            <UFormGroup :label="t('form.email.label')" name="email" required>
              <UInput v-model="state.email" :disabled="!!userStore.user" />
            </UFormGroup>
            <UFormGroup :label="t('form.phone_number.label')" name="phone_number" required>
              <UInput v-model="state.phone_number" />
            </UFormGroup>
            <UFormGroup :label="t('form.birth_date.label')" name="birth_date" required>
              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton
                  icon="i-heroicons-calendar-days-20-solid"
                  :label="format(state.birth_date, 'd MMM, yyy')"
                  color="gray"
                  variant="solid"
                  block
                />
                <template #panel="{ close }">
                  <DatePicker
                    v-model="state.birth_date"
                    is-required
                  />
                </template>
              </UPopover>
            </UFormGroup>
            <UFormGroup
              class="col-span-2"
              :label="t('form.address_street.label')"
              name="address_street"
              required
            >
              <UInput v-model="state.address_street" />
            </UFormGroup>
            <div class="grid grid-cols-3 gap-2">
              <UFormGroup
                class="col-span-2"
                :label="t('form.address_city.label')"
                name="address_city"
                required
              >
                <UInput v-model="state.address_city" />
              </UFormGroup>
              <UFormGroup :label="t('form.address_zip.label')" name="address_zip" required>
                <UInput v-model="state.address_zip" />
              </UFormGroup>
            </div>
            <UFormGroup
            :label="t('form.address_country.label')"
            name="address_country" required>
              <UInput v-model="state.address_country" />
            </UFormGroup>
            <UCheckbox
              :label="t('form.has_a_license.label')"
              :help="t('form.has_a_license.description')"
              v-model="state.has_a_license"
            />

            <div class="flex">
              <UButton
                type="submit"
                :loading="isLoading"
                :label="t('save_and_continue')"
                block
              />
            </div>
          </UDashboardSection>
        </UForm>
      </UContainer>
    </ClientOnly>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";
import { format, min } from "date-fns";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import DatePicker from "~/components/forms/Inputs/Datepicker.vue";
import organizations from "~/middleware/organizations";

definePageMeta({
  layout: "default",
  middleware: [organizations],
});

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});


const route = useRoute();
const userStore = useUserStore();
const client = useSupabaseClient<Database>();
const toast = useToast();
const isLoading = ref(false);

const schema = z.object({
  email: z.string().email(),
  firstname: z.string({message: g('form_errors.required', {field: t("form.firstname.label")})})
  .min(2, g('form_errors.min', {field: t("form.firstname.label"), min: 2}))
  .max(255, g('form_errors.max', {field: t("form.firstname.label"), max: 255})),
  lastname: z.string({message: g('form_errors.required', {field: t("form.lastname.label")})})
  .min(2, g('form_errors.min', {field: t("form.lastname.label"), min: 2}))
  .max(255, g('form_errors.max', {field: t("form.lastname.label"), max: 255})),
  phone_number: z.string()
  .min(6, g('form_errors.min', {field: t("form.phone_number.label"), min: 6}))
  .max(255, g('form_errors.max', {field: t("form.phone_number.label"), max: 255})),
  birth_date: z.date().min(new Date(1900, 1, 1)).max(new Date()),
  address_street: z.string()
  .min(2, g('form_errors.min', {field: t("form.address_street.label"), min: 2}))
  .max(255, g('form_errors.max', {field: t("form.address_street.label"), max: 255})),
  address_city: z.string()
  .min(2, g('form_errors.min', {field: t("form.address_city.label"), min: 2}))
  .max(255, g('form_errors.max', {field: t("form.address_city.label"), max: 255})),
  address_zip: z.string()
  .min(2, g('form_errors.min', {field: t("form.address_zip.label"), min: 2}))
  .max(255, g('form_errors.max', {field: t("form.address_zip.label"), max: 255})),
  address_country: z.string()
  .min(2, g('form_errors.min', {field: t("form.address_country.label"), min: 2}))
  .max(255, g('form_errors.max', {field: t("form.address_country.label"), max: 255})),
  has_a_license: z.boolean(),
});

type UserSchema = z.output<typeof schema>;

const form = ref<Form<UserSchema> | null>(null);

const state = reactive<UserSchema>({
  email: userStore.user?.email || "",
  firstname: userStore.user?.firstname || "",
  lastname: userStore.user?.lastname || "",
  birth_date: new Date(),
  address_street: "",
  address_city: "",
  address_zip: "",
  address_country: "",
  phone_number: "",
  has_a_license: false,
});

const { data:organization, error } = useAsyncData(`organizations/${route.params.org_id}`, async () => {
  const { data, error } = await client.from("organizations").select("*").eq("id", route.params.org_id).single();
  if (error) {
    throw error;
  }
  return data;
});

async function saveStudent(event: FormSubmitEvent<UserSchema>) {

  if (organization.value && userStore.user) {
    await createStudent(
      event.data,
      organization.value.id,
      userStore.user.id
    );
  }
}

async function createStudent(data: UserSchema, organization_id: string, user_id: string) {
  isLoading.value = true;
  const { data: student, error } = await client
    .from("students")
    .insert({
      ...data,
      user_id: user_id,
      birth_date: data.birth_date.toISOString(),
      organization_id: organization_id,
    })
    .select("id")
    .single();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    throw error;
  } else {
    toast.add({
      title: "Student Profile Created",
      description: "Your student Profile has been created",
      color: "green",
    });
    navigateTo(`/my/${organization_id}/students/${student.id}`);
  }
  isLoading.value = false;
}
</script>

<style scoped></style>


<i18n lang="json">
{
  "de": {
    "welcome": "Willkommen bei der Fahrschule {org_name}",
    "description": "Erstellen Sie Ihr Studentenprofil, um fortzufahren",
    "save_and_continue": "Speichern und fortfahren",
    "form": {
      "firstname": {
        "label": "Vorname",
        "description": "Bitte geben Sie Ihren Vornamen ein"
      },
      "lastname": {
        "label": "Nachname",
        "description": "Bitte geben Sie Ihren Nachnamen ein"
      },
      "email": {
        "label": "Email",
        "description": "Bitte geben Sie Ihre Email ein"
      },
      "phone_number": {
        "label": "Telefonnummer",
        "description": "Bitte geben Sie Ihre Telefonnummer ein"
      },
      "birth_date": {
        "label": "Geburtsdatum",
        "description": "Bitte geben Sie Ihr Geburtsdatum ein"
      },
      "address_street": {
        "label": "Straße und Hausnummer",
        "description": "Bitte geben Sie Ihre Straße und Hausnummer ein"
      },
      "address_city": {
        "label": "Stadt",
        "description": "Bitte geben Sie Ihre Stadt ein"
      },
      "address_zip": {
        "label": "PLZ",
        "description": "Bitte geben Sie Ihre PLZ ein"
      },
      "address_country": {
        "label": "Land",
        "description": "Bitte geben Sie Ihr Land ein"
      },
      "has_a_license": {
        "label": "Ich besitze schon einen Führerschein",
        "description": "Bitte ankreuzen, wenn der Student bereits einen Führerschein besitzt"
      }
    }
  },
  "en": {
    "welcome": "Welcome to {org_name} driving school",
    "description": "Create your student profile to continue",
    "save_and_continue": "Save and Continue",
    "form": {
      "firstname": {
        "label": "Firstname",
        "description": "Please enter your first name"
      },
      "lastname": {
        "label": "Lastname",
        "description": "Please enter your last name"
      },
      "email": {
        "label": "Email",
        "description": "Please enter your email"
      },
      "phone_number": {
        "label": "Phone Number",
        "description": "Please enter your phone number"
      },
      "birth_date": {
        "label": "Birth Date",
        "description": "Please enter your birth date"
      },
      "address_street": {
        "label": "Street and House Number",
        "description": "Please enter your street and house number"
      },
      "address_city": {
        "label": "City",
        "description": "Please enter your city"
      },
      "address_zip": {
        "label": "Zip",
        "description": "Please enter your zip"
      },
      "address_country": {
        "label": "Country",
        "description": "Please enter your country"
      },
      "has_a_license": {
        "label": "I already have a driver's license",
        "description": "Please check if the student already has a driver's license"
      }
    }
  }
}
</i18n>