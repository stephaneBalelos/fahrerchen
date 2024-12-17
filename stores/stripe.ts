import Stripe from "stripe"
import type { AppOrganizationMember, Database } from "~/types/app.types"

export const useStripeStore = defineStore('stripe', () => {
    const client = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const userPermissionsStore = useUserPermissionsStore()
    const userOrganizationsStore = useUserOrganizationsStore()
    const stripeAccount = ref<Stripe.Response<Stripe.Account> | null>(null)

    async function fetchStripeAccount() {
        try {
            if (!userOrganizationsStore.selectedOrganization) {
                return;
            }
            const account = await $fetch(
                `/api/orgs/payments/stripe/accounts/${userOrganizationsStore.selectedOrganization.organization_id}`
            );
            if (account) {
                stripeAccount.value = null;
                await nextTick();
                stripeAccount.value = account;
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function getStripeSessionSecret() {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error('No organization selected');
        }
        const session = await $fetch(`/api/orgs/payments/stripe/session/${userOrganizationsStore.selectedOrganization.organization_id}`);
        if (session) {
            return session.client_secret;
        } else {
            throw new Error('Failed to get stripe session secret');
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        if (userOrganizationsStore.selectedOrganization) {
            await fetchStripeAccount();
        }
    }, { immediate: true })

    return {
        stripeAccount, getStripeSessionSecret, fetchStripeAccount
    }
})