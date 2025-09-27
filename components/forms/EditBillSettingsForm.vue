<template>
  <UCard
    :ui="{
      body: {
        base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
      },
    }"
  >
    <UAlert
      v-if="status == 'success' && !data"
      :title="t('billing_settings_not_configured')"
      :description="t('billing_settings_not_configured_description')"
      color="amber"
      variant="soft"
      icon="i-heroicons-exclamation-triangle-20-solid"
    />
    <UForm
      v-if="status == 'success'"
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'submit']"
      class="space-y-4"
      @submit="saveSettings"
    >
      <UFormGroup
        name="bank_account_name"
        :label="t('form.bank_account_name.label')"
        :placeholder="t('form.bank_account_name.placeholder')"
        :description="t('form.bank_account_name.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.bank_account_name" size="md" />
      </UFormGroup>

      <UFormGroup
        name="bank_account_number"
        :label="t('form.bank_account_number.label')"
        :placeholder="t('form.bank_account_number.placeholder')"
        :description="t('form.bank_account_number.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.bank_account_number" size="md" />
      </UFormGroup>
      <UFormGroup
        name="bank_account_iban"
        :label="t('form.bank_account_iban.label')"
        :placeholder="t('form.bank_account_iban.placeholder')"
        :description="t('form.bank_account_iban.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.bank_account_iban" size="md" />
      </UFormGroup>
      <UFormGroup
        name="bank_account_bic"
        :label="t('form.bank_account_bic.label')"
        :placeholder="t('form.bank_account_bic.placeholder')"
        :description="t('form.bank_account_bic.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.bank_account_bic" size="md" />
      </UFormGroup>

      <UFormGroup
        name="vat_rate"
        :label="t('form.vat_rate.label')"
        :placeholder="t('form.vat_rate.placeholder')"
        :description="t('form.vat_rate.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput
          v-model.number="state.vat_rate"
          type="number"
          size="md"
          :min="0"
          :max="100"
        >
          <template #trailing>
            <span class="text-gray-500 dark:text-gray-400 text-xs">%</span>
          </template>
        </UInput>
      </UFormGroup>
      <UFormGroup
        name="vat_exempt"
        :label="t('form.vat_exempt.label')"
        :description="t('form.vat_exempt.description')"
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UToggle v-model="state.vat_exempt" />
      </UFormGroup>

      <UFormGroup
        name="tax_id"
        :label="t('form.tax_id.label')"
        :placeholder="t('form.tax_id.placeholder')"
        :description="t('form.tax_id.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <UInput v-model="state.tax_id" size="md" />
      </UFormGroup>

      <div class="flex gap-4 mt-4 justify-end">
        <UButton :loading="isSaving" :disabled="isSaving" type="submit">
          {{ t("form.save") }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";

const isSaving = ref(false);

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const toast = useToast();

const props = defineProps<{
  organizationId: string;
}>();

const organizationsStore = useUserOrganizationsStore();

const schema = z.object({
  bank_account_name: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.bank_account_name.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", {
        field: t("form.bank_account_name.label"),
        max: 255,
      })
    ),
  bank_account_number: z
    .string()
    .min(
      3,
      g("form_errors.min", {
        field: t("form.bank_account_number.label"),
        min: 3,
      })
    )
    .max(
      255,
      g("form_errors.max", {
        field: t("form.bank_account_number.label"),
        max: 255,
      })
    ),
  bank_account_iban: z
    .string()
    .min(
      12,
      g("form_errors.min", {
        field: t("form.bank_account_iban.label"),
        min: 12,
      })
    )
    .max(
      36,
      g("form_errors.max", {
        field: t("form.bank_account_iban.label"),
        max: 36,
      })
    ),
  bank_account_bic: z
    .string()
    .min(
      8,
      g("form_errors.min", { field: t("form.bank_account_bic.label"), min: 8 })
    )
    .max(
      11,
      g("form_errors.max", { field: t("form.bank_account_bic.label"), max: 11 })
    ),
  // VAT rate should be a percentage between 0 and 100
  vat_rate: z
    .number()
    .min(0, g("form_errors.min", { field: t("form.vat_rate.label"), min: 0 }))
    .max(
      100,
      g("form_errors.max", { field: t("form.vat_rate.label"), max: 100 })
    ),
  vat_exempt: z.boolean(),
  tax_id: z
    .string()
    .min(3, g("form_errors.min", { field: t("form.tax_id.label"), min: 3 }))
    .max(
      255,
      g("form_errors.max", { field: t("form.tax_id.label"), max: 255 })
    ),
});

type Schema = z.infer<typeof schema>;

const state = reactive<Schema>({
  bank_account_name: "",
  bank_account_number: "",
  bank_account_iban: "",
  bank_account_bic: "",
  vat_rate: 19, // Default VAT rate, can be adjusted
  vat_exempt: false,
  tax_id: "",
});

const { data, status, refresh } = await useAsyncData(
  `organization/${props.organizationId}/billing-settings`,
  async () => {
    return await organizationsStore.getOrganizationBillingSettings(
      props.organizationId
    );
  },
  {
    watch: [() => props.organizationId],
    immediate: true,
  }
);

if (status.value === "success" && data.value) {
  Object.assign(state, data.value);
}

