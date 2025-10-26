import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts";
import { getAuthUserWithToken, getOrganization, getOrganizationStripeAccount } from "../_shared/utils.ts";
import Stripe from "npm:stripe@19.1.0"

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? ''

const stripe = new Stripe(stripeSecretKey, {
  httpClient: Stripe.createFetchHttpClient()
})


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { org_id } = await req.json()
  if (!org_id) {
    return new Response('Bad Request', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const supabaseClient = createClient<Database>(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: {
          Authorization: authHeader
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
  const user = await getAuthUserWithToken(supabaseClient, token)

  if (!user) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  const organization = await getOrganization(supabaseClient, org_id)

  if (!organization) {
    return new Response('Failed to fetch organization', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  if (organization.owner_id !== user.id) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  const stripeAccount = await getOrganizationStripeAccount(supabaseClient, org_id)
  if (stripeAccount) {
    // Verify if the Stripe account actually exists in Stripe
    const account = await stripe.accounts.retrieve(stripeAccount.stripe_account_id)
    if (!account) {
      return new Response('Failed to fetch stripe account', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }
    return new Response(
      JSON.stringify({ accountId: stripeAccount.stripe_account_id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } else {
    let accountId: string
    // Check if connected account already exists with the same email & org_id
    const accounts = await stripe.accounts.list()
    const connectedAccount = accounts.data.find(account => account.email === user.email)
    if (connectedAccount && connectedAccount.metadata && connectedAccount.metadata.org_id === org_id) {
      accountId = connectedAccount.id
    } else {
      const account = await stripe.accounts.create({
        country: "DE",
        email: user.email,
        metadata: {
          org_id: org_id
        }
      });

      if (!account) {
        return new Response('Failed to create stripe account', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        })
      }
      accountId = account.id
    }

    const {error} = await supabaseClient.from('organizations_stripe_accounts').insert({
      id: org_id,
      stripe_account_id: accountId
    })

    if (error) {
      return new Response('Failed to save stripe account', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(
      JSON.stringify({ accountId: accountId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  }
})
