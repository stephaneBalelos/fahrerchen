<template>
    <div class="p-4">
        <UCheckbox
              class="items-center"
              v-model="isAttending"
              @change="handleChange"
            >
              <template #label>
                <slot></slot>
              </template>
            </UCheckbox>
    </div>
</template>

<script setup lang="ts">
import type { AppCourseSubscription, AppStudent, Database } from '~/types/app.types';

type Props = {
  subscription_id: string;
  student: AppStudent
  activity_id: string;
  schedule_id: string;
  onChange?: () => void
};

const props = defineProps<Props>();

const { t } = useI18n({ useScope: 'local' })

const client = useSupabaseClient<Database>();

const isAttending = ref(false)

const { data, error, status, refresh } = useAsyncData(async () => {
    const { data, error } = await client
        .from('course_activity_attendances')
        .select('*')
        .eq('course_subscription_id', props.subscription_id).eq('activity_schedule_id', props.schedule_id)

    if (error) {
        throw error
    }

    if (data[0]) {
        isAttending.value = true
    }
    return data[0]
}) 


async function handleChange($event: boolean) {
  if ($event) {
      await addToSchedule(props.student.organization_id, props.subscription_id, props.schedule_id, props.activity_id);
    } else {
      await removeFromSchedule(props.subscription_id, props.schedule_id);
  }
  refresh();
  props.onChange && props.onChange();
}

async function addToSchedule(
  org_id: string,
  subscription_id: string,
  schedule_id: string,
    activity_id: string
) {
  try {
    const { data, error } = await client
      .from("course_activity_attendances")
      .insert({
        course_subscription_id: subscription_id,
        activity_schedule_id: schedule_id,
        organization_id: org_id,
        course_activity_id: activity_id
      });
      if (error) {
        throw error;
      }
  } catch (error) {
    console.error(error);
  }
}

async function removeFromSchedule(
  subscription_id: string,
  schedule_id: string
) {
  try {
    const { data, error } = await client
      .from("course_activity_attendances")
      .delete()
      .eq("course_subscription_id", subscription_id)
      .eq("activity_schedule_id", schedule_id);

    if (error) {
        console.log(error)
        throw error;
    }
    
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>

</style>