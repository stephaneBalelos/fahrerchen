<template>
  <main class="relative h-screen">
    <div class="flex h-full">
      <div class="flex-1 grid place-content-center">
        <div v-if="config.is_demo" class="flex justify-center">
          <UBadge variant="soft">Demo Version</UBadge>
        </div>
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const router = useRouter();
const config = useRuntimeConfig().public;

if (user.value) {
  // Redirect to dashboard if user is logged in
  router.push("/");
}
</script>

<style scoped></style>
