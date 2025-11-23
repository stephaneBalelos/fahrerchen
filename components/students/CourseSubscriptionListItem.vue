<template>
  <div>
    <UAlert
      v-if="subscription && subscription.student && subscription.course && status === 'success'"
      :avatar="{
        src: undefined,
        alt: `${subscription.student.firstname} ${subscription.student.lastname}`,
      }"
      :title="`${subscription.student.firstname} ${subscription.student.lastname}`"
      :actions="[
        {
          label: g(`course_types.${subscription.course.type}.name`),
          variant: 'solid',
          color: 'primary',
        },
      ]"
    />
    <div v-else-if="status === 'pending'" class="flex justify-center my-4">
      <USkeleton class="w-16 h-16 rounded-full mb-2" />
      <div class="flex flex-col ml-4">
        <USkeleton class="w-full h-6 mb-2" />
        <USkeleton class="w-full h-4" />
      </div>
    </div>
    <UAlert
      v-else
      color="red"
      variant="soft"
      :icon="'i-heroicons-exclamation-triangle-solid'"
      :title="t('course_subscription.not_found')"
      :description="t('course_subscription.not_found_description')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  subscriptionId: string;
};

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
const client = useSupabaseClient<Database>();

const { data: subscription, status } = useAsyncData(async () => {
  const { data, error } = await client
    .from("course_subscriptions")
    .select(
      "*, course:courses(*), student:students(firstname, lastname, email)"
    )
    .eq("id", props.subscriptionId)
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "course_subscription": {
      "not_found": "Course Subscription Not Found",
      "not_found_description": "The requested course subscription could not be found."
    }
  },
  "de": {
    "course_subscription": {
      "not_found": "Kursanmeldung nicht gefunden",
      "not_found_description": "Die angeforderte Kursanmeldung konnte nicht gefunden werden."
    }
  }
}
</i18n>
