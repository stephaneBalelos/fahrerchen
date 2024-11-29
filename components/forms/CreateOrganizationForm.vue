<template>
  <UModal>
    <UForm
      :schema="schema"
      :state="state"
      :validate-on="['blur', 'submit']"
      @submit="createOrganization"
    >
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: { base: 'flex flex-col space-y-2' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              {{ t("your_new_organization") }}
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="$emit('close')"
            />
          </div>
        </template>

        <UFormGroup
          :label="t('form.name.label')"
          :description="t('form.name.description')"
          name="name"
          required
        >
          <UInput
            v-model="state.name"
            :placeholder="t('form.name.placeholder')"
          />
        </UFormGroup>

        <UFormGroup
          :label="t('form.address_street.label')"
          :description="t('form.address_street.description')"
          name="address_street"
        >
          <UInput v-model="state.address_street" />
        </UFormGroup>

        <UFormGroup
          :label="t('form.address_city.label')"
          :description="t('form.address_city.description')"
          name="address_city"
        >
          <UInput v-model="state.address_city" />
        </UFormGroup>

        <div class="grid grid-cols-3 gap-2">
          <UFormGroup
            :label="t('form.address_zip.label')"
            :description="t('form.address_zip.description')"
            name="address_zip"
          >
            <UInput v-model="state.address_zip" />
          </UFormGroup>

          <UFormGroup
            class="col-span-2"
            :label="t('form.address_country.label')"
            :description="t('form.address_country.description')"
            name="address_country"
          >
            <UInput v-model="state.address_country" />
          </UFormGroup>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-2">
            <UButton color="gray" variant="ghost" @click="$emit('close')">{{
              t("cancel")
            }}</UButton>
            <UButton type="submit">{{ t("create") }}</UButton>
          </div>
        </template>
      </UCard>
    </UForm>
  </UModal>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { Database } from "~/types/app.types";

const user = useSupabaseUser();
const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const $emits = defineEmits(["close", "created"]);

const schema = z.object({
  name: z
    .string()
    .min(3, g("form_errors.min", { field: t("form.name.label"), min: 3 }))
    .max(255, g("form_errors.max", { field: t("form.name.label"), max: 255 })),
  address_street: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_street.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_street.label"), max: 255 })
    ),
  address_city: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_city.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_city.label"), max: 255 })
    ),
  address_zip: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_zip.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_zip.label"), max: 255 })
    ),
  address_country: z
    .string()
    .min(
      3,
      g("form_errors.min", { field: t("form.address_country.label"), min: 3 })
    )
    .max(
      255,
      g("form_errors.max", { field: t("form.address_country.label"), max: 255 })
    ),
});

type OrganizationSchema = z.infer<typeof schema>;

const state = ref<OrganizationSchema>({
  name: "",
  address_street: "",
  address_city: "",
  address_zip: "",
  address_country: "",
});

const createOrganization = async () => {
  if (user.value === null) {
    return;
  }

  if (!schema.safeParse(state.value)) {
    return;
  }

  const { data, error } = await client.from("organizations").insert({
    ...state.value,
    owner_id: user.value.id,
  });
  if (error) {
    throw error;
  }
  $emits("created");
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "your_new_organization": "Deine neue Fahrschule",
    "cancel": "Abbrechen",
    "create": "Erstellen",
    "form": {
      "name": {
        "label": "Name",
        "description": "Name deine neue Fahrschule",
        "placeholder": "Fahrschule XYZ"
      },
      "address_street": {
        "label": "Straße",
        "description": "Straße und Hausnummer"
      },
      "address_city": {
        "label": "Stadt",
        "description": "Stadt"
      },
      "address_zip": {
        "label": "Postleitzahl",
        "description": "Postleitzahl"
      },
      "address_country": {
        "label": "Land",
        "description": "Land"
      }
    }
  }
}
</i18n>
