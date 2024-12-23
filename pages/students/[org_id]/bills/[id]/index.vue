<template>
    <UContainer class="w-full">
        <UDashboardSection
            icon="i-heroicons-document-text"
            :title="t('bill_id', { id: bill?.id })"
            :description="t('bill_description')"
            class="px-4 mt-6"
        >
        <template #links>
            <UBadge v-if="bill?.paid_at" color="green" variant="solid">{{ t('paid_at', {date: formatDateTime(bill.paid_at)}) }}</UBadge>
            <UBadge v-else-if="bill?.ready_to_pay" color="primary" variant="solid">{{ t('ready_to_pay') }}</UBadge>
            <UBadge v-else color="orange" variant="solid">{{ t('not_paid') }}</UBadge>
        </template>
        <div>
            <BillsBillingList :bill_id="bill_id" />
            <div class="flex justify-end py-4">
                <span class="text-lg font-bold" v-if="bill?.total">{{ formatCurrency(bill.total) }}</span>
            </div>
            <div class="py-4">
                <UButton v-if="bill?.ready_to_pay && !bill.paid_at" block color="primary" :label="`${t('pay_now')}`" @click="openCheckoutModal" />
            </div>
        </div>
        </UDashboardSection>
    </UContainer>
</template>

<script setup lang="ts">
import BillCheckoutModal from '~/components/students/BillCheckoutModal.vue';
import type { Database } from '~/types/app.types';
import { formatDateTime, formatCurrency } from '~/utils/formatters';


const route = useRoute();
const bill_id = route.params.id as string
const modal = useModal();


const client = useSupabaseClient<Database>();

const { t } = useI18n({
    useScope: "local",
});

const { data: bill, error, status, refresh } = useAsyncData(
    `bills/${bill_id}`,
    async () => {
        const { data, error } = await client
            .from("course_subscription_bills")
            .select("*")
            .eq("id", bill_id).single();
        if (error) {
            throw error;
        }
        return data;
    },
);

async function openCheckoutModal() {
    modal.open(BillCheckoutModal, {
        bill_id: bill_id,
        "onClose": () => {
            modal.close();
        },
    })
}


</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "bill_id": "Rechnung #{id}",
        "bill_description": "Details zur Rechnung",
        "paid_at": "Bezahlt am {date}",
        "ready_to_pay": "Zahlungsbereit",
        "not_paid": "Nicht bezahlt",
        "pay_now": "Jetzt bezahlen"
    },
    "en": {
        "bill_id": "Bill {id}",
        "bill_description": "Details of the bill",
        "paid_at": "Paid at {date}",
        "ready_to_pay": "Ready to pay",
        "not_paid": "Not paid",
        "pay_now": "Pay now"
    }
}
</i18n>