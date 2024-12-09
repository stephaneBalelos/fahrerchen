import { isToday } from "date-fns";

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
};

export const formatDateTime = (date: string) => {
    const dateObj = new Date(date)
    return new Date(date).toLocaleString()
};

export const formatCurrency = (amount: number, locale = 'de-DE') => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount)
}