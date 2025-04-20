<template>
  <UCard 
    v-for="group in groups" :key="group.activityType"
    :ui="{
        header: {
            padding: 'py-2 px-2 sm:p-4',
        },
      body: {
        padding: 'py-2 px-2 sm:p-4',
      },
    }"
  >
    <template #header>
      <div class="flex gap-8 items-center justify-between">
        <div class="flex flex-col flex-1">
          <p class="font-semibold">{{ t(`activity_types.${group.activityType}.name`) }}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t(`activity_types.${group.activityType}.description`) }}</p>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm text-gray-500">{{ t("amount") }}</span>
          <span class="text-lg font-bold">{{ group.items.length }}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-sm text-gray-500">{{ t("price") }}</span>
          <span class="text-lg font-bold">{{ formatCurrency(group.items.map((i) => i.item_price).reduce((acc, curr) => acc + curr, 0)) }}</span>
        </div>
      </div>
    </template>
    <div>
        <BillsBillItemDetails 
          v-for="billItem, index in group.items" 
          :key="index" 
          :bill-item="billItem"
        />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { CourseSubscriptionBillItemView } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";

type Props = {
  billItems: CourseSubscriptionBillItemView[]
}

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});

const activityTypes = await useCourseActivityTypes()

const groups = computed(() => {
  const grouped = props.billItems.reduce((acc, item) => {
    const activityType = activityTypes.find((type) => type.id === item.activity_type);
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


</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "amount": "Anzahl",
    "price": "Preis",
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