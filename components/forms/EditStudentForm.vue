<template>
  <UDashboardSlideover :title="`Student Details`">
    <div class="d-flex">
      <UAvatar size="3xl" :alt="`${state.firstname} ${state.lastname}`" />
      <div>
        <h1 class="text-2xl font-semibold">{{ fullname }}</h1>
        <p class="text-gray-500">{{ state.email }}</p>
      </div>
    </div>
    <UForm
      ref="form"
      :state="state"
      class="space-y-4"
      :schema="schema"
      :validate-on="['submit']"
      :onSubmit="saveStudent"
    >
      <UDashboardSection
        title="Student Details"
        :description="`Hier die Studentendetails bearbeiten`"
      >
        <UFormGroup label="Firstname" name="firstname" required>
          <UInput v-model="state.firstname" />
        </UFormGroup>
        <UFormGroup label="Lastname" name="lastname" required>
          <UInput v-model="state.lastname" />
        </UFormGroup>
        <UFormGroup label="Email" name="email" required>
          <UInput v-model="state.email" />
        </UFormGroup>
        <UFormGroup label="Phone Number" name="phone_number" required>
          <UInput v-model="state.phone_number" />
        </UFormGroup>
        <UFormGroup label="Birth Date" name="birth_date" required>
          <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="format(state.birth_date, 'd MMM, yyy')"
              color="gray"
              variant="solid"
              block
            />
            <template #panel="{ close }">
              <DatePicker
                v-model="state.birth_date"
                is-required
              />
            </template>
          </UPopover>
        </UFormGroup>
        <UFormGroup
          class="col-span-2"
          label="Address Street"
          name="adress_street"
        >
          <UInput v-model="state.address_street" />
        </UFormGroup>

        <div class="grid grid-cols-3 gap-2">
          <UFormGroup
            class="col-span-2"
            label="Address City"
            name="adress_city"
          >
            <UInput v-model="state.address_city" />
          </UFormGroup>
          <UFormGroup label="Address Zip" name="adress_zip">
            <UInput v-model="state.address_zip" />
          </UFormGroup>
        </div>
        <UFormGroup label="Address Country" name="adress_country">
          <UInput v-model="state.address_country" />
        </UFormGroup>

        <UCheckbox label="Besitzt schon ein Fahrerlaubnis" help="Bitte ankreuzen, wenn der Student schon ein Fahrerlaubnis besitzt" v-model="state.has_a_license" />

      </UDashboardSection>
    </UForm>
    <template #footer>
      <UButton @click="form?.submit()">Save</UButton>
    </template>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";
import { format } from "date-fns";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import DatePicker from "./Inputs/Datepicker.vue";

const props = defineProps<{
  organization_id: string;
  student_id?: string;
}>();

const emit = defineEmits<{
  (e: "student-created", value: AppStudent): void;
  (e: "student-updated", value: AppStudent): void;
}>();

const schema = z.object({
  email: z.string().email(),
  firstname: z.string().min(2).max(255),
  lastname: z.string().min(2).max(255),
  phone_number: z.string().min(2).max(255),
  birth_date: z.date().min(new Date(1900, 1, 1)).max(new Date()),
  address_street: z.string().min(2).max(255),
  address_city: z.string().min(2).max(255),
  address_zip: z.string().min(2).max(255),
  address_country: z.string().min(2).max(255),
  has_a_license: z.boolean(),
});

type UserSchema = z.output<typeof schema>;

const form = ref<Form<UserSchema> | null>(null);

const state = reactive<UserSchema>({
  email: "",
  firstname: "",
  lastname: "",
  birth_date: new Date(),
  address_street: "",
  address_city: "",
  address_zip: "",
  address_country: "",
  phone_number: "",
  has_a_license: false,
});
const fullname = computed(() => `${state.firstname} ${state.lastname}`);

const client = useSupabaseClient<Database>();
const toast = useToast();

if (props.student_id) {
  // fetch student data
  const { data, error, status } = await useAsyncData(
    `student-${props.student_id}`,
    async () => {
      if (!props.student_id) {
        return null;
      }
      const { data, error } = await client
        .from("students")
        .select("*")
        .eq("id", props.student_id)
        .single();
      if (error) {
        throw error;
      }
      return data;
    }
  );

  if (!error.value && data.value) {
    state.email = data.value.email;
    state.firstname = data.value.firstname;
    state.lastname = data.value.lastname;
    state.phone_number = data.value.phone_number ?? "";
    state.birth_date = new Date(data.value.birth_date);
    state.address_street = data.value.address_street ?? "";
    state.address_city = data.value.address_city ?? "";
    state.address_zip = data.value.address_zip ?? "";
    state.address_country = data.value.address_country ?? "";
    state.has_a_license = data.value.has_a_license ?? false;
  }
}

function saveStudent($event: FormSubmitEvent<UserSchema>) {
  if (!props.organization_id) {
    return;
  }

  if (props.student_id) {
    updateStudent($event.data, props.student_id);
  } else {
    createStudent($event.data, props.organization_id);
  }
}

async function createStudent(data: UserSchema, organization_id: string) {
  const { data: student, error } = await client
    .from("students")
    .insert({
      ...data,
      birth_date: data.birth_date.toISOString(),
      organization_id: organization_id,
    })
    .select("*")
    .single();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    throw error;
  }
  emit("student-created", student);
}

async function updateStudent(data: UserSchema, student_id: string) {
  const { data: student, error } = await client
    .from("students")
    .update({
      ...data,
      birth_date: data.birth_date.toISOString(),
    })
    .eq("id", student_id)
    .select("*")
    .single();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    throw error;
  }
  emit("student-updated", student);
}
</script>

<style scoped></style>
