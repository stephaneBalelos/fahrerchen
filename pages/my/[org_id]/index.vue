<template>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Dashboard" badge="5" />
        <UDashboardPanelContent>
            <div class="flex grid lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                <ActiveStudentsStats :org-id="org_id" />
                <ActiveStudentsStats :org-id="org_id" :show-inactive="true" />
                <OverviewOpenRegistrationsStats />
                <OverviewOpenStudentInvitations />
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <OverviewAppointmentsList />
                <OverviewBillList />
            </div>
        </UDashboardPanelContent>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import ActiveStudentsStats from '~/components/overview/ActiveStudentsStats.vue'


const route = useRoute()
const org_id = route.params.org_id as string

</script>

<style scoped>

</style>