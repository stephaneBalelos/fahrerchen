<template>
  <NuxtLink
    class="p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    @click="() => {}"
  >
    <UChip color="primary" :show="true" inset>
      <UAvatar
        :alt="'sdasdasd asdadfq'"
        size="md"
        :icon="props.icon"
      />
    </UChip>

    <div class="text-sm flex-1">
      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <span
            :class="`text-gray-900 dark:text-white mr-2 ${
              !props.read ? 'font-semibold' : ''
            }`"
          >
            {{
              props.title
            }}
          </span>
          <p class="text-gray-500 dark:text-gray-400 text-xs">
            {{
              props.description
            }}
          </p>
        </div>

        <time
          :datetime="props.insertedAt"
          class="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap"
          v-text="formatTimeAgo(new Date(props.insertedAt))"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";

type Props = {
  read: boolean;
  icon: string;
  title: string;
  description: string;
  insertedAt: string
}

const props = defineProps<Props>();


</script>

<style scoped></style>

<i18n lang="json">

</i18n>
