<template>
  <UDashboardCard
    :description="showInactive ? t('inactive_students_description') : t('active_students_description')"
    icon="i-heroicons-academic-cap"
  >
    <template #title>
      <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {{ subCount }}
      </div>
    </template>
    <template #links>
      <!-- <UBadge color="primary" variant="soft">+ 5</UBadge> -->
    </template>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type Props = {
    showInactive?: boolean
}

const props = defineProps<Props>()

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();

const { data: subCount } = useAsyncData(`${props.showInactive ? 'inactive' : 'active'}-students`, async () => {
    const req = client.from("course_subscriptions").select('*', {count: 'exact', head: true})

    if (props.showInactive) {
        req.not('archived_at', 'is', null)
    } else {
        req.is('archived_at', null)
    }

    const { count, error } = await req

    if (error) {
        throw error
    }

    return count
})

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "active_students_description": "Aktive Schüler:innen",
    "inactive_students_description": "Inaktive Schüler:innen"
  },
  "en": {
    "active_students_description": "Active Students",
    "inactive_students_description": "Inactive Students"
  }
}
</i18n>
