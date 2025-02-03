<template>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Dashboard" badge="5" />
        <UDashboardPanelContent>
            <div class="grid grid-cols-2 gap-4">
                <OverviewAppointmentsList />
                <OverviewBillList />
            </div>
        </UDashboardPanelContent>
    </UDashboardPanel>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>