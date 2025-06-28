<template>
  <UModal fullscreen>
    <UCard
      v-if="status === 'success' && data"
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow relative',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ t("modal_title") }}
          </h3>
          <div class="flex items-center space-x-2">
            <UButton
              color="primary"
              variant="solid"
              class="-my-1"
              @click="onSubmit"
            >
              {{ t("settings.save_settings") }}
            </UButton>
            <UButton
              color="gray"
              variant="ghost"
              class="-my-1"
              :label="t('settings.close')"
              @click="modal.close()"
            />
          </div>
        </div>
      </template>

      <div class="absolute inset-0 h-full w-full grid grid-cols-4">
        <div
          class="relative col-span-1 h-full pr-4 border-r border-gray-200 dark:border-gray-700"
        >
          <div class="absolute inset-0 overflow-y-auto p-4">
            <UForm
              :state="state"
              class="space-y-4"
              :ui="{
                base: 'space-y-4',
              }"
              @submit.prevent="onSubmit"
            >
            <UFormGroup
                :label="t('settings.invoice_customizer.template.label')"
                :description="t('settings.invoice_customizer.template.description')"
                name="template_name"
                required
              >
                  <USelectMenu v-model="selectedTemplateName" :options="templates" :value-attribute="'value'" />
            </UFormGroup>
              <UFormGroup
                :label="t('settings.invoice_customizer.invoice_title.label')"
                :description="
                  t('settings.invoice_customizer.invoice_title.description')
                "
                name="invoice_title"
                :placeholder="
                  t('settings.invoice_customizer.invoice_title.placeholder')
                "
                required
              >
                <UInput
                  v-model="state.invoice_title"
                  :placeholder="
                    t('settings.invoice_customizer.invoice_title.placeholder')
                  "
                />
              </UFormGroup>
              <UFormGroup
                :label="t('settings.invoice_customizer.invoice_subtitle.label')"
                :description="
                  t('settings.invoice_customizer.invoice_subtitle.description')
                "
                name="invoice_subtitle"
                :placeholder="
                  t('settings.invoice_customizer.invoice_subtitle.placeholder')
                "
                required
              >
                <UInput
                  v-model="state.invoice_subtitle"
                  :placeholder="
                    t(
                      'settings.invoice_customizer.invoice_subtitle.placeholder'
                    )
                  "
                />
              </UFormGroup>
              <UFormGroup
                :label="t('settings.invoice_customizer.invoice_message.label')"
                :description="
                  t('settings.invoice_customizer.invoice_message.description')
                "
                name="invoice_message"
                :placeholder="
                  t('settings.invoice_customizer.invoice_message.placeholder')
                "
                required
              >
                <UInput
                  v-model="state.invoice_message"
                  :placeholder="
                    t('settings.invoice_customizer.invoice_message.placeholder')
                  "
                />
              </UFormGroup>
              <UFormGroup
                :label="t('settings.invoice_customizer.invoice_footer.label')"
                :description="
                  t('settings.invoice_customizer.invoice_footer.description')
                "
                name="invoice_footer"
                :placeholder="
                  t('settings.invoice_customizer.invoice_footer.placeholder')
                "
                required
              >
                <UInput
                  v-model="state.invoice_footer"
                  :placeholder="
                    t('settings.invoice_customizer.invoice_footer.placeholder')
                  "
                />
              </UFormGroup>
            </UForm>
          </div>
        </div>
        <SettingsInvoiceCustomizerModalInvoicePreview
          v-if="selectedTemplateName"
          :state="state"
          :selected-examaple-index="0"
          :template-name="selectedTemplateName"
        />
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
// import { z } from "zod";

import type { BillTemplateData } from "~/types/app.types";
type Props = {
  organizationId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});
const modal = useModal();
const toast = useToast();
const publicStorageUrl = useNuxtApp().$publicStorageUrl;

