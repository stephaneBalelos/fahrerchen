<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import { useUserInfos } from "~/composables/useUserInfos";
import type { Database } from "~/types/database.types";

definePageMeta({
  layout: "default",
});

const fileRef = ref<HTMLInputElement>();
const isDeleteAccountModalOpen = ref(false);
const user = useUserInfos();
const client = useSupabaseClient<Database>();

const avatarUrl = ref<string | null>(null);

const schema = z.object({
  firstname: z.string().min(2, "Must be at least 8 characters"),
  lastname: z.string().min(2, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  firstname: "",
  lastname: "",
});

onMounted(() => {
  if (user.value) {
    state.firstname = user.value.firstname ? user.value.firstname : "";
    state.lastname = user.value.lastname ? user.value.lastname : "";
  }
});

const toast = useToast();

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  const fileObj = input.files[0];
  avatarUrl.value = URL.createObjectURL(fileObj);
}

function onFileClick() {
  fileRef.value?.click();
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (user.value) {
    try {
      const update = await client
        .from("users")
        .update({
          firstname: event.data.firstname,
          lastname: event.data.lastname,
        })
        .eq("id", user.value.id);
        console.log(update)
      if (update.error) {
        toast.add({
          title: "Error trying to update the profile",
          color: "red",
        });
      } else {
        toast.add({
          title: "Profile updated",
          icon: "i-heroicons-check-circle",
        });
      }
    } catch (err) {
      toast.add({ title: "Error trying to update the profile", color: "red" });
      console.log(err);
    }
  }
}
</script>

<template>
  <UDashboardPanelContent class="pb-24">
    <UContainer>
      <UDashboardSection
        title="Theme"
        description="Customize the look and feel of your dashboard."
      >
        <template #links>
          <!-- <UColorModeSelect color="gray" /> -->
          dsds
        </template>
      </UDashboardSection>

      <UDivider class="mb-4" />

      <UForm :state="state" :schema="schema" @submit="onSubmit">
        <UDashboardSection
          title="Profile"
          description="This information will be displayed publicly so be careful what you share."
        >
          <template #links>
            <UButton type="submit" label="Save changes" color="black" />
          </template>

          <UFormGroup
            name="firstname"
            label="Firstname"
            description="Will appear on receipts, invoices, and other communication."
            required
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.firstname"
              placeholder="Firstname"
              autocomplete="off"
              icon="i-heroicons-user"
              size="md"
            />
          </UFormGroup>
          <UFormGroup
            name="lastname"
            label="Lastname"
            description="Will appear on receipts, invoices, and other communication."
            required
            class="grid grid-cols-2 gap-2 items-center"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.lastname"
              placeholder="Lastname"
              autocomplete="off"
              icon="i-heroicons-user"
              size="md"
            />
          </UFormGroup>

          <!-- <UFormGroup
            name="email"
            label="Email"
            description="Used to sign in, for email receipts and product updates."
            required
            class="grid grid-cols-2 gap-2"
            :ui="{ container: '' }"
          >
            <UInput
              v-model="state.email"
              type="email"
              autocomplete="off"
              disabled
              icon="i-heroicons-envelope"
              size="md"
            />
          </UFormGroup> -->

          <UFormGroup
            name="avatar"
            label="Avatar"
            class="grid grid-cols-2 gap-2"
            help="JPG, GIF or PNG. 1MB Max."
            :ui="{
              container: 'flex flex-wrap items-center gap-3',
              help: 'mt-0',
            }"
          >
            <UAvatar :src="state.avatar" :alt="state.name" size="lg" />

            <UButton
              label="Choose"
              color="white"
              size="md"
              @click="onFileClick"
            />

            <input
              ref="fileRef"
              type="file"
              class="hidden"
              accept=".jpg, .jpeg, .png, .gif"
              @change="onFileChange"
            />
          </UFormGroup>
        </UDashboardSection>
      </UForm>

      <UDivider class="mb-4" />

      <UDashboardSection
        title="Account"
        description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
      >
        <div>
          <UButton
            color="red"
            label="Delete account"
            size="md"
            @click="isDeleteAccountModalOpen = true"
          />
        </div>
      </UDashboardSection>

      <!-- ~/components/settings/DeleteAccountModal.vue -->
      <!-- <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" /> -->
    </UContainer>
  </UDashboardPanelContent>
</template>
