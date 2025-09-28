<script setup lang="ts">
import { USER_ROLES } from '~/constants';
import type { OrganizationMember } from '~/stores/organizations';
import type { Database, UserRole } from '~/types/app.types';

type Props = {
  members: OrganizationMember[];
}

const props = defineProps<Props>();
const { t } = useI18n({
  useScope: 'local'
})

const { t: g } = useI18n({
  useScope: 'global'
})

const client = useSupabaseClient<Database>()
const toast = useToast()

const user_roles = USER_ROLES.filter(r => r !== 'student')

const roles = user_roles.map(r => ({
  label: g(`roles.${r}`),
  value: r
}))

async function onRoleChange(member: OrganizationMember, role: UserRole) {
  try {
    const { error } = await client.from('organization_members').update({ role }).eq('user_id', member.id)
    if (error) {
      throw error
    }
    toast.add({
      title: t(`user_role.update_successful_title`),
      description: t('user_role.update_successful_description', { name: member.firstname, role }),
      color: 'green'
    })
  } catch (error) {
    console.error('Error updating role:', error)
    toast.add({
      title: t(`user_role.update_failed_title`),
      description: t('user_role.update_failed_description'),
      color: 'red'
    })
  }

}
</script>

<template>
  <ul
    role="list"
    class="divide-y divide-gray-200 dark:divide-gray-800"
  >
    <li
      v-for="(member, index) in props.members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <!-- <UAvatar
          v-bind="member.avatar"
          size="md"
        /> -->

        <div class="text-sm min-w-0">
          <p class="text-gray-900 dark:text-white font-medium truncate">
            {{ member.firstname }} {{ member.lastname }}
          </p>
          <p class="text-gray-500 dark:text-gray-400 truncate">
            {{ member.email }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">

        <USelectMenu
          :model-value="member.organization_role"
          :options="roles"
              value-attribute="value"
            option-attribute="label"
          color="white"
          :ui-menu="{ select: 'capitalize', option: { base: 'capitalize' } }"
          @update:model-value="onRoleChange(member, $event)"
        />

          <UButton
            icon="i-heroicons-trash"
            color="gray"
            variant="ghost"
          />
      </div>
    </li>
  </ul>
</template>

<i18n lang="json">
{
  "de": {
    "user_role": {
      "update_successful_title": "Rolle aktualisiert",
      "update_successful_description": "Die Rolle von {name} wurde zu {role} geändert.",
      "update_failed_title": "Fehler beim Aktualisieren der Rolle",
      "update_failed_description": "Es gab einen Fehler beim Aktualisieren der Rolle. Bitte versuche es erneut."
    }
  },
  "en": {
    "user_role": {
      "update_successful_title": "Role updated",
      "update_successful_description": "The role of {name} has been changed to {role}.",
      "update_failed_title": "Error updating role",
      "update_failed_description": "There was an error updating the role. Please try again."
    }
  }
}
</i18n>