async function saveSettings() {
  try {
    isSaving.value = true;
    if (data.value) {
      // Update existing settings
      await organizationsStore.updateBillingSettings({
        bank_account_name: state.bank_account_name,
        bank_account_number: state.bank_account_number,
        bank_account_iban: state.bank_account_iban,
        bank_account_bic: state.bank_account_bic,
        vat_rate: state.vat_rate,
        vat_exempt: state.vat_exempt,
        tax_id: state.tax_id,
      });
    } else {
      // Create new settings
      await organizationsStore.createBillingSettings({
        bank_account_name: state.bank_account_name,
        bank_account_number: state.bank_account_number,
        bank_account_iban: state.bank_account_iban,
        bank_account_bic: state.bank_account_bic,
        vat_rate: state.vat_rate,
        vat_exempt: state.vat_exempt,
        template_name: "default",
        tax_id: state.tax_id,
        invoice_title: t("default_invoice_title"),
        invoice_subtitle: t("default_invoice_subtitle"),
        invoice_message: t("default_invoice_message"),
        invoice_footer: t("default_invoice_footer"),
      });
    }

    toast.add({
      title: t("form.save_success.title"),
      description: t("form.save_success.description"),
      color: "green",
    });
  } catch (error) {
    toast.add({
      title: t("form.save_error.title"),
      description: t("form.save_error.description"),
      color: "red",
    });
    console.error("An error occurred while saving billing settings:", error);
    isSaving.value = false;
  } finally {
    await refresh();
    isSaving.value = false;
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "billing_settings_not_configured": "Rechnungseinstellungen nicht konfiguriert",
    "billing_settings_not_configured_description": "Diese Informationen werden auf alle Rechnungen angewendet, die Sie erstellen.",
    "default_invoice_title": "Rechnung",
    "default_invoice_subtitle": "Rechnung für die Fahrausbildung",
    "default_invoice_message": "Vielen Dank für Ihren Auftrag",
    "default_invoice_footer": "Diese Rechnung wurde elektronisch erstellt und ist ohne Unterschrift gültig.",
    "form": {
      "save": "Speichern",
      "template": {
        "customize": "Rechnung Layout anpassen"
      },
      "save_success": {
        "title": "Einstellungen gespeichert",
        "description": "Ihre Abrechnungseinstellungen wurden erfolgreich gespeichert."
      },
      "save_error": {
        "title": "Fehler beim Speichern",
        "description": "Es gab einen Fehler beim Speichern Ihrer Abrechnungseinstellungen. Bitte versuchen Sie es später erneut."
      },
      "bank_account_name": {
        "label": "Kontoinhaber",
        "placeholder": "Max Mustermann",
        "description": "Der Name des Kontoinhabers für die Rechnungsstellung."
      },
      "bank_account_number": {
        "label": "Kontonummer",
        "placeholder": "DE89370400440532013000",
        "description": "Die Kontonummer für die Rechnungsstellung."
      },
      "bank_account_iban": {
        "label": "IBAN",
        "placeholder": "DE89370400440532013000",
        "description": "Die IBAN für die Rechnungsstellung."
      },
      "bank_account_bic": {
        "label": "BIC",
        "placeholder": "COBADEFFXXX",
        "description": "Der BIC für die Rechnungsstellung."
      },
      "vat_rate": {
        "label": "Mehrwertsteuersatz",
        "placeholder": "19",
        "description": "Der Mehrwertsteuersatz in Prozent."
      },
      "vat_exempt": {
        "label": "Mehrwertsteuerbefreit",
        "description": "Ist Ihr Unternehmen von der Mehrwertsteuer befreit? Bitte ankreuzen wenn Sie Gemaß § 19 UStG von der Umsatzsteuer befreit sind."
      },
      "tax_id": {
        "label": "Steuer-Nummer",
        "placeholder": "123/456/78901",
        "description": "Die Steuer-Nummer Ihres Unternehmens."
      }
    }
  },
  "en": {
    "billing_settings_not_configured": "Billing Settings Not Configured",
    "billing_settings_not_configured_description": "These details will apply to all invoices you create.",
    "default_invoice_title": "Invoice",
    "default_invoice_subtitle": "Invoice for Driving Lessons",
    "default_invoice_message": "Thank you for your business",
    "default_invoice_footer": "This invoice was generated electronically and is valid without a signature.",
    "form": {
      "save": "Save",
      "template": {
        "customize": "Customize Invoice Layout"
      },
      "save_success": {
        "title": "Settings Saved",
        "description": "Your billing settings have been successfully saved."
      },
      "save_error": {
        "title": "Error Saving",
        "description": "There was an error saving your billing settings. Please try again later."
      },
      "bank_account_name": {
        "label": "Account Holder",
        "placeholder": "Max Mustermann",
        "description": "The name of the account holder for billing."
      },
      "bank_account_number": {
        "label": "Account Number",
        "placeholder": "DE89370400440532013000",
        "description": "The account number for billing."
      },
      "bank_account_iban": {
        "label": "IBAN",
        "placeholder": "DE89370400440532013000",
        "description": "The IBAN for billing."
      },
      "bank_account_bic": {
        "label": "BIC",
        "placeholder": "COBADEFFXXX",
        "description": "The BIC for billing."
      },
      "vat_rate": {
        "label": "VAT Rate",
        "placeholder": "19",
        "description": "The VAT rate in percent."
      },
      "vat_exempt": {
        "label": "VAT Exempt",
        "description": "Is your business VAT exempt?"
      },
      "tax_id": {
        "label": "Tax ID",
        "placeholder": "123/456/78901",
        "description": "Your business's tax ID."
      }
    }
  }
}
</i18n>
