import { Database, StripeConnectLinkAccountPostBody } from "~/types/app.types";
import { serverSupabaseClient, serverSupabaseSession } from '#supabase/server'


export default defineEventHandler(async (event) => {

    try {
        const config = useRuntimeConfig()
        const stripe = await stripeClient(config.stripe_sk)
        const origin = event.headers.get('origin')

        if (origin === null) {
            throw createError({
                status: 400,
                message: 'Origin header is required'
            })
        }


       const { org_id } = await readBody<StripeConnectLinkAccountPostBody>(event)

       const client = await serverSupabaseClient<Database>(event)

       const { data, error } = await client.from('organizations').select('*').eq('id', org_id).single()

       if (error) {
           throw createError({
               status: 500,
               message: 'Failed to fetch organization'
           })
        }

        if (!data) {
            throw createError({
                status: 404,
                message: 'Organization not found'
            })
        }

        let account_id = data.stripe_account_id

        if (!account_id) {
            console.log('Creating Stripe Account')
            const account = await stripe.accounts.create({
                country: "DE",
                email: event.context.auth.email
            });
    
            if (!account) {
                throw createError({
                    status: 500,
                    message: 'Failed to create Stripe account'
                })
            }
    
            const res = await client.from('organizations').update({
                stripe_account_id: account.id
            }).eq('id', org_id)

            account_id = account.id
    
            if (res.error) {
                throw createError({
                    status: 500,
                    message: res.error.message
                })
            }
        }
    
        const accountLink = await stripe.accountLinks.create({
          account: account_id,
          return_url: `${origin}/my/settings/payments`,
          refresh_url: `${origin}/my/settings/payments`,
          type: "account_onboarding",
        });
    
        return { accountLink }
      } catch (error) {
        console.error(error);
        throw createError({
          status: 500,
          message: "An error occurred when calling the Stripe API to create an account link",
        });
      }
})