<template>
  <UDashboardSection
    :title="t('course_costs')"
    :description="t('set_course_costs')"
    orientation="horizontal"
    class="px-4 py-6"
  >
    <template #links>
      <UButton
        color="primary"
        icon="i-heroicons-plus"
        variant="soft"
        size="2xs"
        @click="openEditCourseCostForm('')"
        >{{ t("add_cost") }}</UButton
      >
    </template>
    <UCard
      v-if="course_costs && course_costs.length > 0"
      :ui="{
        body: {
          base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
        },
      }"
    >
      <div
        v-for="field in course_costs"
        :key="field.id"
        class="flex items-center justify-between pt-4 first:pt-0 gap-2"
      >
        <div class="flex flex-col gap-1 grow">
          <p class="font-semibold">{{ field.name }}</p>
          <div class="flex justify-start gap-1">
            <UBadge color="primary" variant="subtle" size="xs"
              >{{ field.price }} &euro;</UBadge
            >
          </div>
          <span class="text-sm text-gray-500">{{ field.description }}</span>
        </div>
        <UButton
          color="gray"
          variant="solid"
          @click="openEditCourseCostForm(field.id)"
          >{{ t("edit") }}</UButton
        >
      </div>
    </UCard>
    <UAlert
      v-else
      :title="t('no_course_costs')"
      :description="t('no_course_costs_description')"
    />
  </UDashboardSection>
</template>

<script setup lang="ts">
import EditCourseCostForm from "~/components/forms/EditCourseCostForm.vue";

const slideover = useSlideover();
const toast = useToast();
const { t } = useI18n({
  useScope: "local",
});
const coursesStore = useCoursesStore();

const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const {
  data: course_costs,
  refresh,
} = await useAsyncData(`course_costs_${props.courseid}`, async () => {
  return await coursesStore.getCourseCosts(props.courseid);
}, { immediate: true });

const openEditCourseCostForm = (id?: string) => {
  slideover.open(EditCourseCostForm, {
    id: id,
    courseid: props.courseid,
    orgid: props.orgid,

    "onCost-saved": () => {
      slideover.close();
      refresh();
      toast.add({
        title: t("cost_saved"),
        description: t("cost_saved_description"),
        color: "green",
      });
    },
    "onCost-deleted": () => {
      slideover.close();
      refresh();
      toast.add({
        title: t("cost_deleted"),
        description: t("cost_deleted_description"),
        color: "green",
      });
    },
  });
};
</script>

<style scoped></style>

<i18n lang="json">
{ 
    "de": {
        "edit": "Bearbeiten",
        "course_costs": "Kurskosten",
        "set_course_costs": "Setzen Sie die Kurskosten",
        "add_cost": "Kosten hinzufügen",
        "no_course_costs": "Keine Kurskosten",
        "no_course_costs_description": "Es gibt keine Kurskosten für diesen Kurs.",
        "cost_saved": "Kosten gespeichert",
        "cost_saved_description": "Die Kosten wurden erfolgreich gespeichert.",
        "cost_deleted": "Kosten gelöscht",
        "cost_deleted_description": "Die Kosten wurden erfolgreich gelöscht."
    },
    "en": {
        "edit": "Edit",
        "course_costs": "Course Costs",
        "set_course_costs": "Set the course costs",
        "add_cost": "Add cost",
        "no_course_costs": "No course costs",
        "no_course_costs_description": "There are no course costs for this course.",
        "cost_saved": "Cost saved",
        "cost_saved_description": "The cost has been saved successfully.",
        "cost_deleted": "Cost deleted",
        "cost_deleted_description": "The cost has been deleted successfully."
    }
}
</i18n>
