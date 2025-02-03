<template>
  <UModal>
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">{{ t("notice_title") }}</h2>
      </template>
      <div class="">
        <p>{{ t("notice_content") }}</p>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <UButton class="ms-auto" @click="modal.close()">{{
            t("close")
          }}</UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: "local",
});

const modal = useModal();
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "notice_title": "Dies ist eine Demo-Version",
    "notice_content": "Diese Version ist nur zu Demozwecken und enthält keine echten Daten. Alle Daten werden regelmäßig zurückgesetzt. Wir freuen uns, dass Sie die Karjole ausprobieren! Lassen Sie uns wissen, was Sie denken.",
    "close": "Alles klar"
  },
  "en": {
    "notice_title": "This is a demo version",
    "notice_content": "This version is for demo purposes only and does not contain real data. All data is reset regularly. We're glad you're trying out Karjole! Let us know what you think.",
    "close": "Got it"
  }
}
</i18n>
