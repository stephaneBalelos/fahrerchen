<script setup lang="ts">
import AddMemberForm from "~/components/forms/AddMemberForm.vue";
import InvitationList from "~/components/settings/InvitationList.vue";
import type { AppOrganizationsInvitation } from "~/types/app.types";

const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const organizationStore = useUserOrganizationsStore();
const client = useSupabaseClient();
const q = ref("");
const isInviteModalOpen = ref(false);

const invitations = ref<AppOrganizationsInvitation[]>([]);

const filteredMembers = computed(() => {
  return organizationStore.selectedOrganizationMembers
  .filter((member) => member.id !== userOrganizationsStore.selectedOrganization?.owner_id)
  .filter((member) => member.organization_role !== "student")
  .filter((member) => {
    return (
      member.firstname?.search(new RegExp(q.value, "i")) !== -1 ||
      member.lastname?.search(new RegExp(q.value, "i")) !== -1
    );
  });
});

const fetchInvitations = async () => {
  if (!userOrganizationsStore.selectedOrganization?.id) {
    invitations.value = [];
    return;
  }
  const org_id = userOrganizationsStore.selectedOrganization.id;
  try {
    const { data, error } = await client
      .from("organizations_invitations")
      .select("*")
      .eq("organization_id", org_id);
    if (error) {
      throw error;
    } else {
      invitations.value = data || [];
    }
  } catch (error) {
    console.error("Error fetching invitations:", error);
    invitations.value = [];
  }
};

watch(
  () => userOrganizationsStore.selectedOrganization,
  async (newOrg, oldOrg) => {
    if (newOrg && newOrg.id !== oldOrg?.id) {
      await fetchInvitations();
    } else {
      invitations.value = [];
    }
  },
  { immediate: true }
);


async function onClose() {
  isInviteModalOpen.value = false;
  await fetchInvitations();
}
</script>

<template>
  <UDashboardPanelContent>
    <div>
      <UDashboardSection
        :title="t('manage_access')"
        :description="t('invite_new_members')"
        orientation="horizontal"
        :ui="{ container: 'lg:sticky top-2' }"
      >
        <template #links>
          <UButton
            id="invite-people"
            :label="t('invite_people')"
            color="black"
            @click="isInviteModalOpen = true"
          />
        </template>
        <div class="flex flex-col gap-4">
          <UCard
            :ui="{ header: { padding: 'p-4 sm:px-6' }, body: { padding: '' } }"
            class="min-w-0"
          >
            <template #header>
              <UInput
                v-model="q"
                icon="i-heroicons-magnifying-glass"
                :placeholder="t('search_members')"
                autofocus
              />
            </template>
            <SettingsMembersList :members="filteredMembers" />
          </UCard>
          <InvitationList :invitations="invitations" @deleted="fetchInvitations()" />
        </div>
      </UDashboardSection>
      <UDashboardModal
        v-model="isInviteModalOpen"
        :title="t('invite_people')"
        :description="t('invite_new_members')"
        :ui="{ width: 'sm:max-w-md', height: 'h-auto' }"
      >
        <!-- ~/components/settings/MembersForm.vue -->
        <AddMemberForm
          v-if="userOrganizationsStore.selectedOrganization?.id"
          :orgid="userOrganizationsStore.selectedOrganization.id"
          @close="onClose"
        />
      </UDashboardModal>
    </div>
  </UDashboardPanelContent>
</template>

<i18n lang="json">
{
  "de": {
    "manage_access": "Zugriff verwalten",
    "invite_new_members": "Neue Mitglieder per E-Mail-Adresse einladen",
    "invite_people": "Personen einladen",
    "search_members": "Mitglieder suchen"
  },
  "en": {
    "manage_access": "Manage access",
    "invite_new_members": "Invite new members by email address",
    "invite_people": "Invite people",
    "search_members": "Search members"
  }
}
</i18n>
