<template>
  <div>Invitations</div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

definePageMeta({
  validate: async (route) => {
    // get query params invitation_id and signature
    const { invitation_id, signature } = route.query;

    if (!invitation_id || !signature) {
      return false;
    }

    if (typeof invitation_id !== "string" || typeof signature !== "string") {
      return false;
    }

    return true;
  },
});

const route = useRoute();
const client = useSupabaseClient<Database>();

type InvitationResponse = {
  email: string;
  orgid: string;
  otp?: string;
};

onMounted(async () => {
  const { invitation_id, signature } = route.query;
  console.log(invitation_id, signature);

  if (!invitation_id || !signature) {
    throw new Error("Invalid invitation");
  }

  if (typeof invitation_id !== "string" || typeof signature !== "string") {
    throw new Error("Invalid invitation");
  }

  try {
    const { data, error } = await client.functions.invoke<InvitationResponse>(
      "accept-invitation",
      {
        method: "POST",
        body: {
          invitation_id,
          signature,
        },
      }
    );

    console.log(data);

    if (error) {
      console.log(error);
      throw error;
    }

    if (data?.otp) {
      await client.auth.verifyOtp({
        email: data.email,
        token: data.otp,
        type: "email",
      });
      navigateTo(`/my/${data.orgid}`);
    } else {
        navigateTo("/my");
    }
  } catch (error) {
    console.error(error);

  }
});
</script>

<style scoped></style>
