import { createClient } from '@supabase/supabase-js'
import Stripe from "npm:stripe@19.1.0"
import type { Database } from "../_shared/types/database.types.ts";

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? ''
const stripeWebhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

const stripe = new Stripe(stripeSecretKey, {
  httpClient: Stripe.createFetchHttpClient()
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

Deno.serve(async (req) => {
  const headers = Object.fromEntries(req.headers)
  const sig = headers["stripe-signature"] as string

  const body = await req.text()

  try {
    const verifiedPayload = await stripe.webhooks.constructEventAsync(body, sig, stripeWebhookSecret, 300, cryptoProvider)
    const eventType = verifiedPayload.type

    // New Payment Intent Created
    if (eventType === "payment_intent.created") {

      const metadata = verifiedPayload.data.object.metadata

      // Get Bill ID form metadata
      const billId = metadata.bill_id
      const paymentIntentId = verifiedPayload.data.object.id

      const supabaseAdmin = createClient<Database>(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // update the bill with the payment intent id
      const { error } = await supabaseAdmin.from("course_subscription_bills").update({ stripe_payment_intent_id: paymentIntentId }).eq('id', billId).single()
      
      if (error) {
        console.log("Error: ", error)
      }
    }

    if (eventType === "payment_intent.succeeded") {

      const paymentIntent = verifiedPayload.data.object as Stripe.PaymentIntent
      const metadata = paymentIntent.metadata

      // Get Bill ID form metadata
      const billId = metadata.bill_id

      // Get Organization ID form metadata
      // const organizationId = metadata.organization_id

      // Get User ID form metadata
      // const userId = metadata.user_id

      const supabaseAdmin = createClient<Database>(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          }
        }
      )

      // update the bill with the payment intent id
      const { error } = await supabaseAdmin.from("course_subscription_bills").update({ paid_at: new Date().toISOString() }).eq('id', billId).single()
      console.log("Error: ", error)
    }

  } catch (error) {
    console.log("Error: ", error)
    return new Response(
      JSON.stringify({ message: "Webhook received" }),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  return new Response(
    JSON.stringify({ message: "Webhook received" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