const state = reactive<BillTemplateData>({
  driving_school_logo: "",
  driving_school_name: "",
  driving_school_address_street: "",
  driving_school_address_zip: "",
  driving_school_address_city: "",
  driving_school_address_country: "",
  driving_school_email: "",
  driving_school_phone_number: "",
  student_firstname: "Max",
  student_lastname: "Mustermann",
  student_address_street: "Musterstraße 1",
  student_address_zip: "12345",
  student_address_city: "Musterstadt",
  student_address_country: "Deutschland",
  bill_date: "",
  bill_number: "",
  invoice_title: "",
  invoice_subtitle: "",
  bill_total: "",
  bill_vat_exempt: false,
  bill_vat_rate: "",
  bill_vat_amount: "",
  bill_total_with_vat: "",
  invoice_message: "",
  invoice_footer: "",
  bill_settings_bank_account_name: "",
  bill_settings_bank_account_number: "",
  bill_settings_bank_account_bic: "",
  bill_settings_bank_account_iban: "",
  bill_settings_tax_id: "",
  bill_items: [],
});

const client = useSupabaseClient();
const { data, status } = await useAsyncData(async () => {
  const { data, error } = await client
    .from("organizations")
    .select("*, bill_settings:organization_billing_settings(*)")
    .eq("id", props.organizationId);

  if (error) {
    console.error("Error fetching billing settings:", error);
    throw error;
  }
  return data[0];
});

// Initialize state with fetched data
onMounted(() => {
  if (data.value) {
    const orgData = data.value;
    state.driving_school_name = orgData.name || "";
    state.driving_school_address_street = orgData.address_street || "";
    state.driving_school_address_zip = orgData.address_zip || "";
    state.driving_school_address_city = orgData.address_city || "";
    state.driving_school_address_country = orgData.address_country || "";
    state.driving_school_email = orgData.email || "";
    state.driving_school_phone_number = orgData.phone_number || "";
    state.bill_settings_bank_account_name =
      orgData.bill_settings?.bank_account_name || "";
    state.bill_settings_bank_account_number =
      orgData.bill_settings?.bank_account_number || "";
    state.bill_settings_bank_account_bic =
      orgData.bill_settings?.bank_account_bic || "";
    state.bill_settings_bank_account_iban =
      orgData.bill_settings?.bank_account_iban || "";
    state.bill_settings_tax_id = orgData.bill_settings?.tax_id || "";
    state.invoice_title = orgData.bill_settings?.invoice_title || "";
    state.invoice_subtitle = orgData.bill_settings?.invoice_subtitle || "";
    state.invoice_message = orgData.bill_settings?.invoice_message || "";
    state.invoice_footer = orgData.bill_settings?.invoice_footer || "";
    state.driving_school_logo =
      publicStorageUrl("organizations_avatars", orgData.avatar_path ?? "") ||
      "";
    selectedTemplateName.value =
      orgData.bill_settings?.template_name || "default";
  }
});

