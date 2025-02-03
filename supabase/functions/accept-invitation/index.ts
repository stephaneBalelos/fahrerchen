import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import { corsHeaders } from "../_shared/cors.ts";
import { getUserByEmail, verifyHmacSignature } from "../_shared/utils.ts";
import type { Database } from "../_shared/types/database.types.ts"


Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const { invitation_id, signature }: {invitation_id: string, signature: string} = await req.json()

  if (!invitation_id || !signature) {
    return new Response('Bad Request', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }

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

  // get the invitation
  const { data: invitation, error } = await supabaseAdmin.from("organizations_invitations").select('*').eq('id', invitation_id).single()
  if (error || !invitation) {
    return new Response('Bad Request', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  const isSignatureValid = await verifyHmacSignature(JSON.stringify(invitation), signature)
  if (!isSignatureValid) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // chech if the invitation is not expired
  const now = new Date()
  const insertedAt = new Date(invitation.inserted_at)
  const diff = now.getTime() - insertedAt.getTime()
  const diffInHours = diff / (1000 * 60 * 60)
  if (diffInHours > 24) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }


  // check if the user already exists
  const user = await getUserByEmail(supabaseAdmin, invitation.email)
  if (user) {
    // insert the user into the organization
    const { data, error } = await supabaseAdmin.from("organization_members").insert({
      user_id: user.id,
      organization_id: invitation.organization_id,
      role: invitation.role,
    }).select().single()
    if (error || !data) {
      return new Response('Failed to insert user into the organization', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // delete the invitation
    const { error: deleteError } = await supabaseAdmin.from("organizations_invitations").delete().eq('id', invitation.id)
    if (deleteError) {
      return new Response('Failed to delete invitation', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const email = invitation.email

    return new Response(JSON.stringify({email, orgid: invitation.organization_id}), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } else {
    // create a new user
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email: invitation.email,
    })

    if (error || !data) {
      console.error('Failed to create user', error)
      return new Response('Failed to create user', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // insert the user into the organization
    const { data: insertData, error: insertError } = await supabaseAdmin.from("organization_members").insert({
      user_id: data.user.id,
      organization_id: invitation.organization_id,
      role: invitation.role,
    }).select().single()

    if (insertError || !insertData) {
      console.error('Failed to insert user into the organization', insertError)
      return new Response('Failed to insert user into the organization', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // delete the invitation
    const { error: deleteError } = await supabaseAdmin.from("organizations_invitations").delete().eq('id', invitation_id)
    if (deleteError) {
      console.error('Failed to delete invitation', deleteError)
      return new Response('Failed to delete invitation', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    const email = invitation.email
    const otp = data.properties.email_otp

    return new Response(JSON.stringify({ email, otp, orgid: invitation.organization_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
