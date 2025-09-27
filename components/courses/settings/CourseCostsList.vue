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
    <div v-if="courseCostsStore.courseCosts.length > 0" class="space-y-4">
      <UiCardsBodyCollapseCard
      v-for="field in courseCostsStore.courseCosts"
      :key="field.id"
      >
        <template #header>
          <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
            <div class="flex flex-col gap-1 grow">
              <p class="font-semibold">{{ field.name }}</p>
              <span class="text-sm text-gray-500">{{ field.description }}</span>
            </div>
            <UButton
              color="gray"
              variant="solid"
              @click.stop="openEditCourseCostForm(field.id)"
              >{{ t("edit") }}</UButton
            >
            <UButton
              color="red"
              variant="soft"
              :icon="'i-heroicons-trash'"
              @click.stop="courseCostsStore.deleteCourseCost(field.id)"
            />
          </div>
        </template>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="flex flex-col gap-4">
            <!-- Additional content can go here -->
            dasd
          </div>
        </div>
      </UiCardsBodyCollapseCard>
    </div>
    <UAlert
      v-else
      :title="t('no_course_costs')"
      :description="t('no_course_costs_description')"
      :actions="[
        {
          label: t('add_course_cost'),
          color: 'black',
          icon: 'i-heroicons-plus-circle',
          variant: 'solid',
          size: 'sm',
          click: () => {},
        },
        {
          label: t('add_course_cost_from_template'),
          color: 'white',
          icon: 'i-heroicons-sparkles',
          variant: 'outline',
          size: 'sm',
          click: () => {
            createCourseCostsFromTemplate();
          },
        },
      ]"
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

const courseCostsStore = useCourseCostsStore();

const openEditCourseCostForm = (id?: string) => {
  slideover.open(EditCourseCostForm, {
    courseCostId: id,
    "onCost-saved": () => {
      slideover.close();
      toast.add({
        title: t("cost_saved"),
        description: t("cost_saved_description"),
        color: "green",
      });
    },
    "onCost-deleted": () => {
      slideover.close();
      toast.add({
        title: t("cost_deleted"),
        description: t("cost_deleted_description"),
        color: "green",
      });
    },
  });
};

const createCourseCostsFromTemplate = async () => {
  try {
    await courseCostsStore.createCourseCostsFromTemplate();
    toast.add({
      title: t("costs_created"),
      description: t("costs_created_description"),
      color: "green",
    });
  } catch (error) {
    console.error("Error creating costs from template:", error);
    toast.add({
      title: t("error_creating_costs"),
      description: t("error_creating_costs_description"),
      color: "red",
    });
  }
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
    "cost_created": "Kosten erstellt",
    "cost_created_description": "Die Kosten wurden erfolgreich erstellt.",
    "error_creating_costs": "Fehler beim Erstellen der Kosten",
    "error_creating_costs_description": "Beim Erstellen der Kosten ist ein Fehler aufgetreten.",
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
    "costs_created": "Costs created",
    "costs_created_description": "The costs have been created successfully.",
    "error_creating_costs": "Error creating costs",
    "error_creating_costs_description": "There was an error creating the costs.",
    "cost_deleted": "Cost deleted",
    "cost_deleted_description": "The cost has been deleted successfully."
  }
}
</i18n>
