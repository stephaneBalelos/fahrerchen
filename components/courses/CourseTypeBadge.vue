<template>
  <UBadge
    :icon="COURSE_ICONS[props.type]"
    size="xs"
    color="primary"
    :variant="props.variant ?? 'soft'"
    ><span class="font-bold">{{ g(`course_types.${props.type}.name`) }}</span></UBadge
  >
</template>

<script setup lang="ts">
import { COURSE_ICONS } from "~/constants";
import type { AppCourseType } from "~/types/app.types";

type Props = {
  type: AppCourseType;
  variant?: "solid" | "soft";
};

const { t:g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
</script>

<style scoped></style>
