<template>
  <UAvatar
    v-bind="props"
    :ui="config"
  />
</template>

<script setup lang="ts">
import type { Avatar } from '#ui/types';
import { useSupabaseFileUrl } from '~/composables/useSupabaseFileUrl';

type CustomProps = {
  bucket_id: string;
  path: string;
  transform?: any;
}

const config = {
    size: {
        'full': 'w-full'
    }
}

const props = defineProps<CustomProps>();

const fileUrl = useSupabaseFileUrl(props.bucket_id, props.path, props.transform);

</script>

<style scoped></style>
