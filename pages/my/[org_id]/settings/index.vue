<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { title } from "process";
import * as z from "zod";
import type { Database } from "~/types/app.types";
import FileUploader from "~/components/forms/Inputs/FileUploader.vue";

const fileRef = ref<HTMLInputElement>();
const isDeleteAccountModalOpen = ref(false);

const config = useRuntimeConfig().public

const userOrganizationStore = useUserOrganizationsStore();
const route = useRoute();

const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const {
  data: org,
  error,
  status,
} = await useAsyncData(`organizations/${route.params.org_id}`, async () => {
  const { data, error } = await client
    .from("organizations")
    .select("*")
    .eq("id", route.params.org_id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}, {
  transform: (data) => {
    const avatar_path = data.avatar_path ? `${config.supabase_storage_url}/object/public/organizations_avatars/${data.avatar_path}` : '';
    console.log(avatar_path)
    return {
      ...data,
      avatar_path,
    };
  },
});

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
      20,
      g("form_errors.max", { field: t("settings.address.zip.label"), max: 20 })
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

const toast = useToast();
const isSubmitting = ref(false);

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  state.avatar_path = URL.createObjectURL(input.files[0]);
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  isSubmitting.value = true;

  if (!org.value) {
    return;
  }

  try {
    const { data, error } = await client
      .from("organizations")
      .update({
        name: state.name,
        email: state.email,
        phone_number: state.phone_number,
        website: state.website,
        description: state.description,
        address_street: state.address_street,
        address_city: state.address_city,
        address_zip: state.address_zip,
        address_country: state.address_country,
        avatar_path: state.avatar_path,
      })
      .eq("id", org.value.id);

    if (error) {
      throw error;
    }

    toast.add({
      title: t("toast_success.title"),
      description: t("toast_success.description"),
      color: "green",
    });
  } catch (error) {
    console.error(error);
    toast.add({
      title: t("toast_error.title"),
      description: t("toast_error.description"),
      color: "red",
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

<template>
  <UDashboardPanelContent>
    <div>
      <!-- <UDashboardSection
        :title="t('settings.title')"
        description="Customize the look and feel of your dashboard."
      >
        <template #links>
          <UColorModeSelect color="gray" />
        </template>
      </UDashboardSection> -->
      <!-- <UDivider class="mb-4" /> -->
      <UForm
        :state="state"
        :schema="schema"
        :validate-on="['submit']"
        @submit="onSubmit"
        @error="onError"
      >
        <UDashboardSection
          :title="t('settings.title')"
          :description="t('settings.description')"
        >
          <template #links>
            <UButton
              type="submit"
              :label="t('settings.save_changes')"
              color="black"
              :loading="isSubmitting"
            />
          </template>
          <UFormGroup
            name="name"
            :label="t('settings.name.label')"
            :description="t('settings.name.description')"
            required
            class="grid grid-cols-2 gap-2 items-center"
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
            class="grid grid-cols-2 gap-2"
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
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.phone_number"
              type="tel"
              :placeholder="t('settings.phone_number.placeholder')"
              autocomplete="off"
              size="md"
            >
            </UInput>
          </UFormGroup>
          <UFormGroup
            name="website"
            :label="t('settings.website.label')"
            :description="t('settings.website.description')"
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.website"
              type="url"
              :placeholder="t('settings.website.placeholder')"
              autocomplete="off"
              size="md"
            >
            </UInput>
          </UFormGroup>
          <UFormGroup
            :label="t('settings.avatar.label')"
            class="grid grid-cols-2 gap-2"
            :help="t('settings.avatar.help')"
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
            />
          </UFormGroup>
          <UFormGroup
            name="description"
            :label="t('settings.org_description.label')"
            :description="t('settings.org_description.description')"
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UTextarea
              v-model="state.description"
              :rows="5"
              autoresize
              size="md"
            />
          </UFormGroup>
          <UFormGroup
            :label="t('settings.address.label')"
            :description="t('settings.address.description')"
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              id="address_street"
              v-model="state.address_street"
              type="text"
              :placeholder="t('settings.address.street.label')"
              size="md"
            />
            <UInput
              id="address_city"
              v-model="state.address_city"
              type="text"
              :placeholder="t('settings.address.city.label')"
              size="md"
              class="mt-2"
            />
            <UInput
              id="address_zip"
              v-model="state.address_zip"
              type="text"
              :placeholder="t('settings.address.zip.label')"
              size="md"
              class="mt-2"
            />
            <UInput
              id="address_country"
              v-model="state.address_country"
              type="text"
              :placeholder="t('settings.address.country.label')"
              size="md"
              class="mt-2"
            />
          </UFormGroup>
        </UDashboardSection>
      </UForm>
      <UDivider class="mb-4" />
      <UDashboardSection
        title="Account"
        description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
      >
        <div>
          <UButton
            color="red"
            label="Delete account"
            size="md"
            @click="isDeleteAccountModalOpen = true"
          />
        </div>
      </UDashboardSection>
      <!-- ~/components/settings/DeleteAccountModal.vue -->
      <!-- <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" /> -->
    </div>
  </UDashboardPanelContent>
</template>

<i18n lang="json">
{
  "de": {
    "settings": {
      "title": "Fahrschul-Einstellungen",
      "description": "Informationen über Ihre Fahrschule. Diese Informationen werden auf Rechnungen, Rechnungen und anderen Kommunikationsmitteln angezeigt.",
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
