<template>
  <UDashboardModal
    :title="t('create_course_from_template')"
    :description="t('create_course_from_template_description')"
    :ui="{ width: 'sm:max-w-md', height: 'h-auto' }"
  >
    <UForm
      id="create-course-from-template-form"
      :validate-on="['submit']"
      :state="state"
      class="space-y-2"
      @submit="onSubmit"
    >
      <UFormGroup
        name="type"
        :label="t('form.type.label')"
        :description="t('form.type.description')"
        required
        class="grid grid-cols-1 gap-4 items-center"
        :ui="{ container: '' }"
      >
        <USelectMenu
          v-model="state.type"
          :options="COURSE_TYPES"
          :placeholder="t('form.type.placeholder')"
          :leading-icon="COURSE_ICONS[state.type]"
          :ui="{ wrapper: 'app-select' }"
          :ui-menu="{
            container: 'app-select-menu',
            option: { base: 'app-select-menu-option' },
          }"
        >
          <template #option="{ option }">
            <span class="truncate">{{ option }}</span>
          </template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup v-if="state.type" :ui="{ container: '' }">
        <UAlert
          :title="state.type"
          :description="g(`course_types.${state.type}.description`)"
          color="primary"
          variant="subtle"
        >
          <template #title="{ title }">
            <span class="text-lg"
              >{{ t("driver_license_class") }} {{ title }}</span
            >
          </template>
        </UAlert>
      </UFormGroup>

      <div class="py-4">
        <div class="flex justify-end gap-3">
          <UButton
            :label="t('cancel')"
            color="gray"
            variant="ghost"
            @click="$emit('close')"
          />
          <UButton
            type="submit"
            :label="t('create_course')"
            :loading="loading"
            :disabled="loading"
            color="black"
          />
        </div>
      </div>
    </UForm>
  </UDashboardModal>
</template>

<script setup lang="ts">
import {
  COURSE_TYPES,
  COURSE_ICONS,
  getStandardCourseTemplate,
  type StandardCourseTemplate,
} from "~/constants";
import type { AppCourseType } from "~/types/app.types";

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const coursesStore = useCoursesStore();

const loading = ref(false);
const $emit = defineEmits(["close", "course-created"]);

const state = reactive({
  type: "AM" as AppCourseType,
});

const onSubmit = async () => {
  loading.value = true;
  const template = getStandardCourseTemplate(state.type);
  createCourseFromTemplate(template).finally(() => {
    loading.value = false;
  });
};

const createCourseFromTemplate = async (template: StandardCourseTemplate) => {
  try {
    const newCourseId = await coursesStore.createCourse({
      name: template.name,
      type: template.type,
      description: template.description,
    });
    console.log("New course created with ID:", newCourseId);
    if (!newCourseId) {
      throw new Error("Failed to create course");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "form": {
        "type": {
            "label": "Kurstyp",
            "description": "Wählen Sie den Kurstyp, den Sie erstellen möchten.",
            "placeholder": "Wählen Sie einen Kurstyp"
        }
    },
    "create_course_from_template": "Kurs aus Vorlage erstellen",
    "create_course_from_template_description": "Erstellen Sie einen neuen Kurs basierend auf einer vordefinierten Vorlage.",
    "cancel": "Abbrechen",
    "create_course": "Kurs erstellen"
  },
  "en": {
    "form": {
        "type": {
            "label": "Course Type",
            "description": "Select the type of course you want to create.",
            "placeholder": "Select a course type"
        }
    },
    "create_course_from_template": "Create Course from Template",
    "create_course_from_template_description": "Create a new course based on a predefined template.",
    "cancel": "Cancel",
    "create_course": "Create Course"
  }
}
</i18n>
