import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type Stripe from "stripe"
import { Database } from "../_shared/types/database.types.ts";

Deno.serve(async (req) => {
  console.log("Request received")
  const body = await req.json() as Stripe.Event

  const eventType = body.type

  console.log("Event Type: ", eventType)

  // New Payment Intent Created
  if (eventType === "payment_intent.created") {
    console.log("Payment Intent Created")

    const metadata = body.data.object.metadata

    console.log("Metadata: ", metadata)

    // Get Bill ID form metadata
    const billId = metadata.bill_id
    const paymentIntentId = body.data.object.id

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
    console.log("Error: ", error)
  }

  if (eventType === "payment_intent.succeeded") {

    const paymentIntent = body.data.object as Stripe.PaymentIntent
    const metadata = paymentIntent.metadata

    console.log("Metadata: ", metadata)

    // Get Bill ID form metadata
    const billId = metadata.bill_id

    // Get Organization ID form metadata
    const organizationId = metadata.organization_id

    // Get User ID form metadata
    const userId = metadata.user_id

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
    const { error: errorInsert } = await supabaseAdmin.from("course_subscription_bill_history").insert({
      bill_id: billId,
      activity: 'BILL_PAID',
      actor_id: userId,
      item_price: 0, 
      item_description: '',
      organization_id: organizationId
    })
    console.log("Error: ", error)
    console.log("Error Insert: ", errorInsert)
  }


  return new Response(
    JSON.stringify({ message: "Webhook received" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
