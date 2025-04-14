
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Create a Supabase client with the Auth context of the user that called the function
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  // Get the request body
  const { email } = await req.json()

  if (!email) {
    return new Response(
      JSON.stringify({ error: 'Email is required' }),
      { headers: { 'Content-Type': 'application/json' }, status: 400 }
    )
  }

  // Query for matching emails in auth.users
  // This requires enabling the pgcrypto extension on your Supabase project
  try {
    // Use RPC to check email availability to avoid direct access to auth.users
    const { data, error } = await supabaseClient.rpc('check_email_exists', { 
      email_to_check: email 
    })

    if (error) throw error

    const available = !data // data will be true if email exists, so we negate for availability

    return new Response(
      JSON.stringify({ available }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to check email availability', details: error }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
