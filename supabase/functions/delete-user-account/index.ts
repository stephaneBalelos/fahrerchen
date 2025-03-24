import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts"


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

  const userOrgs = await supabaseClient.from('organizations').select('id').eq('owner_id', user.id)
  if (userOrgs.error) {
    return new Response(JSON.stringify(userOrgs.error), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  if (userOrgs.data.length > 0) {
    return new Response(
      JSON.stringify({
        message: 'User account has organizations. Please delete them first.',
        code: 'USER_HAS_ORGANIZATIONS',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }

  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)
  if (deleteError) {
    return new Response(JSON.stringify(deleteError), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  return new Response(
    JSON.stringify({
      message: 'User account deleted',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    } 
  )
})
