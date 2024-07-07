<template>
    <div v-if="props.selectedDate" class="h-full">
        <AppCalendarMonthView v-if="props.view == 'month'" :selected-date="props.selectedDate" >
            <template #body="{ day }">
                <slot name="month-body" :day></slot>
            </template>
        </AppCalendarMonthView>
        <AppCalendarWeekView v-if="props.view == 'week'" :selected-date="props.selectedDate" ></AppCalendarWeekView>
        <AppCalendarDayView v-if="props.view == 'day'" :selected-date="props.selectedDate"></AppCalendarDayView>
    </div>
</template>

<script setup lang="ts">
import AppCalendarMonthView from './views/AppCalendarMonthView.vue'
import AppCalendarWeekView from './views/AppCalendarWeekView.vue';
import AppCalendarDayView from './views/AppCalendarDayView.vue';

export type AppCalendarProps = {
    view: 'day' | 'week' | 'month';
    selectedDate: Date;
}


    const props = withDefaults(defineProps<AppCalendarProps>(), {
        view: 'week'
    })

</script>

<style scoped>

</style>