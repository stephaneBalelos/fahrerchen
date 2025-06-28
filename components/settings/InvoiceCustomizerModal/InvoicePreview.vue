<template>
  <div class="col-span-3 overflow-y-auto h-full">
    <iframe
      class="w-full mx-auto"
      style="aspect-ratio: 1 / 1.4142; max-width: 800px"
      :srcdoc="renderedTemplate"
      frameborder="0"
      sandbox="allow-scripts"
    />
  </div>
</template>

<script setup lang="ts">
import type { BillTemplateData } from "~/types/app.types";
import Handlebars from "handlebars";
import { format } from "date-fns";

type Props = {
  state: BillTemplateData;
  selectedExamapleIndex: number;
  templateName?: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const template = ref<string | null>(null);

const renderedTemplate = computed(() => {
  if (!template.value) return "";

  // Compile the template with Handlebars
  const compiledTemplate = Handlebars.compile(template.value);

  const s = props.state;
  // Prepare the state for rendering
  const exampleBill = billExamples.value[props.selectedExamapleIndex];
  if (exampleBill) {
    s.bill_date = exampleBill.bill_date;
    s.bill_number = exampleBill.bill_number;
    s.bill_total = exampleBill.total.toFixed(2);
    s.bill_vat_rate = exampleBill.vat_rate.toFixed(2);
    s.bill_vat_amount = exampleBill.vat_amount.toFixed(2);
    s.bill_total_with_vat = (
      exampleBill.total + exampleBill.vat_amount
    ).toFixed(2);
    s.bill_items = exampleBill.bill_items;
  } else {
    console.warn(
      "No example bill found for index:",
      props.selectedExamapleIndex
    );
  }

  // Render the template with the current state
  return compiledTemplate(s);
});


async function loadTemplate(name: string = "default") {
  try {
    const html = await $fetch<string>(
      `/api/orgs/settings/load-invoice-template?template=${name}`, // Adjust the template name as needed
      {
        method: "GET",
      }
    );

    template.value = html;
  } catch (error) {
    console.error("Error loading template:", error);
  }
}

watch(
  () => props.templateName,
  (newTemplateName) => {
    if (newTemplateName) {
      loadTemplate(newTemplateName);
    }
  },
  { immediate: true }
);

const billExamples = ref([
  {
    bill_date: format(new Date(), "dd.MM.yyyy"),
    bill_number: "RE-123456",
    total: 100.0,
    vat_rate: 19.0,
    vat_amount: 19.0,
    bill_items: [
      {
        title: t("example_bill_items.base_costs.title"),
        description: t("example_bill_items.base_costs.description"),
        date: format(new Date(), "dd.MM.yyyy"),
        total: "100.0",
      },
      {
        title: t("example_bill_items.learning_materials.title"),
        description: t("example_bill_items.learning_materials.description"),
        date: format(new Date(), "dd.MM.yyyy"),
        total: "30.0",
      },
      {
        title: t("example_bill_items.theory.title"),
        description: t("example_bill_items.theory.description"),
        date: format(new Date(), "dd.MM.yyyy"),
        total: "50.0",
      },
      {
        title: t("example_bill_items.theory.title"),
        description: t("example_bill_items.theory.description"),
        date: format(new Date(), "dd.MM.yyyy"),
        total: "50.0",
      },
      {
        title: t("example_bill_items.practice.title"),
        description: t("example_bill_items.practice.description"),
        date: format(new Date(), "dd.MM.yyyy"),
        total: "55.0",
      },
    ],
  },
]);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
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
    }
  },
  "en": {
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
    }
  }
}
</i18n>

