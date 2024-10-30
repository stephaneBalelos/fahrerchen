<template>
  <UDashboardSlideover :title="`Student Details`">
    <div class="d-flex">
      <UAvatar size="3xl" :alt="`${state.firstname} ${state.lastname}`" />
      <div>
        <h1 class="text-2xl font-semibold">{{ fullname }}</h1>
        <p class="text-gray-500">{{ state.email }}</p>
      </div>
    </div>
    <UForm ref="form" :state="state" class="space-y-4" :schema="schema"
    :validate-on="['submit']"
    :onSubmit="saveStudent">
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
        <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton
              icon="i-heroicons-calendar-days-20-solid"
              :label="format(state.birth_date, 'd MMM, yyy')"
              block
            />
            <template #panel="{ close }">
              <DatePicker
                v-model="state.birth_date"
                is-required
                @close="close"
              />
            </template>
          </UPopover>
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
  birth_date: z.date().min(new Date(1900, 1, 1)).max(new Date()),
});

type UserSchema = z.output<typeof schema>;

const form = ref<Form<UserSchema> | null>(null);

const state = reactive<UserSchema>({
  email: "",
  firstname: "",
  lastname: "",
  birth_date: new Date(),
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
    state.birth_date = new Date(data.value.birth_date);
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
  const { data: student, error } = await client.from("students").insert({
    ...data,
    birth_date: data.birth_date.toISOString(),
    organization_id: organization_id,
  }).select("*").single();
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
  const { data: student, error } = await client.from("students").update({
    ...data,
    birth_date: data.birth_date.toISOString(),
  }).eq("id", student_id).select("*").single();
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
