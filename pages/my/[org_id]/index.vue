<template>
    <UDashboardPanel grow>
        <UDashboardNavbar title="Dashboard" badge="5" />
        <UDashboardPanelContent>
            <div class="grid grid-cols-2">
                <OverviewAppointmentsList></OverviewAppointmentsList>
            </div>
        </UDashboardPanelContent>
    </UDashboardPanel>
</template>

<script setup lang="ts">
    definePageMeta({
        layout: 'orgs',
    })
</script>

<style scoped>

</style>