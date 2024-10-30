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
      <UProgress :value="course_progression" :max="40" :color="color">
          <template #indicator="{ percent }">
            <div class="text-right" :style="{ width: `${percent}%` }">
              <span v-if="course_progression < 10" class="text-blue-500"
                >Frischling</span
              >
              <span v-else-if="course_progression < 20" class="text-green-500"
                >Bereits für die Theorie</span
              >
              <span v-else-if="course_progression < 99" class="text-green-500"
                >Bereits für die Praxis</span
              >
              <span v-else class="text-green-500 font-bold">Bestanden!</span>
            </div>
          </template>
        </UProgress>
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

const course_progression = ref(35);

const color = computed(() => {
  switch (true) {
    case course_progression.value < 10:
      return "blue";
    case course_progression.value < 20:
      return "amber";
    case course_progression.value < 30:
      return "orange";
    default:
      return "green";
  }
});



</script>

<style scoped></style>
