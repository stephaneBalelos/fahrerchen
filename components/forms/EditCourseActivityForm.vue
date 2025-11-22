<template>
  <UDashboardSlideover :title="state.name">
    <UForm
      ref="form"
      :state="state"
      :validate="validate"
      :validate-on="['submit']"
      @submit="saveCourseActivity"
    >
      <UDashboardSection
        :title="t('form_section_title')"
        :description="
          props.courseActivityId
            ? t('form_section_desc')
            : t('form_section_desc_new')
        "
      >
        <UFormGroup
          name="name"
          :label="t('form.name')"
          :placeholder="t('form.name_placeholder')"
          :description="t('form.name_description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.name" autocomplete="on" size="md" />
        </UFormGroup>

        <UFormGroup
          name="description"
          :label="t('form.description')"
          :placeholder="t('form.description_placeholder')"
          :description="t('form.description_description')"
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
          name="requirement_id"
          :label="t('form.activity_type')"
          :description="t('form.activity_type_description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <USelectMenu
            v-model="state.activity_type"
            :options="ACTIVITY_TYPES.map((type) => ({ label: g('courses.activities.types.' + type), id: type }))"
            value-attribute="id"
            :leading-icon="selected_activity_type ? ACTIVITY_ICONS[selected_activity_type] : undefined"
          >
            <template #label>
              <div v-if="state.activity_type && ACTIVITY_TYPES">
                <span class="truncate">{{
                  g('courses.activities.types.' + state.activity_type)
                }}</span>
              </div>
              <div v-else>
                <span class="truncate">{{ t('form.activity_type_placeholder') }}</span>
              </div>
            </template>
            <template #option="{ option }">
              <span class="truncate">{{ option.label }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup
          name="price"
          :label="t('form.price')"
          :description="t('form.price_description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.price" type="number" autocomplete="off" size="md" />
        </UFormGroup>

        <UFormGroup
          name="required"
          :label="t('form.required_amount')"
          :description="t('form.required_amount_description')"
          required
          class="grid grid-cols-1 gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UInput v-model="state.required" type="number" autocomplete="off" size="md" />
        </UFormGroup>

        <UFormGroup
          name="allow_self_registration"
          :label="t('form.allow_self_registration')"
          :description="t('form.allow_self_registration_desc')"
          class="flex gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UToggle
            v-model="state.allow_self_registration"
            :label="t('form.allow_self_registration')"
          />
        </UFormGroup>
        <UFormGroup
          name="allow_requests"
          :label="t('form.allow_requests')"
          :description="t('form.allow_requests_desc')"
          class="flex gap-4 items-center"
          :ui="{ container: '' }"
        >
          <UToggle
            v-model="state.allow_requests"
            :label="t('form.allow_requests')"
          />
        </UFormGroup>

      </UDashboardSection>
    </UForm>

    <template #footer>
      <UButton @click="form?.submit()">Save</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourseActivity, CourseActivityEdit } from "~/types/app.types";
import type { Form, FormSubmitEvent } from "#ui/types";
import { ACTIVITY_ICONS, ACTIVITY_TYPES } from "~/constants";

type Props = {
  courseActivityId?: string;
};

type Emits = {
  (event: "activity-saved" | "activity-deleted", payload?: AppCourseActivity): void;
};

const { t } = useI18n({
  useScope: 'local'
})

const { t: g } = useI18n({
  useScope: "global",
});


const slideover = useSlideover();

const toast = useToast();

const props = defineProps<Props>();

const form = ref<Form<CourseActivityEdit> | null>(null);

const courseActivitiesStore = useCourseActivitiesStore();

const $emit = defineEmits<Emits>();

const selected_activity_type = computed(() => {
  return ACTIVITY_TYPES.find((type) => type === state.activity_type);
});


const state = reactive<CourseActivityEdit>({
  name: "",
  description: "",
  required: 0,
  activity_type: "THEORY",
  price: 0,
  allow_self_registration: false,
  allow_requests: false,
  duration_minutes: 45,
  sorting_order: 1,
});

onMounted(async () => {
  if (props.courseActivityId) {
    // load the course activity
    try {
      const data = await courseActivitiesStore.getCourseActivity(props.courseActivityId);

      if (!data) {
        throw new Error("Activity not found");
      }
        state.name = data.name;
        state.description = data.description;
        state.price = data.price;
        state.activity_type = data.activity_type
        state.required = data.required
        state.allow_self_registration = data.allow_self_registration;
        state.allow_requests = data.allow_requests;
      
    } catch (error) {
      console.log(error);
      toast.add({
        title: "Error",
        description: "An error occured while loading the activity",
        color: "red",
      });
      throw error;
    }
  }
});

