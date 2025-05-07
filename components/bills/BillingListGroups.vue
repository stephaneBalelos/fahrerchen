<template>
  <UCard
    v-for="(group, idx) in groups"
    :key="group.activityType"
    :ui="{
      header: {
        padding: 'py-2 px-2 sm:p-4',
      },
      body: {
        padding: 'py-0 px-2 sm:p-2',
      },
    }"
  >
    <template #header>
      <div class="flex gap-8 items-center justify-between">
        <div class="flex flex-col flex-1">
          <p class="font-semibold">
            {{ t(`activity_types.${group.activityType}.name`) }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t(`activity_types.${group.activityType}.description`) }}
          </p>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm text-gray-500">{{ t("amount") }}</span>
          <span class="text-lg font-bold">{{ group.items.length }}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm text-gray-500">{{ t("price") }}</span>
          <span class="text-lg font-bold">{{
            formatCurrency(
              group.items
                .map((i) => i.item_price)
                .reduce((acc, curr) => acc + curr, 0)
            )
          }}</span>
        </div>
      </div>
    </template>
    <div
      ref="itemRefs"
      class="collapsible max-h-0 overflow-hidden transition-all duration-700 ease-in-out px-2"
    >
      <BillsBillItemDetails
        v-for="(billItem, index) in group.items"
        :key="index"
        :bill-item="billItem"
      />
    </div>
    <div class="flex justify-center">
      <UButton
        icon="i-heroicons-chevron-down-solid"
        size="2xs"
        color="primary"
        variant="ghost"
        trailing
        @click="toggleCollapsible(idx)"
        >{{ t("show_details") }}</UButton
      >
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { CourseSubscriptionBillItemView } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";

type Props = {
  billItems: CourseSubscriptionBillItemView[];
};

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});

const activityTypes = await useCourseActivityTypes();

const groups = computed(() => {
  const grouped = props.billItems.reduce((acc, item) => {
    const activityType = activityTypes.find(
      (type) => type.id === item.activity_type
    );
    const activityTypeName = activityType ? activityType.type : "OTHER";
    if (!acc[activityTypeName]) {
      acc[activityTypeName] = [];
    }
    acc[activityTypeName].push(item);
    return acc;
  }, {} as Record<string, CourseSubscriptionBillItemView[]>);

  return Object.entries(grouped).map(([key, items]) => ({
    activityType: key,
    items,
  }));
});

const itemRefs = ref([] as HTMLDivElement[]);

onMounted(() => console.log(itemRefs.value));

const toggleCollapsible = (index: number) => {
  const group = itemRefs.value[index];
  if (!group) return;

  if (group) {
    group.classList.toggle("max-h-0");
    group.classList.toggle("max-h-screen");
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "amount": "Anzahl",
    "price": "Preis",
    "show_details": "Details anzeigen",
    "activity_types": {
      "THEORY": {
        "name": "Theorie",
        "description": "Theoretische Ausbildung"
      },
      "PRACTICE": {
        "name": "Praxis",
        "description": "Praktische Ausbildung"
      },
      "EXAM": {
        "name": "Prüfungen",
        "description": "Vorstellung Gebühren und Prüfungsgebühren"
      },
      "OTHER": {
        "name": "Sonstiges",
        "description": "Sonstige Ausbildung"
      }
    }
  },
  "en": {
    "amount": "Amount",
    "price": "Price",
    "show_details": "Show details",
    "activity_types": {
      "THEORY": {
        "name": "Theory",
        "description": "Theoretical training"
      },
      "PRACTICE": {
        "name": "Practice",
        "description": "Practical training"
      },
      "EXAM": {
        "name": "Exams",
        "description": "Presentation fees and exam fees"
      },
      "OTHER": {
        "name": "Other",
        "description": "Other training "
      }
    }
  }
}
</i18n>
