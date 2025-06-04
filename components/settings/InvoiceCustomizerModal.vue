<template>
  <UModal fullscreen>
    <UCard
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
              ref="form"
              :state="state"
              :schema="schema"
              @submit="onSubmit"
            >
              <UDashboardSection
                :title="t('settings.invoice_customizer.title')"
                :description="t('settings.invoice_customizer.description')"
                class="mb-4"
              >
                <UFormGroup
                  name="driving_school_name"
                  :label="
                    t('settings.invoice_customizer.driving_school_name.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_name.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_name"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_name.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_address"
                  :label="
                    t(
                      'settings.invoice_customizer.driving_school_address.label'
                    )
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_address.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_address"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_address.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_zip"
                  :label="
                    t('settings.invoice_customizer.driving_school_zip.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_zip.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_zip"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_zip.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_city"
                  :label="
                    t('settings.invoice_customizer.driving_school_city.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_city.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_city"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_city.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_country"
                  :label="
                    t(
                      'settings.invoice_customizer.driving_school_country.label'
                    )
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_country.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_country"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_country.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_email"
                  :label="
                    t('settings.invoice_customizer.driving_school_email.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_email.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_email"
                    type="email"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_email.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_phone"
                  :label="
                    t('settings.invoice_customizer.driving_school_phone.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_phone.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_phone"
                    type="tel"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_phone.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="invoice_title"
                  :label="t('settings.invoice_customizer.invoice_title.label')"
                  :description="
                    t('settings.invoice_customizer.invoice_title.description')
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.invoice_title"
                    :placeholder="
                      t('settings.invoice_customizer.invoice_title.placeholder')
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="invoice_subtitle"
                  :label="
                    t('settings.invoice_customizer.invoice_subtitle.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.invoice_subtitle.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.invoice_subtitle"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.invoice_subtitle.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="invoice_footer"
                  :label="t('settings.invoice_customizer.invoice_footer.label')"
                  :description="
                    t('settings.invoice_customizer.invoice_footer.description')
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.invoice_footer"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.invoice_footer.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>

                <UFormGroup
                  name="driving_school_bank_name"
                  :label="
                    t(
                      'settings.invoice_customizer.driving_school_bank_name.label'
                    )
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_bank_name.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_bank_name"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_bank_name.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_bank_iban"
                  :label="
                    t(
                      'settings.invoice_customizer.driving_school_bank_iban.label'
                    )
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_bank_iban.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_bank_iban"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_bank_iban.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_bank_bic"
                  :label="
                    t(
                      'settings.invoice_customizer.driving_school_bank_bic.label'
                    )
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_bank_bic.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_bank_bic"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_bank_bic.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_bank_account_holder"
                  :label="
                    t(
                      'settings.invoice_customizer.driving_school_bank_account_holder.label'
                    )
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_bank_account_holder.description'
                    )
                  "
                  required
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_bank_account_holder"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_bank_account_holder.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
                <UFormGroup
                  name="driving_school_vat_id"
                  :label="
                    t('settings.invoice_customizer.driving_school_vat_id.label')
                  "
                  :description="
                    t(
                      'settings.invoice_customizer.driving_school_vat_id.description'
                    )
                  "
                  class="grid grid-cols-1 gap-4 items-center"
                >
                  <UInput
                    v-model="state.driving_school_vat_id"
                    :placeholder="
                      t(
                        'settings.invoice_customizer.driving_school_vat_id.placeholder'
                      )
                    "
                    :ui="{ input: 'w-full' }"
                  />
                </UFormGroup>
              </UDashboardSection>
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
import { z } from "zod";
import Handlebars from "handlebars"

const { t } = useI18n({
  useScope: "local",
});
const modal = useModal();
const template = ref<string | null>(null);

const renderedTemplate = computed(() => {
  if (!template.value) return "";
  
  // Compile the template with Handlebars
  const compiledTemplate = Handlebars.compile(template.value);
  
  // Render the template with the current state
  return compiledTemplate(state);
});

onMounted(() => {
  loadTemplate();

});

const schema = z.object({
  driving_school_name: z.string(),
  driving_school_address: z.string(),
  driving_school_zip: z.string(),
  driving_school_city: z.string(),
  driving_school_country: z.string(),
  driving_school_email: z.string().email(),
  driving_school_phone: z.string(),
  invoice_title: z.string(),
  invoice_subtitle: z.string(),
  invoice_footer: z.string(),
  driving_school_bank_name: z.string(),
  driving_school_bank_iban: z.string(),
  driving_school_bank_bic: z.string(),
  driving_school_bank_account_holder: z.string(),
  driving_school_vat_id: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Schema>({
  driving_school_name: "",
  driving_school_address: "",
  driving_school_zip: "",
  driving_school_city: "",
  driving_school_country: "",
  driving_school_email: "",
  driving_school_phone: "",
  invoice_title: "",
  invoice_subtitle: "",
  invoice_footer: "",
  driving_school_bank_name: "",
  driving_school_bank_iban: "",
  driving_school_bank_bic: "",
  driving_school_bank_account_holder: "",
  driving_school_vat_id: "",
});

async function loadTemplate() {
  try {
    const html = await $fetch<string>(`/api/orgs/settings/load-invoice-template`, {
      method: "GET",
    });

    console.log("Template loaded:", html);

    template.value = html;

  } catch (error) {
    console.error("Error loading template:", error);
  }
}

async function onSubmit() {
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
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "modal_title": "Rechnung anpassen",
    "settings": {
      "invoice_customizer": {
        "title": "Rechnung anpassen",
        "description": "Passen Sie Ihre Rechnungsvorlage an.",
        "driving_school_name": {
          "label": "Name der Fahrschule",
          "description": "Der Name Ihrer Fahrschule, der auf der Rechnung angezeigt wird.",
          "placeholder": "Fahrschule Mustermann"
        },
        "driving_school_address": {
          "label": "Adresse der Fahrschule",
          "description": "Die Adresse Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "Musterstraße 1"
        },
        "driving_school_zip": {
          "label": "Postleitzahl der Fahrschule",
          "description": "Die Postleitzahl Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "12345"
        },
        "driving_school_city": {
          "label": "Stadt der Fahrschule",
          "description": "Die Stadt Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "Musterstadt"
        },
        "driving_school_country": {
          "label": "Land der Fahrschule",
          "description": "Das Land Ihrer Fahrschule, das auf der Rechnung angezeigt wird.",
          "placeholder": "Deutschland"
        },
        "driving_school_email": {
          "label": "E-Mail-Adresse der Fahrschule",
          "description": "Die E-Mail-Adresse Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "fahrschule(at)xyz.de"
        },
        "driving_school_phone": {
          "label": "Telefonnummer der Fahrschule",
          "description": "Die Telefonnummer Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "+49 123 4567890"
        },
        "invoice_title": {
          "label": "Rechnungstitel",
          "description": "Der Titel der Rechnung, der auf der Rechnung angezeigt wird.",
          "placeholder": "Rechnung"
        },
        "invoice_subtitle": {
          "label": "Rechnung Untertitel",
          "description": "Der Untertitel der Rechnung, der auf der Rechnung angezeigt wird.",
          "placeholder": "Vielen Dank für Ihren Auftrag"
        },
        "invoice_footer": {
          "label": "Rechnung Fußzeile",
          "description": "Die Fußzeile der Rechnung, die auf der Rechnung angezeigt wird.",
          "placeholder": "Alle Angaben ohne Gewähr"
        },
        "driving_school_bank_name": {
          "label": "Bankname der Fahrschule",
          "description": "Der Name der Bank Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "Bank Mustermann"
        },
        "driving_school_bank_iban": {
          "label": "IBAN der Fahrschule",
          "description": "Die IBAN Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "DE89370400440532013000"
        },
        "driving_school_bank_bic": {
          "label": "BIC der Fahrschule",
          "description": "Die BIC Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "COBADEFFXXX"
        },
        "driving_school_bank_account_holder": {
          "label": "Kontoinhaber der Fahrschule",
          "description": "Der Kontoinhaber Ihrer Fahrschule, der auf der Rechnung angezeigt wird.",
          "placeholder": "Max Mustermann"
        },
        "driving_school_vat_id": {
          "label": "USt-IdNr. der Fahrschule",
          "description": "Die Umsatzsteuer-Identifikationsnummer Ihrer Fahrschule, die auf der Rechnung angezeigt wird.",
          "placeholder": "DE123456789"
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
        "driving_school_name": {
          "label": "Driving School Name",
          "description": "The name of your driving school displayed on the invoice.",
          "placeholder": "Driving School Example"
        },
        "driving_school_address": {
          "label": "Driving School Address",
          "description": "The address of your driving school displayed on the invoice.",
          "placeholder": "Example Street 1"
        },
        "driving_school_zip": {
          "label": "Driving School ZIP Code",
          "description": "The ZIP code of your driving school displayed on the invoice.",
          "placeholder": "12345"
        },
        "driving_school_city": {
          "label": "Driving School City",
          "description": "The city of your driving school displayed on the invoice.",
          "placeholder": "Example City"
        },
        "driving_school_country": {
          "label": "Driving School Country",
          "description": "The country of your driving school displayed on the invoice.",
          "placeholder": "Germany"
        },
        "driving_school_email": {
          "label": "Driving School Email",
          "description": "The email address of your driving school displayed on the invoice.",
          "placeholder": "drivingschool(at)xyz.de"
        },
        "driving_school_phone": {
          "label": "Driving School Phone",
          "description": "The phone number of your driving school displayed on the invoice.",
          "placeholder": "+49 123 4567890"
        },

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
        "invoice_footer": {
          "label": "Invoice Footer",
          "description": "The footer of the invoice displayed on the invoice.",
          "placeholder": "All information without guarantee"
        },
        "driving_school_bank_name": {
          "label": "Driving School Bank Name",
          "description": "The name of your driving school's bank displayed on the invoice.",
          "placeholder": "Example Bank"
        },
        "driving_school_bank_iban": {
          "label": "Driving School Bank IBAN",
          "description": "The IBAN of your driving school displayed on the invoice.",
          "placeholder": "DE89370400440532013000"
        },
        "driving_school_bank_bic": {
          "label": "Driving School Bank BIC",
          "description": "The BIC of your driving school displayed on the invoice.",
          "placeholder": "COBADEFFXXX"
        },
        "driving_school_bank_account_holder": {
          "label": "Driving School Bank Account Holder",
          "description": "The account holder of your driving school displayed on the invoice.",
          "placeholder": "Max Example"
        },
        "driving_school_vat_id": {
          "label": "Driving School VAT ID",
          "description": "The VAT ID of your driving school displayed on the invoice.",
          "placeholder": "DE123456789"
        }
      }
    }
  }
}
</i18n>
