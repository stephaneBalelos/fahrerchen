<template>
  <main class="relative h-screen">
    <div class="flex h-full">
      <div class="flex-1 grid place-content-center">
        <div v-if="config.is_demo" class="flex justify-center">
          <UButton
            icon="i-heroicons-question-mark-circle"
            size="2xs"
            color="primary"
            variant="soft"
            label="Demo Version"
            trailing
            @click="openDemoNoticeModal"
          />
        </div>
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import DemoNoticeModal from '~/components/ui/DemoNoticeModal.vue';

const user = useSupabaseUser();
const router = useRouter();
const config = useRuntimeConfig().public;

const modal = useModal();

if (user.value) {
  // Redirect to dashboard if user is logged in
  router.push("/");
}

function openDemoNoticeModal() {
  modal.open(DemoNoticeModal);
}
</script>

<style scoped></style>
