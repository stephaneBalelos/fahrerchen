<template>
  <UDashboardSlideover>
    <template #title>
      <p v-if="state.name" class="text-lg font-bold">{{ state.name }}</p>
      <p v-else class="text-lg font-bold text-gray-400 dark:text-gray-400">
        {{ t("new_course_cost") }}
      </p>
    </template>
    <UForm
      ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="saveCourseCost"
    >
      <UDashboardSection
        :title="t('course_cost')"
        :description="t('course_cost_description')"
      >
        <UFormGroup
          name="name"
          :label="t('form.name.label')"
          :description="t('form.name.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="on" size="md" />
        </UFormGroup>

        <UFormGroup
          name="description"
          :label="t('form.description.label')"
          :description="t('form.description.description')"
          class="grid gap-2"
          :ui="{ container: '' }"
        >
          <UTextarea
            v-model="state.description"
            :rows="5"
            autoresize
            size="md"
          />
        </UFormGroup>

        <UFormGroup
          name="price"
          :label="t('form.price.label')"
          :description="t('form.price.description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput
            v-model="state.price"
            type="number"
            :min="0"
            :step="0.01"
            size="md"
            :placeholder="t('form.price.placeholder')"
          />
        </UFormGroup>

        <UFormGroup
          v-if="props.organizationId && props.courseCostId"
          :label="t('form.classes_settings')"
          :description="t('form.classes_settings_desc')"
          :ui="{ container: '' }"
        >
          <div class="py-6">
            <CourseCostCombinationSettings
              :organization-id="props.organizationId"
              :cost-id="props.courseCostId"
            />
          </div>
        </UFormGroup>
      </UDashboardSection>
    </UForm>

    <template #footer>
      <div class="flex gap-4">
        <UButton @click="form?.submit()">
          {{ t("save") }}
        </UButton>
        <UButton color="gray" variant="ghost" @click="slideover.close()">
          {{ t("cancel") }}
        </UButton>
      </div>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseCost, CourseCostEdit } from "~/types/app.types";
import type { Form } from "#ui/types";
import CourseCostCombinationSettings from "../courses/settings/CourseCostCombinationSettings.vue";

type Props = {
  organizationId: string;
  courseCostId?: string;
};
type Emits = {
  (event: "cost-saved" | "cost-deleted" | "cost-created", payload?: AppCourseCost): void;
  
};

const slideover = useSlideover();

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});
const $emits = defineEmits<Emits>();
const form = ref<Form<CourseCostEdit> | null>(null);

const courseCostsStore = useCourseCostsStore();

const state = reactive<CourseCostEdit>({
  name: "",
  description: "",
  price: 0,
});

onMounted(async () => {
  if (props.courseCostId) {
    try {
      const data = await courseCostsStore.getCourseCost(props.courseCostId);

      if (!data) {
        throw new Error("Course cost not found");
      }
      state.name = data.name;
      state.description = data.description;
      state.price = data.price;
    } catch (error) {
      console.error("Error loading course cost:", error);
      // Handle error, e.g., show a notification
    }
  }
});
onUnmounted(() => {
  slideover.reset();
});

const validate = (state: CourseCostEdit) => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter a name" });
  if (!state.description)
    errors.push({ path: "description", message: "Please enter a description" });
  if (state.price <= 0)
    errors.push({ path: "price", message: "Please enter a price" });
  return errors;
};

async function saveCourseCost() {
  if (props.courseCostId) {
    await updateCourseCost(state);
  } else {
    await createCourseCost(state);
  }
}

async function updateCourseCost(state: CourseCostEdit) {
  if (!props.courseCostId) return;

  try {
    await courseCostsStore.updateCourseCost(props.courseCostId, {
      name: state.name,
      description: state.description,
      price: state.price,
    });
    $emits("cost-saved");
  } catch (error) {
    console.error("Error updating course cost:", error);
    // Handle error, e.g., show a notification
  }
}

async function createCourseCost(state: CourseCostEdit) {
  try {
    const newCourseCost = await courseCostsStore.createCourseCost({
      name: state.name,
      description: state.description,
      price: state.price,
    });
    if (!newCourseCost) {
      throw new Error("Failed to create course cost");
    }
    $emits("cost-created");
  } catch (error) {
    console.error("Error creating course cost:", error);
    // Handle error, e.g., show a notification
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "new_course_cost": "Neue Kurskosten",
    "course_cost": "Kurskosten",
    "course_cost_description": "Hier können Sie die Kurskosten bearbeiten.",
    "form.name.label": "Name",
    "form.name.description": "Geben Sie den Namen des Kurses ein.",
    "form.description.label": "Beschreibung",
    "form.description.description": "Geben Sie eine Beschreibung des Kurses ein.",
    "form.price.label": "Preis",
    "form.price.description": "Geben Sie den Preis des Kurses ein.",
    "form.price.placeholder": "0.00",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "form.classes_settings": "Ausbildungsklassen",
    "form.classes_settings_desc": "Wählen Sie die Ausbildungsklassen, die diese Kurskosten enthalten sollen. Sie können auch spezifische Preise für jede Klasse festlegen."
  },
  "en": {
    "new_course_cost": "New Course Cost",
    "course_cost": "Course Cost",
    "course_cost_description": "Edit the course cost here.",
    "form.name.label": "Name",
    "form.name.description": "Enter the name of the course.",
    "form.description.label": "Description",
    "form.description.description": "Enter a description of the course.",
    "form.price.label": "Price",
    "form.price.description": "Enter the price of the course.",
    "form.price.placeholder": "0.00",
    "save": "Save",
    "cancel": "Cancel",
    "form.classes_settings": "Class Settings",
    "form.classes_settings_desc": "Select the training classes that should include these course costs. You can also set specific prices for each class."
  }
}
</i18n>
