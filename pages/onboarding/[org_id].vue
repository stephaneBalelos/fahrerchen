<template>
  <UContainer class="w-full">
    <UForm
      ref="form"
      :state="state"
      class="space-y-4"
      :schema="schema"
      :validate-on="['submit']"
      :onSubmit="saveStudent"
    >
      <UDashboardSection
        title="WIll"
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
                @close="close"
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
        <UCheckbox
          label="Besitzt schon ein Fahrerlaubnis"
          help="Bitte ankreuzen, wenn der Student schon ein Fahrerlaubnis besitzt"
          v-model="state.has_a_license"
        />
      </UDashboardSection>
    </UForm>
  </UContainer>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";
import { format } from "date-fns";
import type { Form, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import DatePicker from "~/components/forms/Inputs/Datepicker.vue";
import organizations from "~/middleware/organizations";

definePageMeta({
  layout: "default",
  middleware: [organizations],
});

const userOrganizationsStore = useUserOrganizationsStore();
const userStore = useUserStore();
const client = useSupabaseClient<Database>();
const toast = useToast();

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

async function saveStudent(event: FormSubmitEvent<UserSchema>) {
  console.log(event.data);

  if (userOrganizationsStore.selectedOrganization) {
    await createStudent(
      event.data,
      userOrganizationsStore.selectedOrganization.id
    );
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
    .select("id")
    .single();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    throw error;
  } else {
    toast.add({
      title: "Student Profile Created",
      description: "Your student Profile has been created",
      color: "green",
    });
    navigateTo(`/my/${organization_id}/students/${student.id}`);
  }
}
</script>

<style scoped></style>
