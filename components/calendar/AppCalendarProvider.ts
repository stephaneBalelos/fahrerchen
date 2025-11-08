import type { InjectionKey } from "vue";
import type { AppCalendarEvent } from "./AppCalendar.vue";

type EventBlockActions = {
    onClick?: (event: MouseEvent, calendarEvent: AppCalendarEvent) => void;
}

export const AppCalenderProviderKey = Symbol() as InjectionKey<EventBlockActions>;