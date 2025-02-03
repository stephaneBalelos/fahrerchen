<template>
  <USelectMenu v-model="selectedLocale" :options="availableLocales">
    <template #label> <UIcon :name="`i-circle-flags-${ locale }`"/> {{ $t(`lang_${selectedLocale}`) }}</template>
    <template #option="{ option }">
      <UIcon :name="`i-circle-flags-${ option }`"/>
      <span>{{ $t(`lang_${option}`) }}</span>
    </template>
  </USelectMenu>

</template>

<script setup lang="ts">
const {locale, availableLocales, setLocale, } = useI18n({
  useScope: 'global'
})


const selectedLocale = ref(locale.value)

watch(selectedLocale, (value) => {
  setLocale(value)
})

</script>

<style scoped>

</style>
