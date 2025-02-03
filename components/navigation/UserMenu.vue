<script setup lang="ts">
const { t } = useI18n({
  useScope: "local",
});
const user = useSupabaseUser();
const userStore = useUserStore();
const supabase = useSupabaseClient();
const toast = useToast();
const getDropdownItems = (u: typeof user.value) => {
  const items = [
    [
      {
        label: u?.email ? u.email : "",
        slot: "account",
        disabled: true,
      },
    ],
    [
      {
        label: t("profile"),
        icon: "i-heroicons-cog-8-tooth",
        click: () => {
          navigateTo("/account");
        },
      },
    ],
    [
      {
        label: t("sign_out"),
        icon: "i-heroicons-arrow-left-on-rectangle",
        class: "logout-button",
        click: () => signOut(),
      },
    ],
  ];

  return items;
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    toast.add({
      title: "Error",
      description: error.message,
      color: "red",
      icon: "i-heroicons-exclamation",
      timeout: 5000,
    });
    return;
  }

  navigateTo("/login");
};
</script>

<template>
  <UDropdown
    v-if="userStore.user"
    id="user-dropdown"
    :items="getDropdownItems(user)"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar
      v-if="userStore.user.avatar_path"
      :src="$publicStorageUrl('users_avatars', userStore.user.avatar_path)"
    />
    <UAvatar
      v-else
      :alt="`${userStore.user.firstname} ${userStore.user.lastname}`"
    />

    <template #account="{ item }">
      <div class="text-left truncate">
        <p>
          {{ t("logged_in_as") }}
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<i18n lang="json">
{
  "en": {
    "logged_in_as": "Logged in as",
    "profile": "My Profile",
    "documentation": "Documentation",
    "changelog": "Changelog",
    "status": "Status",
    "sign_out": "Sign out"
  },
  "de": {
    "logged_in_as": "Angemeldet als",
    "profile": "Mein Profil",
    "documentation": "Dokumentation",
    "changelog": "Änderungsprotokoll",
    "status": "Status",
    "sign_out": "Abmelden"
  }
}
</i18n>
