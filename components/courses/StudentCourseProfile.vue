<template>
  <UDashboardSlideover :title="'Course Profile'" ref="slideover">

    <UDashboardSection
        icon="i-heroicons-user"
        :title="'Full Name'"
        :description="'student@email.com'"
        :links="[{ label: 'Student Profile', color: 'black' }]"
    >
    <template #icon="">
        <UAvatar alt="m d" size="lg" />
    </template>

</UDashboardSection>

    <UDashboardCard
      title="Recent sales"
      description="You made 265 sales this month."
      icon="i-heroicons-chart-bar"
    >
      <UProgress />
    </UDashboardCard>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type Props = {
    subscription_id: string;
};

// const { subscription, student, course } = useAttrs() as Props;
const supabase = useSupabaseClient<Database>();



</script>

<style scoped></style>
