<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  orgid: string;
}>();

const { t } = useI18n({
  useScope: "local",
});

const config = useRuntimeConfig().public;

const onBoadingLink = ref(
  `${config.base_url}/external/onboarding/${props.orgid}`
);

const $emit = defineEmits(["close"]);

const { copy, copied, isSupported } = useClipboard({
  source: onBoadingLink,
});
</script>

<template>
  <UDashboardModal
    :title="t('onboarding_link')"
    :description="t('onboarding_link_description')"
    :ui="{ width: 'sm:max-w-md', height: 'h-auto' }"
  >
    <UAlert
      v-if="copied"
      icon="i-heroicons-clipboard-document-check"
      color="primary"
      variant="soft"
      :title="t('copied')"
    />
    <UButtonGroup size="sm" orientation="horizontal" block>
      <UInput v-model="onBoadingLink" block class="grow" />
      <UButton
        v-if="isSupported"
        icon="i-heroicons-clipboard-document"
        color="gray"
        @click="copy(onBoadingLink)"
      />
    </UButtonGroup>

    <UAlert
        :title="t('tip_title')"
        :description="t('tip_description')"
      />

    <div class="flex justify-end gap-3 mt-2">
      <UButton
        :label="t('close')"
        color="black"
        variant="solid"
        @click="$emit('close')"
      />
    </div>
  </UDashboardModal>
</template>

<i18n lang="json">
{
  "de": {
    "onboarding_link": "Onboarding Link",
    "onboarding_link_description": "Teile diesen Link mit deinen Schülern, damit sie sich anmelden können.",
    "tip_title": "Hinweis",
    "tip_description": "Jeder der diesen Link hat, kann sich voranmelden. Sie müssen dannach die Voranmeldung bestätigen, und anschließend den Schüler in einem Kurs einschreiben.",
    "copied": "Onboarding Link kopiert!",
    "close": "Schließen"
  },
  "en": {
    "onboarding_link": "Onboarding Link",
    "onboarding_link_description": "Share this link with your students so they can sign up.",
    "tip_title": "Note",
    "tip_description": "Anyone with this link can pre-register. You will then need to confirm the pre-registration, and then enroll the student in a course.",
    "copied": "Onboarding Link copied!",
    "close": "Close"
  }
}
</i18n>
