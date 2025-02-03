<template>
  <div class="h-screen w-full grid place-items-center">
    <UContainer>
      <ULandingCTA
        v-if="error && error.statusCode === 404"
        :title="t('404_title')"
        :description="t('404_description')"
        :links="[
          {
            label: t('cta'),
            color: 'gray',
            trailingIcon: 'i-heroicons-arrow-right',
            size: 'lg',
            click: handleError,
          },
        ]"
        card
      />
    </UContainer>
  </div>
</template>
<script lang="ts" setup>
const error = useError();

const { t } = useI18n({
  useScope: "local",
});

const user = useSupabaseUser();

function handleError() {
    const redirect = user ? "/my" : "/";
  clearError({
    redirect: redirect,
  });
  // Redirect to the dashboard
  // router.push('/dashboard');
}
</script>

<i18n lang="json">
{
  "de": {
    "404_title": "404 - Seite nicht gefunden",
    "404_description": "Die Seite, die Sie suchen, wurde nicht gefunden.",
    "cta": "Zurück zur Startseite"
  },
  "en": {
    "404_title": "404 - Page not found",
    "404_description": "The page you are looking for was not found.",
    "cta": "Back to the homepage"
  }
}
</i18n>
