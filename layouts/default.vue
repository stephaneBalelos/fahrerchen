<template>
    <UMain>
        <UDashboardLayout>
            <UDashboardPage>
                <UDashboardPanel grow>
                <UDashboardNavbar title="Settings" />
                
                <slot></slot>
                </UDashboardPanel>
            </UDashboardPage>

            <!-- ~/components/HelpSlideover.vue
            <HelpSlideover />
             ~/components/NotificationsSlideover.vue
            <NotificationsSlideover /> -->

            <ClientOnly>
                <LazyUDashboardSearch :groups="groups" />
            </ClientOnly>
        </UDashboardLayout>
    </UMain>
</template>

<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const toast = useToast()



const links = [{
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'i-heroicons-view-dashboard',
    to: '/',
    tooltip: {
        text: 'Dashboard',
        shortcuts: ['G', 'D']
    }
}, {
    id: 'orgs',
    label: 'Organizations',
    icon: 'i-heroicons-user-group',
    to: '/orgs',
    badge: '4',
    tooltip: {
        text: 'Inbox',
        shortcuts: ['G', 'O']
    }
}, {
    id: 'users',
    label: 'Users',
    icon: 'i-heroicons-user-group',
    to: '/users',
    tooltip: {
        text: 'Users',
        shortcuts: ['G', 'U']
    }
}, {
    id: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: 'i-heroicons-cog-8-tooth',
    children: [{
        label: 'General',
        to: '/settings',
        exact: true
    }, {
        label: 'Members',
        to: '/settings/members'
    }, {
        label: 'Notifications',
        to: '/settings/notifications'
    }],
    tooltip: {
        text: 'Settings',
        shortcuts: ['G', 'S']
    }
}]

const footerLinks = [{
    label: 'Invite people',
    icon: 'i-heroicons-plus',
    to: '/settings/members'
}, {
    label: 'Help & Support',
    icon: 'i-heroicons-question-mark-circle',
    click: () => isHelpSlideoverOpen.value = true
}]

const groups = [{
    key: 'links',
    label: 'Go to',
    commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts }))
}, {
    key: 'code',
    label: 'Code',
    commands: [{
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        click: () => {
            window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
        }
    }]
}]

const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => console.log(color) })))
const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: false })))


const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
        toast.add({ title: 'Error', description: error.message, color: 'red', icon: 'i-heroicons-exclamation', timeout: 5000})
        return
    }

    navigateTo('/login')
}
</script>

<style scoped></style>