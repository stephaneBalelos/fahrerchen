import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler( async (event) => {
    const client = await serverSupabaseClient(event)

    
    
    const res = await client.functions.invoke('invite-team-member', {
        body: {
            name: "Stephane"
        }
    })
    // console.log(res)
    return res
  })