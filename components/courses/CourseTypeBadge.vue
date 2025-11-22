<template>
  <UBadge
    :icon="COURSE_ICONS[props.type]"
    size="xs"
    color="primary"
    :variant="'soft'"
    >Class {{ props.type }}</UBadge
  >
</template>

<script setup lang="ts">
import { COURSE_ICONS } from "~/constants";
import type { AppCourseType } from "~/types/app.types";

type Props = {
  type: AppCourseType;
};

const props = defineProps<Props>();
</script>

<style scoped></style>
