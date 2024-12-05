// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { corsHeaders } from "../_shared/cors.ts"
import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts"


async function hasUserOrganisationMembership(supabase: SupabaseClient<Database>, user_id: string, orgid: string): Promise<Database['public']['Tables']['organization_members']['Row'] | null> {
  const { data, error } = await supabase.from('organization_members').select('*').eq('organization_id', orgid).eq('user_id', user_id).single()
  if (error || !data) {
    return null
  }
  return data
}

async function getUserByEmail(supabase: SupabaseClient<Database>, email: string): Promise<Database['public']['Tables']['users']['Row'] | null> {
  const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
  if (error || !data) {
    return null
  }
  return data
}

async function addUserToOrganisation(supabase: SupabaseClient<Database>, user_id: string, orgid: string, role: Database['public']['Enums']['app_role']) {
  const { data, error } = await supabase.from('organization_members').insert({
    organization_id: orgid,
    user_id: user_id,
    role,
  }).select('*').single()
  if (error || !data) {
    return null
  }
  return data
}


Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response('Unauthorized', {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 401,
    })
  }
  const token = authHeader.replace('Bearer ', '')

  try {
    const supabaseAdmin = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
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
      return new Response('Unauthorized', {
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

    if (['owner', 'manager'].includes(userMembership.role) === false) {
      return new Response('Unauthorized', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // check if email is already a member of the organization
    const existingUser = await getUserByEmail(supabaseClient, email)
    if (existingUser) {
      // check if user is already a member of the organization
      const existingUserMembership = await hasUserOrganisationMembership(supabaseClient, existingUser.id, orgid)
      if (existingUserMembership) {
        return new Response('User is already a member of the organization', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      } else {
        // add user to the organization
        const newMembership = await addUserToOrganisation(supabaseClient, existingUser.id, orgid, role)
        if (!newMembership) {
          return new Response('Error adding user to organization', {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          })
        } else {
          // send email to the user
        }
      }
    } else {
      // Invite new user
      const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: {
          role,
          organization_id: orgid 
        }, redirectTo: `${Deno.env.get('BASE_URL')}/confirm`
      })

      if (error || !data.user) {
        return new Response('Error inviting user', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      const invitedUser = data.user

      // add user to the organization
      const newMembership = await addUserToOrganisation(supabaseClient, invitedUser.id, orgid, role)

      if (!newMembership) {
        return new Response('Error adding user to organization', {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
      }
    }


    return new Response(JSON.stringify('ok'), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  // deno-lint-ignore no-explicit-any
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify('error'), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
