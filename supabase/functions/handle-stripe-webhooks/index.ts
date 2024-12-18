// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import type Stripe from "stripe"

Deno.serve(async (req) => {
  console .log("Request received")
  const body = await req.json() as Stripe.Event
  
  const eventType = body.type

  console.log("Event Type: ", eventType)

  // New Payment Intent Created
  if (eventType === "payment_intent.created") {
    console.log("Payment Intent Created")
  }


  return new Response(
    JSON.stringify({ message: "Webhook received" }),
    { headers: { "Content-Type": "application/json" } },
  )
})
