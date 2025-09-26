<template>
  <UForm
    :state="state"
    :schema="schema"
    :validate-on="['submit', 'blur']"
    @submit.prevent="onSubmit"
    @error="onError"
  >
    <div class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800">
      <UFormGroup
        :label="t('settings.avatar.label')"
        class="grid grid-cols-2 gap-2 pb-4"
        :description="t('settings.avatar.help')"
        :ui="{
          container: 'flex flex-wrap items-center gap-3',
          help: 'mt-0',
        }"
      >
        <UAvatar :src="state.avatar_path" :alt="state.name" size="lg" />
        <FileUploader
          v-if="org"
          :bucket-id="'organizations_avatars'"
          :path="org.id"
          :extensions="['image/*']"
          @uploaded="onAvatarUploadSuccess"
        />
      </UFormGroup>

      <UFormGroup
        name="name"
        :label="t('settings.name.label')"
        :description="t('settings.name.description')"
        required
        class="grid grid-cols-2 gap-2 py-4"
        :ui="{ container: '' }"
      >
        <UInput
          v-model="state.name"
          autocomplete="off"
          icon="i-heroicons-building-office"
          size="md"
        />
      </UFormGroup>
      <UFormGroup
        name="email"
        :label="t('settings.email.label')"
        :description="t('settings.email.description')"
        required
        class="grid grid-cols-2 gap-2 py-4"
        :ui="{ container: '' }"
      >
        <UInput
          v-model="state.email"
          :placeholder="t('settings.email.placeholder')"
          type="email"
          autocomplete="off"
          icon="i-heroicons-envelope"
          size="md"
        />
      </UFormGroup>
      <!-- <UFormGroup
            name="handle"
            :label="t('settings.phone_number.label')"
            :description="t('settings.phone_number.description')"
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.phone_number"
              type="username"
              autocomplete="off"
              size="md"
              input-class="ps-[77px]"
            >
              <template #trailing>
                <span class="text-gray-500 dark:text-gray-400 text-sm">.karjolen.app</span>
              </template>
            </UInput>
          </UFormGroup> -->
      <UFormGroup
        name="phone_number"
        :label="t('settings.phone_number.label')"
        :description="t('settings.phone_number.description')"
        class="grid grid-cols-2 gap-2 py-4"
        :ui="{ container: '' }"
      >
        <UInput
          v-model="state.phone_number"
          type="tel"
          :placeholder="t('settings.phone_number.placeholder')"
          autocomplete="off"
          size="md"
        />
      </UFormGroup>
      <UFormGroup
        name="website"
        :label="t('settings.website.label')"
        :description="t('settings.website.description')"
        class="grid grid-cols-2 gap-2 py-4"
        :ui="{ container: '' }"
      >
        <UInput
          v-model="state.website"
          type="url"
          :placeholder="t('settings.website.placeholder')"
          autocomplete="off"
          size="md"
        />
      </UFormGroup>
      <UFormGroup
        name="description"
        :label="t('settings.org_description.label')"
        :description="t('settings.org_description.description')"
        class="grid grid-cols-2 gap-2 py-4"
        :ui="{ container: '' }"
      >
        <UTextarea v-model="state.description" :rows="5" autoresize size="md" />
      </UFormGroup>
      <UFormGroup
        :label="t('settings.address.label')"
        :description="t('settings.address.description')"
        class="grid grid-cols-2 gap-2 py-4"
        :ui="{ container: '' }"
      >
        <UFormGroup
          name="address_street"
          :label="t('settings.address.street.label')"
        >
          <UInput
            id="address_street"
            v-model="state.address_street"
            type="text"
            :placeholder="t('settings.address.street.label')"
            size="md"
          />
        </UFormGroup>
        <UFormGroup
          name="address_city"
          :label="t('settings.address.city.label')"
        >
          <UInput
            id="address_city"
            v-model="state.address_city"
            type="text"
            :placeholder="t('settings.address.city.label')"
            size="md"
            class="mt-2"
          />
        </UFormGroup>
        <UFormGroup name="address_zip" :label="t('settings.address.zip.label')">
          <UInput
            id="address_zip"
            v-model="state.address_zip"
            name="address_zip"
            type="text"
            :placeholder="t('settings.address.zip.label')"
            size="md"
            class="mt-2"
          />
        </UFormGroup>
        <UFormGroup
          name="address_country"
          :label="t('settings.address.country.label')"
        >
          <UInput
            id="address_country"
            v-model="state.address_country"
            type="text"
            :placeholder="t('settings.address.country.label')"
            size="md"
            class="mt-2"
          />
        </UFormGroup>
      </UFormGroup>
      <div class="flex justify-end pt-4">
        <UButton
          :size="'lg'"
          type="submit"
          :label="t('settings.save_changes')"
          color="black"
          :loading="isSubmitting"
        />
      </div>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormError } from "#ui/types";
