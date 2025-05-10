<template>
  <UDashboardSlideover :title="state.name">
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
      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">
        {{ t("save") }}
      </UButton>
      <UButton v-if="props.id && courseCost" variant="ghost" color="red" @click="deleteCourseCost">
        {{ t("delete") }}
      </UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseCost } from "~/types/app.types";
import type { Form } from "#ui/types";

type CourseCostEdit = Omit<
  AppCourseCost,
  "id" | "course_id" | "organization_id"
>;

type Props = {
  id?: string;
  courseid: string;
  orgid: string;
};
type Emits = {
  (event: "cost-saved" | "cost-deleted", payload?: AppCourseCost): void;
};
const props = defineProps<Props>();
const { t } = useI18n({
  useScope: "local",
});
const $emits = defineEmits<Emits>();
const form = ref<Form<CourseCostEdit> | null>(null);

const state = reactive<CourseCostEdit>({
  name: "",
  description: "",
  price: 0,
});

const { data: courseCost } = await useAsyncData(
  `course_cost_${props.id}`,
  async () => {
    if (!props.id) {
      return null;
    }

    const { data, error } = await useSupabaseClient()
      .from("course_costs")
      .select("*")
      .eq("id", props.id)
      .single();

    if (error) {
      console.error(error);
      throw error;
    }
    if (data) {
      state.name = data.name;
      state.description = data.description;
      state.price = data.price;
    }
    return data;
  }
);

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
  if (props.id && courseCost.value) {
    const { data, error } = await useSupabaseClient()
      .from("course_costs")
      .update({
        name: state.name,
        description: state.description,
        price: state.price,
      })
      .eq("id", courseCost.value.id)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      throw error;
    }
    if (data) {
      $emits("cost-saved", data);
    }
  } else {
    await createCourseCost();
  }
}

async function createCourseCost() {
  const { data, error } = await useSupabaseClient()
    .from("course_costs")
    .insert({
      name: state.name,
      description: state.description,
      price: state.price,
      course_id: props.courseid,
      organization_id: props.orgid,
    })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw error;
  }
  if (data) {
    $emits("cost-saved", data);
  }
}

async function deleteCourseCost() {
  if (!props.id) return;

  const { error } = await useSupabaseClient()
    .from("course_costs")
    .delete()
    .eq("id", props.id);

  if (error) {
    console.error(error);
    throw error;
  }
  $emits("cost-deleted");
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
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
    "delete": "Löschen"
  },
  "en": {
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
    "delete": "Delete"
  }
}
</i18n>
