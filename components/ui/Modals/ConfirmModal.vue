<template>
  <UDashboardModal
    :title="props.title"
    :description="props.description"
    icon="i-heroicons-exclamation-circle"
    :ui="{
      icon: { base: 'text-red-500 dark:text-red-400' } as any,
      footer: { base: 'ml-16' } as any
    }"
  >
    <template #footer>
      <UButton color="red" :label="props.confirmLabel" :loading="loading" @click="onDelete" />
      <UButton color="white" :label="props.cancelLabel" @click="() => modal.close()" />
    </template>
  </UDashboardModal>
</template>

<script setup lang="ts">
type Props = {
    title: string
    description: string
    confirmLabel: string
    cancelLabel: string
    action: () => Promise<void>
}
const loading = ref(false)
const modal = useModal()

const props = defineProps<Props>()

async function onDelete() {
  loading.value = true
    try {
      await props.action()
      modal.close()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
}

</script>

<style scoped>

</style>