import { isToday, isYesterday, isTomorrow } from "date-fns";

export const formatDate = (date: string) => {
    const { locale } = useI18n({
        useScope: 'global',
    })
    return new Date(date).toLocaleDateString(locale.value)
};

export const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString()
};

export const getLocalizedDateTimeString = (date: Date, options: {
    timeStyle: 'short' | 'medium' | 'long' | 'full',
} = { timeStyle: 'short' }) => {
    const { t, locale } = useI18n({
        useScope: 'global',
    })

    if (isToday(date)) {
        return t('dates.today_at', { time: date.toLocaleTimeString(locale.value, options) })
    }

    if (isYesterday(date)) {
        return t('dates.yesterday_at', { time: date.toLocaleTimeString(locale.value, options) })
    }

    if (isTomorrow(date)) {
        return t('dates.tomorrow_at', { time: date.toLocaleTimeString(locale.value, options) })
    }

    return t('dates.on_date_at_time', { date: date.toLocaleDateString(locale.value), time: date.toLocaleTimeString(locale.value, options) })
}

export const formatCurrency = (amount: number, locale = 'de-DE') => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount)
}