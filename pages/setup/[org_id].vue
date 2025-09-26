<template>
  <div>
    <UHeader v-if="organization">
      <template #logo>
        <div class="flex items-center gap-2">
          <UAvatar
            v-if="organization.avatar_path"
            :src="
              $publicStorageUrl(
                'organizations_avatars',
                organization.avatar_path
              ) ?? undefined
            "
            :size="'sm'"
            :alt="organization.name"
          />
          <UAvatar
            v-else
            :icon="'i-heroicons-building-office-20-solid'"
            :size="'sm'"
            :alt="organization.name"
          />
          <span class="text-lg font-semibold">
            {{ organization.name }}
          </span>
          <span class="text-sm text-gray-500">
            {{ lastPathPart }}
          </span>
        </div>
      </template>
    </UHeader>
    <UMain class="min-h-screen py-6">
      <UContainer class="w-full">
          <ClientOnly>
            <NuxtPage />
          </ClientOnly>
      </UContainer>
    </UMain>
  </div>
</template>

<script setup lang="ts">
const userOrganizationsStore = useUserOrganizationsStore();
const organization = computed(() => (userOrganizationsStore.selectedOrganization));

const route = useRoute();

// get last part of the path
const lastPathPart = computed(() => {
  const parts = route.path.split('/');
  return parts[parts.length - 1];
});

</script>

<style scoped></style>
