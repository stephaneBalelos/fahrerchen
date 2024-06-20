<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()
const getDropdownItems = (u: typeof user.value) => {
    const items = [
        [{
            label: u?.email ? u.email : '',
            slot: 'account',
            disabled: true
        }], [{
            label: 'Profile',
            icon: 'i-heroicons-cog-8-tooth',
            click: () => {
                navigateTo("/account")
            }
        }], [{
            label: 'Documentation',
            icon: 'i-heroicons-book-open'
        }, {
            label: 'Changelog',
            icon: 'i-heroicons-megaphone'
        }, {
            label: 'Status',
            icon: 'i-heroicons-signal'
        }], [{
            label: 'Sign out',
            icon: 'i-heroicons-arrow-left-on-rectangle',
            class: 'logout-button',
            click: () => signOut()
        }]
    ]

    return items
}

const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        toast.add({ title: 'Error', description: error.message, color: 'red', icon: 'i-heroicons-exclamation', timeout: 5000 })
        return
    }

    navigateTo('/login')
}

</script>

<template>
    <UDropdown v-if="user" :items="getDropdownItems(user)" :ui="{ item: { disabled: 'cursor-text select-text' } }"
        :popper="{ placement: 'bottom-start' }">
        <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />

        <template #account="{ item }">
            <div class="text-left">
                <p>
                    Signed in as
                </p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ item.label }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>

            <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>
    </UDropdown>
</template>

