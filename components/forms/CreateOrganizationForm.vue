<template>
  <UModal>
    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'submit']"
      @submit="createOrganization"
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: { base: 'flex flex-col space-y-4' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ t("your_new_organization") }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="$emit('close')"
            />
          </div>
        </template>

        <UFormGroup
          :label="t('form.name.label')"
          :description="t('form.name.description')"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            :placeholder="t('form.name.placeholder')"
          />
        </UFormGroup>

        <UFormGroup
          :label="t('form.email.label')"
          :description="t('form.email.description')"
          name="email"
          required
        >
          <UInput v-model="state.email" type="email" />
        </UFormGroup>

        <UFormGroup
          :label="t('form.phone.label')"
          :description="t('form.phone.description')"
          name="phone"
          required
        >
          <UInput v-model="state.phone_number" type="tel" />
        </UFormGroup>

        <UFormGroup
          :label="t('form.address_street.label')"
          :description="t('form.address_street.description')"
          name="address_street"
          required
        >
          <UInput v-model="state.address_street" />
        </UFormGroup>

        <UFormGroup
          :label="t('form.address_city.label')"
          :description="t('form.address_city.description')"
          name="address_city"
          required
        >
          <UInput v-model="state.address_city" />
        </UFormGroup>

        <div class="grid grid-cols-3 gap-2">
          <UFormGroup
            :label="t('form.address_zip.label')"
            :description="t('form.address_zip.description')"
            name="address_zip"
            required
          >
            <UInput v-model="state.address_zip" />
          </UFormGroup>

          <UFormGroup
            class="col-span-2"
            :label="t('form.address_country.label')"
            :description="t('form.address_country.description')"
            name="address_country"
            required
          >
            <UInput v-model="state.address_country" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="gray" variant="ghost" @click="$emit('close')">{{
              t("cancel")
            }}</UButton>
            <UButton
              type="submit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
              >{{ t("create") }}</UButton
            >
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>

<script setup lang="ts">
import * as z from "zod";

const user = useSupabaseUser();
const userOrganizationsStore = useUserOrganizationsStore();

const { t, locale } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const $emits = defineEmits<{
  (e: "close" | "created"): void;
}>();

const toast = useToast();

const isSubmitting = ref(false);

const schema = z.object({
  name: z
    .string()
    .min(3, g("form_errors.min", { field: t("form.name.label"), min: 3 }))
    .max(255, g("form_errors.max", { field: t("form.name.label"), max: 255 })),
  email: z
    .string()
    .email(g("form_errors.email", { field: t("form.email.label") })),
  phone_number: z
    .string()
    .min(3, g("form_errors.min", { field: t("form.phone.label"), min: 3 }))
    .max(255, g("form_errors.max", { field: t("form.phone.label"), max: 255 })),
  address_street: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_street.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_street.label"), max: 255 })
    ),
  address_city: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_city.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_city.label"), max: 255 })
    ),
  address_zip: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_zip.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_zip.label"), max: 255 })
    ),
  address_country: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_country.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_country.label"), max: 255 })
    ),
});

type OrganizationSchema = z.infer<typeof schema>;

const state = ref<OrganizationSchema>({
  name: "",
  email: user.value?.email || "",
  phone_number: "",
  address_street: "",
  address_city: "",
  address_zip: "",
  address_country: "",
});

const createOrganization = async () => {
  if (user.value === null) {
    return;
  }

  if (!schema.safeParse(state.value)) {
    return;
  }

  try {
    isSubmitting.value = true;
    const data = {
      name: state.value.name,
      email: state.value.email,
      handle: state.value.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
        .substring(0, 50),
      phone_number: state.value.phone_number,
      website: "",
      owner_id: user.value.id,
      preferred_language: locale.value === "de" ? "de" : "en",
      address_city: state.value.address_city,
      address_country: state.value.address_country,
      address_street: state.value.address_street,
      address_zip: state.value.address_zip,
      allow_self_registration: false,
    };
    await userOrganizationsStore.createOrganization(data);
    $emits("created");
  } catch (error) {
    console.error("Error creating organization:", error);
    toast.add({
      title: t("form_submission_error_title"),
      description: t("form_submission_error_description"),
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "your_new_organization": "Deine neue Fahrschule",
    "cancel": "Abbrechen",
    "create": "Weiter",
    "form_submission_error_title": "Fehler beim Erstellen der Fahrschule",
    "form_submission_error_description": "Beim Erstellen der Fahrschule ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    "form": {
      "name": {
        "label": "Name",
        "description": "Name deine neue Fahrschule",
        "placeholder": "Fahrschule XYZ"
      },
      "email": {
        "label": "E-Mail-Adresse Ihrer Fahrschule",
        "description": "E-Mail-Adresse der Fahrschule. Sie können sie später ändern."
      },
      "phone": {
        "label": "Telefonnummer Ihrer Fahrschule",
        "description": "Telefonnummer der Fahrschule. Sie können sie später ändern."
      },
      "address_street": {
        "label": "Straße und Hausnummer",
        "description": "z.B. Musterstraße 123"
      },
      "address_city": {
        "label": "Stadt",
        "description": "z.B. Musterstadt"
      },
      "address_zip": {
        "label": "Postleitzahl",
        "description": "z.B. 12345"
      },
      "address_country": {
        "label": "Land",
        "description": "z.B. Deutschland"
      }
    }
  },
  "en": {
    "your_new_organization": "Your new Driving School",
    "cancel": "Cancel",
    "create": "Continue",
    "form_submission_error_title": "Error creating Driving School",
    "form_submission_error_description": "An error occurred while creating the Driving School. Please try again.",
    "form": {
      "name": {
        "label": "Name",
        "description": "Name your new Driving School",
        "placeholder": "Driving School XYZ"
      },
      "email": {
        "label": "E-Mail",
        "description": "E-Mail address of the Driving School. You can change it later."
      },
      "phone": {
        "label": "Phone",
        "description": "Phone number of the Driving School. You can change it later."
      },
      "address_street": {
        "label": "Street",
        "description": "Street and house number, e.g. Musterstraße 123"
      },
      "address_city": {
        "label": "City",
        "description": "City, e.g. Musterstadt"
      },
      "address_zip": {
        "label": "ZIP Code",
        "description": "ZIP Code, e.g. 12345"
      },
      "address_country": {
        "label": "Country",
        "description": "Country, e.g. Germany"
      }
    }
  }
}
</i18n>
