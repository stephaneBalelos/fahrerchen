<template>
  <div v-if="courseCosts && courseCosts.length > 0 && status === 'success'" class="space-y-4">
    <CourseCostCard
      v-for="cost in courseCosts"
      :key="cost.id"
      :cost="cost"
      class="w-full"
      @edit="openEditCourseCostForm"
      @delete="deleteCourseCost"
    />
    <div class="flex justify-center">
      <div class="mt-4">
        <UButton
          color="black"
          variant="solid"
          :icon="'i-heroicons-plus-circle'"
          @click="openEditCourseCostForm"
        >
          {{ t("add_course_cost") }}
        </UButton>
      </div>
    </div>
  </div>
  <div v-else-if="status === 'pending'" class="space-y-4">
    <USkeleton v-for="n in 3" :key="n"  class="h-24 w-full"/>
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
        click: () => {
          openEditCourseCostForm();
        },
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
</template>

<script setup lang="ts">
import CourseCostCard from "~/components/courses/CourseCostCard.vue";
import EditCourseCostForm from "~/components/forms/EditCourseCostForm.vue";

type Props = {
  orgId: string;
};

const props = defineProps<Props>();

const toast = useToast();
const { t } = useI18n({
  useScope: "local",
});

const courseCostsStore = useCourseCostsStore();
const slideover = useSlideover();

const { data: courseCosts, refresh, status } = await useAsyncData(
  `course_costs_for_organization_${props.orgId}`,
  async () => await courseCostsStore.getCourseCosts(props.orgId)
);

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
  } finally {
    refresh();
  }
};

const openEditCourseCostForm = (id?: string) => {
  slideover.open(EditCourseCostForm, {
    organizationId: props.orgId,
    courseCostId: id,
    "onCost-saved": () => {
      slideover.close();
      refresh();
    },
    "onCost-created": () => {
      slideover.close();
      refresh();
    },
    "onVnodeUnmounted": () => {
      refresh();
    },
  });
};

const deleteCourseCost = async (id: string) => {
  try {
    await courseCostsStore.deleteCourseCost(id);
    toast.add({
      title: t("cost_deleted"),
      description: t("cost_deleted_description"),
      color: "green",
    });
    refresh();
  } catch (error) {
    console.error("Error deleting cost:", error);
    toast.add({
      title: t("error_deleting_cost"),
      description: t("error_deleting_cost_description"),
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
    "add_course_cost": "Kosten hinzufügen",
    "add_course_cost_from_template": "Kosten aus Vorlage hinzufügen",
    "no_course_costs": "Keine Kurskosten",
    "no_course_costs_description": "Es gibt keine Kurskosten für diesen Kurs.",
    "cost_saved": "Kosten gespeichert",
    "cost_saved_description": "Die Kosten wurden erfolgreich gespeichert.",
    "cost_created": "Kosten erstellt",
    "cost_created_description": "Die Kosten wurden erfolgreich erstellt.",
    "error_creating_costs": "Fehler beim Erstellen der Kosten",
    "error_creating_costs_description": "Beim Erstellen der Kosten ist ein Fehler aufgetreten.",
    "cost_deleted": "Kosten gelöscht",
    "cost_deleted_description": "Die Kosten wurden erfolgreich gelöscht.",
    "costs_created": "Kosten erstellt",
    "costs_created_description": "Die Kosten wurden erfolgreich aus der Vorlage erstellt."
  },
  "en": {
    "edit": "Edit",
    "course_costs": "Course Costs",
    "set_course_costs": "Set the course costs",
    "add_cost": "Add cost",
    "add_course_cost": "Add course cost",
    "add_course_cost_from_template": "Add course cost from template",
    "no_course_costs": "No course costs",
    "no_course_costs_description": "There are no course costs for this course.",
    "cost_saved": "Cost saved",
    "cost_saved_description": "The cost has been saved successfully.",
    "error_creating_costs": "Error creating costs",
    "error_creating_costs_description": "There was an error creating the costs.",
    "cost_deleted": "Cost deleted",
    "cost_deleted_description": "The cost has been deleted successfully.",
    "costs_created": "Costs created",
    "costs_created_description": "The costs have been created successfully."
  }
}
</i18n>
