export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString()
};

export const formatCurrency = (amount: number, locale = 'de-DE') => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(amount)
}