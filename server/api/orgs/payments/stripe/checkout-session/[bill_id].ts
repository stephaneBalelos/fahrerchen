import type { User } from "@supabase/supabase-js";
import { getBillById, updateBillPaymentIntentId } from "~/server/utils/supabase";
import type { AppStripeAccountPaymentMethodSettings } from "~/types/app.types";


export default defineEventHandler(async (event) => {
    // check if the user is authenticated
    const user = event.context.auth as User;
    if (!user) {
        console.log('Unauthorized - user not authenticated');
        throw createError({
            status: 401,
            message: 'Unauthorized'
        });
    }

    // get the bill id
    const bill_id = getRouterParam(event, 'bill_id');
    if (!bill_id) {
        console.log('Bill ID is required');
        throw createError({
            status: 400,
            message: 'Bill ID is required'
        });
    }

    // get the bill
    const bill = await getBillById(event, bill_id);
    if (!bill) {
        console.log('Bill not found');
        throw createError({
            status: 404,
            message: 'Bill not found'
        });
    }

    // check if the bill is already paid
    if (bill.paid_at) {
        console.log('Bill already paid');
        throw createError({
            status: 400,
            message: 'Bill already paid'
        });
    }

    // Check if the bill is canceled
    if (bill.canceled_at) {
        console.log('Bill is canceled');
        throw createError({
            status: 400,
            message: 'Bill is canceled'
        });
    }

    // get Organization Stripe Account
    const orgStripeAccount = await getOrganizationStripeAccount(event, bill.organization_id);


    if (!orgStripeAccount) {
        throw createError({
            status: 404,
            message: 'Organization does not have a stripe account'
        });
    }

    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)
    if (!stripe) {
        throw createError({
            status: 500,
            message: "Stripe client could not be initialized",
        });
    }

    const enabledPaymentMethods = ['sepa_debit']
    const orgsPaymentMethods = orgStripeAccount.payment_methods as AppStripeAccountPaymentMethodSettings
    if (orgsPaymentMethods) {
        Object.values(orgsPaymentMethods).filter(pm => pm.enabled).forEach(pm => enabledPaymentMethods.push(pm.payment_method_id))
    }

    // check if the bill already has a payment intent
    if (bill.stripe_payment_intent_id) {
        // fetch the payment intent
        let intent = await stripe.paymentIntents.retrieve(bill.stripe_payment_intent_id, {
            stripeAccount: orgStripeAccount.stripe_account_id
        });

        // update the payment intent amount
        if (intent.amount !== (bill.total_with_vat || bill.total) * 100) {
            intent = await stripe.paymentIntents.update(bill.stripe_payment_intent_id, {
                amount: (bill.total_with_vat || bill.total) * 100
            }, { stripeAccount: orgStripeAccount.stripe_account_id });
        }

        // Update payment method types if they have changed
        intent = await stripe.paymentIntents.update(bill.stripe_payment_intent_id, {
            payment_method_types: enabledPaymentMethods
        }, { stripeAccount: orgStripeAccount.stripe_account_id });

        // check has already been paid
        if (intent.status === 'succeeded') {
            // save the paid at date
            throw createError({
                status: 400,
                message: 'Payment intent already succeeded'
            });
        }

        return { clientSecret: intent.client_secret, stripeAccountId: orgStripeAccount.stripe_account_id, total: intent.amount / 100 };
    } else {
        // Check if the intent exists in Stripe to avoid duplicates
        const intents = await stripe.paymentIntents.search({
            query: `metadata["bill_id"]:"${bill.id}" AND metadata["organization_id"]:"${bill.organization_id}"`,
        }, {
            stripeAccount: orgStripeAccount.stripe_account_id
        })
        if (intents.data.length > 0) {
            const intent = intents.data[0];
            // save the payment intent id to the bill
            const paymentIntentUpdateError = await updateBillPaymentIntentId(event, bill.id, intent.id);
            if (paymentIntentUpdateError) {
                throw createError({
                    status: 500,
                    message: 'Failed to save payment intent id to bill'
                });
            }
            return { clientSecret: intent.client_secret, stripeAccountId: orgStripeAccount.stripe_account_id, total: intent.amount / 100 };
        }
        // create a new payment intent

        const intent = await stripe.paymentIntents.create({
            amount: (bill.total_with_vat || bill.total) * 100,
            currency: 'eur',
            payment_method_types: enabledPaymentMethods,
            metadata: {
                bill_id: bill.id,
                organization_id: bill.organization_id,
                user_id: user.id,
            }
        }, {
            stripeAccount: orgStripeAccount.stripe_account_id,
            idempotencyKey: bill.id,

        })

        return { clientSecret: intent.client_secret, stripeAccountId: orgStripeAccount.stripe_account_id, total: intent.amount / 100 };
    };

});
