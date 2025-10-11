<template>
      <div class="relative flex flex-col h-full">
        <div class="grid grid-cols-7 sticky top-0 left-0 w-full">
          <div
            v-for="(date, index) in DatesBlocks"
            :key="`header-${index}`"
            :class="`p-3.5 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-200 ${
              date.is_selected ? 'text-primary-600 dark:text-primary-400' : ''
            }`"
          >
            {{ format(date.date, "EEE dd.MM.", { locale: currentLocale }) }}
          </div>
        </div>
        <div class="relative sm:hidden items-center w-full overflow-auto">
          <div class="absolute top-0 left-0 flex flex-col">
            <div
              v-for="hour in HoursBlocks"
              :key="hour.hour"
              class="w-12 h-20 p-2 flex"
            >
              <p class="text-xs font-normal text-gray-900 dark:text-gray-200">
                {{ hour.label }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-1 w-full">
            <div
              v-for="hour in HoursBlocks"
              :key="`block-${hour}`"
              class="w-full h-20 p-1.5 border-t border-gray-200 dark:border-gray-800 transition-all cursor-pointer"
            >
              <div
                class="hidden w-full h-full rounded p-1.5 border-l-2 border-purple-600 bg-purple-50"
              >
                <p class="text-xs font-normal text-gray-900 mb-px">
                  Pickup the grandmother
                </p>
                <p class="text-xs font-semibold text-purple-600">
                  06:00 - 07:30
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>