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
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="modal.close()"
          />
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
              @submit.prevent="_onSubmit"
            >
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
        <div class="col-span-3 overflow-y-auto h-full">
          <iframe
            class="w-full mx-auto"
            style="aspect-ratio: 1 / 1.4142; max-width: 800px"
            :srcdoc="renderedTemplate"
            frameborder="0"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
// import { z } from "zod";
import Handlebars from "handlebars";

type Props = {
  organizationId: string;
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});
const modal = useModal();
const template = ref<string | null>(null);

const selectedExamapleIndex = ref(0);

const renderedTemplate = computed(() => {
  if (!template.value) return "";

  // Compile the template with Handlebars
  const compiledTemplate = Handlebars.compile(template.value);

  const s = state;
  // Prepare the state for rendering
  const exampleBill = billExamples.value[selectedExamapleIndex.value];
  if (exampleBill) {
    s.bill_date = exampleBill.bill_date;
    s.bill_number = exampleBill.bill_number;
    s.bill_total = exampleBill.total.toFixed(2);
    s.bill_vat_rate = exampleBill.vat_rate.toFixed(2);
    s.bill_vat_amount = exampleBill.vat_amount.toFixed(2);
    s.bill_total_with_vat =
      (exampleBill.total + exampleBill.vat_amount).toFixed(2);
    s.bill_items = exampleBill.bill_items
  } else {
    console.warn("No example bill found for index:", selectedExamapleIndex.value);
  }

  // Render the template with the current state
  return compiledTemplate(s);
});

onMounted(() => {
  loadTemplate();
});

const state = reactive({
  driving_school_name: "",
  driving_school_address_street: "",
  driving_school_address_zip: "",
  driving_school_address_city: "",
  driving_school_address_country: "",
  driving_school_email: "",
  driving_school_phone_number: "",
  student_firstname: "",
  student_lastname: "",
  student_address_street: "",
  student_address_zip: "",
  student_address_city: "",
  student_address_country: "",
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
  bill_items: [] as {
    title: string;
    description: string;
    count: number;
    total: number;
  }[],
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
    console.log("Fetched organization data:", data.value);
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
  }
});

async function loadTemplate() {
  try {
    const html = await $fetch<string>(
      `/api/orgs/settings/load-invoice-template`,
      {
        method: "GET",
      }
    );

    template.value = html;
  } catch (error) {
    console.error("Error loading template:", error);
  }
}

async function _onSubmit() {
  try {
    // Here you would typically send the state to your backend to save the changes
    console.log("Form submitted with data:", state);
    // For example:
    // await $fetch('/api/orgs/settings/save-invoice-customization', {
    //   method: 'POST',
    //   body: state,
    // });
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

const billExamples = ref([
  {
    bill_date: new Date().toISOString(),
    bill_number: "INV-0001",
    total: 100.0,
    vat_rate: 19.0,
    vat_amount: 19.0,
    bill_items: [
      {
        title: t("example_bill_items.base_costs.title"),
        description: t("example_bill_items.base_costs.description"),
        count: 1,
        total: 100.0,
      },
      {
        title: t("example_bill_items.theory.title"),
        description: t("example_bill_items.theory.description"),
        count: 2,
        total: 50.0,
      },
      {
        title: t("example_bill_items.practice.title"),
        description: t("example_bill_items.practice.description"),
        count: 3,
        total: 150.0,
      },
      {
        title: t("example_bill_items.learning_materials.title"),
        description: t("example_bill_items.learning_materials.description"),
        count: 1,
        total: 30.0,
      },
    ],
  },
]);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "modal_title": "Rechnung anpassen",
    "example_bill_items": {
      "theory": {
        "title": "Theorieunterricht",
        "description": "Rechnungsposten für Theorieunterricht"
      },
      "practice": {
        "title": "Fahrpraxis",
        "description": "Rechnungsposten für Fahrpraxis"
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
      "invoice_customizer": {
        "title": "Rechnung anpassen",
        "description": "Passen Sie Ihre Rechnungsvorlage an.",
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
    "settings": {
      "invoice_customizer": {
        "title": "Customize Invoice",
        "description": "Adjust your invoice template.",
        "invoice_title": {
          "label": "Invoice Title",
          "description": "The title of the invoice displayed on the invoice.",
          "placeholder": "Invoice"
        },
        "invoice_subtitle": {
          "label": "Invoice Subtitle",
          "description": "The subtitle of the invoice displayed on the invoice.",
          "placeholder": "Thank you for your order"
        },
        "invoice_message": {
          "label": "Invoice Message",
          "description": "A message displayed on the invoice.",
          "placeholder": "Thank you for your order"
        },
        "invoice_footer": {
          "label": "Invoice Footer",
          "description": "The footer of the invoice displayed on the invoice.",
          "placeholder": "All information without guarantee"
        }
      }
    }
  }
}
</i18n>
