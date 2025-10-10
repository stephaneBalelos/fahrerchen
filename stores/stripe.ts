import type Stripe from "stripe"
import type { AppOrganizationsStripeAccount, Database } from "~/types/app.types"

export const useStripeStore = defineStore('stripe', () => {
    const client = useSupabaseClient<Database>()
    const userOrganizationsStore = useUserOrganizationsStore()
    const stripeAccount = ref<Stripe.Response<Stripe.Account> | null>(null)
    const stripeAppSettings = ref<AppOrganizationsStripeAccount | null>(null)

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
                await nextTick();
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
                stripeAppSettings.value = data[0];
            } else {
                stripeAppSettings.value = null;
            }
        } catch (error) {
            console.log(error);
            stripeAppSettings.value = null;
        }
    }

    async function loadStripeAccount(orgid?: string): Promise<AppOrganizationsStripeAccount | null> {
        const org = orgid || userOrganizationsStore.selectedOrganization?.id;
        try {
            if (!org) {
                throw new Error('No organization selected');
            }
    
            const { data, error } = await client.from("organizations_stripe_accounts").select().eq("id", org)
            if (error) {
                throw error;
            }
            if (data) {
                return data[0];
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        if (userOrganizationsStore.selectedOrganization) {
            await fetchStripeAccount();
        }
    }, { immediate: true })

    return {
        stripeAccount, stripeAppSettings, getStripeSessionSecret, fetchStripeAccount, getStripeAppSettings, loadStripeAccount
    }
})