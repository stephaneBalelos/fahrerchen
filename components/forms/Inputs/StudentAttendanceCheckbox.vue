<template>
  <UCheckbox
    v-model="isAttending"
    class="items-center p-4 sm:px-6"
    @change="handleChange"
  >
    <template #label>
      <slot />
    </template>
  </UCheckbox>
</template>

<script setup lang="ts">
import type {
  AppStudent,
  Database,
} from "~/types/app.types";

type Props = {
  subscriptionId: string;
  student: AppStudent;
  scheduleId: string;
  attendees: string[];
  onChange?: () => void;
};

const tutorialStore = useTutorialStore();

const props = defineProps<Props>();

const { t } = useI18n({ useScope: "local" });

const client = useSupabaseClient<Database>();

const isAttending = computed(() => {
  return props.attendees.includes(props.subscriptionId);
});

async function handleChange($event: boolean) {
  console.log('event', $event);
}

</script>

<style scoped></style>
