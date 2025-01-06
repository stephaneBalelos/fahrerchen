<template>
  <UDashboardSlideover :title="props.studentId ? t('edit_title') : t('title')">
    <div class="d-flex">
      <UAvatar
        size="3xl"
        :alt="`${state.firstname} ${state.lastname}`"
        :icon="props.studentId ? 'i-heroicons-user' : 'i-heroicons-user-plus'"
      />
      <div>
        <h1 class="text-2xl font-semibold">{{ fullname }}</h1>
        <p class="text-gray-500">{{ state.email }}</p>
      </div>
    </div>
    <UForm
      ref="form"
      :state="state"
      class="space-y-4"
      :schema="schema"
      :validate-on="['submit', 'blur']"
      @submit="saveStudent"
    >
      <UDashboardSection :title="t('personal_information')">
        <UFormGroup
          :label="t('form.firstname.label')"
          name="firstname"
          required
        >
          <UInput v-model="state.firstname" />
        </UFormGroup>
        <UFormGroup :label="t('form.lastname.label')" name="lastname" required>
          <UInput v-model="state.lastname" />
        </UFormGroup>
        <UFormGroup :label="t('form.email.label')" name="email" required>
          <UInput v-model="state.email" />
        </UFormGroup>
        <UFormGroup
          :label="t('form.phone_number.label')"
          name="phone_number"
          required
        >
          <UInput v-model="state.phone_number" />
        </UFormGroup>
        <UFormGroup
          :label="t('form.birth_date.label')"
          name="birth_date"
          required
        >
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="formatDate(state.birth_date.toISOString())"
              color="white"
              variant="solid"
              block
            />
            <template #panel>
              <DatePicker v-model="state.birth_date" is-required />
            </template>
          </UPopover>
        </UFormGroup>
        <UFormGroup
          class="col-span-2"
          :label="t('form.address_street.label')"
          name="adress_street"
        >
          <UInput v-model="state.address_street" />
        </UFormGroup>

        <div class="grid grid-cols-3 gap-2">
          <UFormGroup
            class="col-span-2"
            :label="t('form.address_city.label')"
            name="adress_city"
          >
            <UInput v-model="state.address_city" />
          </UFormGroup>
          <UFormGroup :label="t('form.address_zip.label')" name="adress_zip">
            <UInput v-model="state.address_zip" />
          </UFormGroup>
        </div>
        <UFormGroup
          :label="t('form.address_country.label')"
          name="adress_country"
        >
          <UInput v-model="state.address_country" />
        </UFormGroup>

        <UCheckbox
          v-model="state.has_a_license"
          :label="t('form.has_a_license.label')"
          :help="t('form.has_a_license.help')"
        />
      </UDashboardSection>
    </UForm>
    <template #footer>
      <UButton @click="form?.submit()">{{ t('save') }}</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import DatePicker from "./Inputs/Datepicker.vue";
import { formatDate } from "~/utils/formatters";

const props = defineProps<{
  organizationId: string;
  studentId?: string;
}>();

const emit = defineEmits<{
  (e: "student-created" | "student-updated", value: AppStudent): void;
}>();

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const schema = z.object({
  email: z.string()
  .email(g("form_errors.email")),
  firstname: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.firstname.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.firstname.label") })),
  lastname: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.lastname.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.lastname.label") })),
  phone_number: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.phone_number.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.phone_number.label") })),
  birth_date: z.date()
  .min(new Date(1900, 1, 1), g("form_errors.min_date", { min: formatDate((new Date(1900, 1, 1)).toISOString()) }))
  .max(new Date(), g("form_errors.max_date", { max: formatDate((new Date()).toISOString()) })),
  address_street: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.address_street.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.address_street.label") })),
  address_city: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.address_city.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.address_city.label") })),
  address_zip: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.address_zip.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.address_zip.label") })),
  address_country: z.string()
  .min(2, g("form_errors.min", { min: 2, field: t("form.address_country.label") }))
  .max(255, g("form_errors.max", { max: 255, field: t("form.address_country.label") })),
  has_a_license: z.boolean(),
});

type UserSchema = z.output<typeof schema>;

const form = ref<Form<UserSchema> | null>(null);

const state = reactive<UserSchema>({
  email: "",
  firstname: "",
  lastname: "",
  birth_date: new Date(),
  address_street: "",
  address_city: "",
  address_zip: "",
  address_country: "",
  phone_number: "",
  has_a_license: false,
});
const fullname = computed(() => `${state.firstname} ${state.lastname}`);

const client = useSupabaseClient<Database>();
const toast = useToast();

if (props.studentId) {
  // fetch student data
  const { data, error } = await useAsyncData(
    `student-${props.studentId}`,
    async () => {
      if (!props.studentId) {
        return null;
      }
      const { data, error } = await client
        .from("students")
        .select("*")
        .eq("id", props.studentId)
        .single();
      if (error) {
        throw error;
      }
      return data;
    }
  );

  if (!error.value && data.value) {
    state.email = data.value.email;
    state.firstname = data.value.firstname;
    state.lastname = data.value.lastname;
    state.phone_number = data.value.phone_number ?? "";
    state.birth_date = new Date(data.value.birth_date);
    state.address_street = data.value.address_street ?? "";
    state.address_city = data.value.address_city ?? "";
    state.address_zip = data.value.address_zip ?? "";
    state.address_country = data.value.address_country ?? "";
    state.has_a_license = data.value.has_a_license ?? false;
  }
}

function saveStudent($event: FormSubmitEvent<UserSchema>) {
  if (!props.organizationId) {
    return;
  }

  if (props.studentId) {
    updateStudent($event.data, props.studentId);
  } else {
    createStudent($event.data, props.organizationId);
  }
}

async function createStudent(data: UserSchema, organization_id: string) {
  const { data: student, error } = await client
    .from("students")
    .insert({
      ...data,
      birth_date: data.birth_date.toISOString(),
      organization_id: organization_id,
    })
    .select("*")
    .single();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    throw error;
  }
  emit("student-created", student);
}

async function updateStudent(data: UserSchema, student_id: string) {
  const { data: student, error } = await client
    .from("students")
    .update({
      ...data,
      birth_date: data.birth_date.toISOString(),
    })
    .eq("id", student_id)
    .select("*")
    .single();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    throw error;
  }
  emit("student-updated", student);
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Neuer Fahrschüler:in",
    "edit_title": "Fahrschüler:in bearbeiten",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "personal_information": "Persönliche Informationen",
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
      "address_city": {
        "label": "Stadt"
      },
      "address_zip": {
        "label": "PLZ"
      },
      "address_country": {
        "label": "Land"
      },
      "has_a_license": {
        "label": "Besitzt schon ein Fahrerlaubnis",
        "help": "Bitte ankreuzen, wenn der Student schon ein Fahrerlaubnis besitzt"
      }
    }
  }
}
</i18n>