async function onSubmit() {
  try {
    const { error } = await client
      .from("organization_billing_settings")
      .update({
        invoice_title: state.invoice_title,
        invoice_subtitle: state.invoice_subtitle,
        invoice_message: state.invoice_message,
        invoice_footer: state.invoice_footer,
        template_name: selectedTemplateName.value,
      })
      .eq("id", props.organizationId);
    if (error) {
      console.error("Error updating billing settings:", error);
      throw error;
    }

    toast.add({
      title: t("settings.settings_saved"),
      description: t("settings.settings_saved_description"),
      color: "green",
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.add({
      title: t("settings.save_error"),
      description: t("settings.save_error_description"),
      color: "red",
    });
  }
}

const templates = ref([
  { label: "Default Template", value: "default" },
  { label: "Simple Template", value: "simple" }
]);
const selectedTemplateName = ref<string>();
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "modal_title": "Rechnung anpassen",
    "example_bill_items": {
      "theory": {
        "title": "Theorieunterricht",
        "description": "Hier wird die Aktivität des Theorieunterrichts beschrieben"
      },
      "practice": {
        "title": "Fahrpraxis",
        "description": "Hier wird die Aktivität der Fahrpraxis beschrieben"
      },
      "base_costs": {
        "title": "Grundkosten",
        "description": "Rechnungsposten für Grundkosten"
      },
      "learning_materials": {
        "title": "Lernmaterialien",
        "description": "Rechnungsposten für Lernmaterialien"
      }
    },
    "settings": {
      "save_settings": "Einstellungen speichern",
      "close": "Schließen",
      "settings_saved": "Einstellungen gespeichert",
      "settings_saved_description": "Ihre Einstellungen wurden erfolgreich gespeichert.",
      "settings_save_error": "Fehler beim Speichern der Einstellungen",
      "settings_save_error_description": "Es gab einen Fehler beim Speichern Ihrer Einstellungen.",
      "invoice_customizer": {
        "title": "Rechnung anpassen",
        "description": "Passen Sie Ihre Rechnungsvorlage an.",
        "template": {
          "label": "Rechnungsvorlage",
          "description": "Wählen Sie die Vorlage für Ihre Rechnung aus.",
          "placeholder": "Standardvorlage"
        },
        "invoice_title": {
          "label": "Rechnungstitel",
          "description": "Der Titel der Rechnung, der auf der Rechnung angezeigt wird.",
          "placeholder": "Erbrachte Leistungen"
        },
        "invoice_subtitle": {
          "label": "Rechnung Untertitel",
          "description": "Der Untertitel der Rechnung, der auf der Rechnung angezeigt wird.",
          "placeholder": "Rechnung für die bisher erbrachten Leistungen"
        },
        "invoice_message": {
          "label": "Rechnung Nachricht",
          "description": "Eine Nachricht, die auf der Rechnung angezeigt wird.",
          "placeholder": "Vielen Dank für Ihren Auftrag"
        },
        "invoice_footer": {
          "label": "Rechnung Fußzeile",
          "description": "Die Fußzeile der Rechnung, die auf der Rechnung angezeigt wird.",
          "placeholder": "Diese Rechnung wurde elektronisch erstellt und ist ohne Unterschrift gültig."
        }
      }
    }
  },
  "en": {
    "modal_title": "Customize Invoice",
    "example_bill_items": {
      "theory": {
        "title": "Theory Lessons",
        "description": "Invoice item for theory lessons"
      },
      "practice": {
        "title": "Driving Practice",
        "description": "Invoice item for driving practice"
      },
      "base_costs": {
        "title": "Base Costs",
        "description": "Invoice item for base costs"
      },
      "learning_materials": {
        "title": "Learning Materials",
        "description": "Invoice item for learning materials"
      }
    },
    "settings": {
      "save_settings": "Save Settings",
      "close": "Close",
      "settings_saved": "Settings Saved",
      "settings_saved_description": "Your settings have been successfully saved.",
      "settings_save_error": "Error Saving Settings",
      "settings_save_error_description": "There was an error saving your settings.",
      "invoice_customizer": {
        "title": "Customize Invoice",
        "description": "Adjust your invoice template.",
        "template": {
          "label": "Invoice Template",
          "description": "Select the template for your invoice.",
          "placeholder": "Default Template"
        },
        "invoice_title": {
          "label": "Invoice Title",
          "description": "The title of the invoice that will be displayed on the invoice.",
          "placeholder": "Services Rendered"
        },
        "invoice_subtitle": {
          "label": "Invoice Subtitle",
          "description": "The subtitle of the invoice that will be displayed on the invoice.",
          "placeholder": "Invoice for services rendered so far"
        },
        "invoice_message": {
          "label": "Invoice Message",
          "description": "A message that will be displayed on the invoice",
          "placeholder": "Thank you for your order"
        },
        "invoice_footer": {
          "label": "Invoice Footer",
          "description": "The footer of the invoice that will be displayed on the invoice.",
          "placeholder": "This invoice was created electronically and is valid without a signature."
        }
      }
    }
  }
}
</i18n>