import type { Database } from "~/types/database.types";
import FileUploader from "./Inputs/FileUploader.vue";

type Props = {
  orgId: string;
};

const props = defineProps<Props>();

const config = useRuntimeConfig().public;
const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});
const toast = useToast();
const $emits = defineEmits<{
  (e: "updated"): void;
}>();

const isSubmitting = ref(false);
const { data: org } = await useAsyncData(
  `organizations/${props.orgId}`,
  async () => {
    return await userOrganizationsStore.getOrganizationById(props.orgId);
  },
  {
    transform: (data) => {
      if (!data) {
        return null;
      }
      const avatar_path = data.avatar_path
        ? `${config.supabase_storage_url}/object/public/organizations_avatars/${data.avatar_path}`
        : "";
      return {
        ...data,
        avatar_path,
      };
    },
  }
);

const schema = z.object({
  name: z.string({
    required_error: g("form_errors.required", {
      field: t("settings.name.label"),
    }),
  }),
  email: z
    .string({
      required_error: g("form_errors.required", {
        field: t("settings.email.label"),
      }),
    })
    .email(g("form_errors.email")),
  phone_number: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("settings.phone_number.label"), min: 3 })
    )
    .max(
      20,
      g("form_errors.max", { field: t("settings.phone_number.label"), max: 20 })
    )
    .optional(),
  website: z.string().optional(),
  description: z
    .string()
    .max(
      255,
      g("form_errors.max", {
        field: t("settings.org_description.label"),
        max: 255,
      })
    )
    .optional(),
  address_street: z
    .string()
    .min(
      3,
      g("form_errors.min", {
        field: t("settings.address.street.label"),
        min: 3,
      })
    )
    .max(
      255,
      g("form_errors.max", {
        field: t("settings.address.street.label"),
        max: 255,
      })
    )
    .optional(),
  address_city: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("settings.address.city.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", {
        field: t("settings.address.city.label"),
        max: 255,
      })
    )
    .optional(),
  address_zip: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("settings.address.zip.label"), min: 3 })
    )
    .max(
      10,
      g("form_errors.max", { field: t("settings.address.zip.label"), max: 10 })
    )
    .optional(),
  address_country: z
    .string()
    .min(
      3,
      g("form_errors.min", {
        field: t("settings.address.country.label"),
        min: 3,
      })
    )
    .max(
      255,
      g("form_errors.max", {
        field: t("settings.address.country.label"),
        max: 255,
      })
    )
    .optional(),
  allow_self_registration: z.boolean().optional(),
  preferred_language: z.string().optional(),
});

async function onAvatarUploadSuccess() {
  if (!org.value) {
    return;
  }
  try {
    const { data, error } = await client
      .from("organizations")
      .select("avatar_path")
      .eq("id", org.value.id)
      .single();

    if (error) {
      throw error;
    }

    if (data.avatar_path) {
      state.avatar_path = `${config.supabase_storage_url}/object/public/organizations_avatars/${data.avatar_path}`;
    }
  } catch (error) {
    console.error(error);
  }
}

const state = reactive({
  name: org.value?.name || "",
  email: org.value?.email || "",
  phone_number: org.value?.phone_number || "",
  website: org.value?.website || "",
  description: org.value?.description || "",
  address_street: org.value?.address_street || "",
  address_city: org.value?.address_city || "",
  address_zip: org.value?.address_zip || "",
  address_country: org.value?.address_country || "",
  allow_self_registration: org.value?.allow_self_registration || false,
  preferred_language: org.value?.preferred_language || "",
  avatar_path: org.value?.avatar_path || "",
});

onMounted(() => {
  // If orgId is provided, load the organization details for editing
  if (props.orgId) {
    // Load organization details logic here
  }
});