onUnmounted(() => {
  slideover.reset();
});

const validate = (state: CourseActivityEdit) => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter a name" });
  if (!state.description)
    errors.push({ path: "description", message: "Please enter a description" });
  if (!(state.price >= 0))
    errors.push({ path: "price", message: "Please enter a price" });
  return errors;
};

async function saveCourseActivity(_event: FormSubmitEvent<CourseActivityEdit>) {
  if (props.courseActivityId) {
    await updateCourseActivity(state);
  } else {
    await createCourseActivity(state);
  }
}

async function updateCourseActivity(params: CourseActivityEdit) {
  if (!props.courseActivityId) return;
  try {
    await courseActivitiesStore.updateCourseActivity(props.courseActivityId, params);
    $emit("activity-saved");
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "An error occured while updating the activity",
      color: "red",
    });
  }
}
async function createCourseActivity(params: CourseActivityEdit) {
  try {
    await courseActivitiesStore.createCourseActivity(params);
    $emit("activity-saved");
  } catch (error) {
    console.log(error);
    toast.add({
      title: "Error",
      description: "An error occured while updating the activity",
      color: "red",
    });
  }
}
</script>

<style scoped></style>

<i18n lang="json">
  {
    "de": {
      "form_section_title": "Kurs Aktivität",
      "form_section_desc": "Änderungen wirken sich auf alle teilnehmenden Schüler aus. Offene Rechnungen und Quittungen werden aktualisiert.",
      "form_section_desc_new": "Kurs Aktivität erstellen",
      "form_group_name_label": "Activity Name",
      "form": {
        "name": "Aktivität Name",
        "name_placeholder": "z.B. Theorie Unterricht",
        "name_description": "Name der Aktivität. Wird auf Quittungen, Rechnungen und anderen Kommunikationen angezeigt.",
        "description": "Beschreibung",
        "description_placeholder": "Beschreiben Sie Ihren Kurs im Detail. Wie viele Stunden, was wird unterrichtet, etc.",
        "description_description": "Beschreiben Sie Ihren Kurs im Detail. Wird auf Quittungen, Rechnungen und anderen Kommunikationen angezeigt.",
        "activity_type": "Aktivitättyp",
        "activity_type_placeholder": "Äktivitättyp auswählen",
        "activity_type_description": "Wählen Sie den Aktivitättyp zwischen Theorie, Praxis, Prüfung, etc.",
        "price": "Preis",
        "price_description": "Wird auf Quittungen, Rechnungen und anderen Kommunikationen angezeigt. Geben Sie den Preis in Euro an. 0 für kostenlose Aktivitäten.",
        "is_activity_required": "Ist diese Aktivität erforderlich, um den Kurs abzuschließen?",
        "required_amount": "Anzahl der erforderlichen Teilnahmen",
        "required_amount_description": "Geben Sie die Anzahl der erforderlichen Teilnahmen an, um die Aktivität abzuschließen.",
        "allow_self_registration": "Erlaube Selbstregistrierung",
        "allow_self_registration_desc": "Wenn aktiviert, können sich Schüler selbst für diese Aktivität registrieren.",
        "allow_requests": "Erlaube Anfragen",
        "allow_requests_desc": "Wenn aktiviert, können Schüler Anfragen für diese Aktivität stellen."
      }
    },
    "en": {
      "form_section_title": "Course Activity",
      "form_section_desc": "Make changes that will affect all participating students. Open invoices and receipts will be updated.",
      "form_section_desc_new": "Create Course Activity",
      "form_group_name_label": "Activity Name",
      "form": {
        "name": "Activity Name",
        "name_placeholder": "e.g. Theory Class",
        "name_description": "Name of the activity. Will be displayed on receipts, invoices, and other communications.",
        "description": "Description",
        "description_placeholder": "Describe your course in detail. How many hours, what is taught, etc.",
        "description_description": "Describe your course in detail. Will be displayed on receipts, invoices, and other communications.",
        "activity_type": "Activity Type",
        "activity_type_placeholder": "Select Activity Type",
        "activity_type_description": "Select the activity type between Theory, Practical, Exam, etc.",
        "price": "Price",
        "price_description": "Will be displayed on receipts, invoices, and other communications. Specify the price in Euro. 0 for free activities.",
        "is_activity_required": "Is this activity required to complete the course?",
        "required_amount": "Number of required attendances",
        "required_amount_description": "Specify the number of required attendances to complete the activity.",
        "allow_self_registration": "Allow self registration",
        "allow_self_registration_desc": "If enabled, students can register themselves for this activity.",
        "allow_requests": "Allow requests",
        "allow_requests_desc": "If enabled, students can make requests for this activity."
      }
    }
  }
</i18n>
