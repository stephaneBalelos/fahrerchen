import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { getHmacSignature, getOrganization, hasUserOrganisationMembership, sendEmail } from "../_shared/utils.ts";

import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import InvitationMail from '../_shared/_templates/InvitationMail.tsx'




Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized - Missing Auth Header', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }
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

  const { data: { user }, error } = await supabaseClient.auth.getUser(token)
  if (error || !user) {
    return new Response('Unauthorized - Failed to Authenticate', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  const { email, role, orgid }: { email: string, role: Database['public']['Enums']['app_role'], orgid: string } = await req.json()

  // Check if the user is owner or manager in the organization
  const userMembership = await hasUserOrganisationMembership(supabaseClient, user.id, orgid)

  if (!userMembership) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // Only owner and manager can invite users
  if (['owner', 'manager'].includes(userMembership.role) === false) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }

  // Insert new invitation
  const { data: invite, error: inviteError } = await supabaseClient.from("organizations_invitations").insert({
    email,
    organization_id: orgid,
    role,
  }).select().single()

  if (inviteError || !invite) {
    console.error('Failed to create Inviation', inviteError)
    return new Response('Failed to create Inviation', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  // create hmac token
  const invitationSignature = await getHmacSignature(JSON.stringify(invite))

  // generate url
  const url = `${Deno.env.get('BASE_URL')}/external/invitations?invitation_id=${invite.id}&signature=${invitationSignature}`

  // send email
  const organization = await getOrganization(supabaseClient, invite.organization_id)

  if (!organization) {
    return new Response('Organization not found', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 404,
    })
  }

  const html = await renderAsync(
    React.createElement(InvitationMail, {
      user_email: invite.email,
      organization_name: organization.name,
      lang: organization.preferred_language,
      url_base: Deno.env.get('BASE_URL') ?? '',
      role: invite.role,
    })
  )

  const subject = {
    de: `Einladung zur Organisation ${organization.name}`,
    en: `Invitation to join the organization ${organization.name}`,
  }

  await sendEmail(invite.email, organization.preferred_language === 'en' ? subject.en : subject.de, html)


  return new Response(
    JSON.stringify({ message: 'Invite sent', url }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})