async function onSubmit() {
  isSubmitting.value = true;
  try {
    if (!org.value) {
      throw new Error("Organization not found");
    }
    if (!schema.safeParse(state)) {
      throw new Error("Invalid form data");
    }

    const updates = {
      name: state.name,
      email: state.email,
      phone_number: state.phone_number,
      website: state.website,
      description: state.description,
      address_street: state.address_street,
      address_city: state.address_city,
      address_zip: state.address_zip,
      address_country: state.address_country,
      allow_self_registration: state.allow_self_registration,
      preferred_language: state.preferred_language,
    };

    await userOrganizationsStore.updateOrganizationById(org.value.id, updates);
    $emits("updated");
  } catch (error) {
    console.error("Error updating organization:", error);
    toast.add({
      title: t("toast_error.title"),
      description: t("toast_error.description"),
    });
  } finally {
    isSubmitting.value = false;
  }
}

function onError(error: FormError) {
  // Show error message
  console.log(error);
}
</script>

<style></style>

<i18n lang="json">
{
  "de": {
    "settings": {
      "title": "Fahrschul-Einstellungen",
      "description": "Informationen über Ihre Fahrschule. Diese Informationen werden auf Rechnungen und anderen Kommunikationsmitteln angezeigt.",
      "delete_account": {
        "title": "Fahrschule löschen",
        "description": "Löschen Sie Ihre Fahrschule und alle damit verbundenen Daten. Diese Aktion kann nicht rückgängig gemacht werden.",
        "label": "Fahrschule löschen"
      },
      "name": {
        "label": "Name",
        "description": "Der Name Ihrer Fahrschule."
      },
      "email": {
        "label": "E-Mail-Adresse",
        "description": "Die E-Mail-Adresse Ihrer Fahrschule.",
        "placeholder": "Ihre E-Mail-Adresse"
      },
      "phone_number": {
        "label": "Telefonnummer",
        "description": "Die Telefonnummer Ihrer Fahrschule.",
        "placeholder": "Ihre Telefonnummer"
      },
      "website": {
        "label": "Website",
        "description": "Die Website Ihrer Fahrschule.",
        "placeholder": "Ihre Website"
      },
      "avatar": {
        "label": "Profilbild",
        "help": "Der Logo Ihrer Fahrschule. Dieses Bild wird auf Rechnungen, Rechnungen und anderen Kommunikationsmitteln angezeigt.",
        "upload": "Bild hochladen"
      },
      "org_description": {
        "label": "Beschreibung",
        "description": "Eine kurze Beschreibung Ihrer Fahrschule."
      },
      "address": {
        "label": "Adresse",
        "description": "Die Adresse Ihrer Fahrschule.",
        "street": {
          "label": "Straße"
        },
        "city": {
          "label": "Stadt"
        },
        "zip": {
          "label": "PLZ"
        },
        "country": {
          "label": "Land"
        }
      },
      "save_changes": "Änderungen speichern"
    },
    "toast_success": {
      "title": "Erfolgreich gespeichert",
      "description": "Ihre Änderungen wurden erfolgreich gespeichert."
    },
    "toast_error": {
      "title": "Fehler beim Speichern",
      "description": "Ihre Änderungen konnten nicht gespeichert werden. Bitte versuchen Sie es erneut."
    }
  },
  "en": {
    "settings": {
      "title": "School settings",
      "description": "Information about your school. This information will appear on receipts, invoices, and other communication.",
      "delete_account": {
        "title": "Delete school",
        "description": "Delete your school and all associated data. This action cannot be undone.",
        "label": "Delete school"
      },
      "name": {
        "label": "Name",
        "description": "The name of your school."
      },
      "email": {
        "label": "Email address",
        "description": "The email address of your school.",
        "placeholder": "Your email address"
      },
      "phone_number": {
        "label": "Phone number",
        "description": "The phone number of your school.",
        "placeholder": "Your phone number"
      },
      "website": {
        "label": "Website",
        "description": "The website of your school.",
        "placeholder": "Your website"
      },
      "avatar": {
        "label": "Profile picture",
        "help": "The logo of your school. This image will appear on receipts, invoices, and other communication.",
        "upload": "Upload image"
      },
      "org_description": {
        "label": "Description",
        "description": "A brief description of your school."
      },
      "address": {
        "label": "Address",
        "description": "The address of your school.",
        "street": {
          "label": "Street"
        },
        "city": {
          "label": "City"
        },
        "zip": {
          "label": "ZIP"
        },
        "country": {
          "label": "Country"
        }
      },
      "save_changes": "Save changes"
    }
  }
}
</i18n>
