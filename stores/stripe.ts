import type Stripe from "stripe"
import type { AppOrganizationsStripeAccount, AppStripeAccountPaymentMethodSettings, Database, StripeConnectPostBody, StripeConnectPostResponse } from "~/types/app.types"



export const useStripeStore = defineStore('stripe', () => {
    const client = useSupabaseClient<Database>()
    const userOrganizationsStore = useUserOrganizationsStore()
    const stripeAccount = ref<Stripe.Response<Stripe.Account> | null>(null)
    const stripeAppSettings = ref<AppOrganizationsStripeAccount | null>(null)

    async function connectStripeAccount() {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error('No organization selected');
        }

        const body: StripeConnectPostBody = {
            org_id: userOrganizationsStore.selectedOrganization.id
        };

        const { data, error } = await client.functions.invoke<StripeConnectPostResponse>('stripe-connect', {
            method: 'POST',
            body
        })
        if (error) {
            throw error;
        }

        console.log("Stripe Connect Data: ", data);

        return data as { accountId: string };
    }

    async function fetchStripeAccount() {
        try {
            if (!userOrganizationsStore.selectedOrganization) {
                return;
            }
            const account = await $fetch(
                `/api/orgs/payments/stripe/accounts/${userOrganizationsStore.selectedOrganization.id}`
            );
            if (account) {
                stripeAccount.value = null;
                stripeAccount.value = account;
                await getStripeAppSettings();
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getStripeSessionSecret() {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error('No organization selected');
        }
        const session = await $fetch(`/api/orgs/payments/stripe/session/${userOrganizationsStore.selectedOrganization.id}`);
        if (session) {
            return session.client_secret;
        } else {
            throw new Error('Failed to get stripe session secret');
        }
    }

    async function getStripeAppSettings(): Promise<void> {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error('No organization selected');
        }
        try {
            const { data, error } = await client.from("organizations_stripe_accounts").select().eq("id", userOrganizationsStore.selectedOrganization.id)
            if (error) {
                throw error;
            }
            if (data) {
                stripeAppSettings.value = data[0] as AppOrganizationsStripeAccount;
            } else {
                stripeAppSettings.value = null;
            }
        } catch (error) {
            console.log(error);
            stripeAppSettings.value = null;
        }
    }

    async function updateStripeAppSettings(orgId: string, settings: AppStripeAccountPaymentMethodSettings): Promise<void> {
        const { error } = await client.from("organizations_stripe_accounts").update({
            payment_methods: settings
        }).eq("id", orgId);

        if (error) {
            throw error;
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        if (userOrganizationsStore.selectedOrganization) {
            await fetchStripeAccount();
        }
    }, { immediate: true })

    return {
        stripeAccount, stripeAppSettings, connectStripeAccount, getStripeSessionSecret, fetchStripeAccount, getStripeAppSettings, updateStripeAppSettings
    }
})