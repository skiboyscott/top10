import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const brevoKey = Deno.env.get('BREVO_API_KEY')!;
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
// Serve the edge function
const supabase = createClient(
  supabaseUrl,
  serviceRoleKey
)

serve(async () => {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('user_activity_summary')
    .select('user_email')
    .or(`last_vote_date.is.null,last_vote_date.neq.${today}`)

  if (error) {
    console.error('Query error:', error)
    return new Response('Query error', { status: 500 })
  }

  console.log(`Found ${data.length} users to notify.`)

  for (const user of data) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: 'top10weather.com', email: 'noreply@top10weather.com' },
        to: [{ email: user.user_email }],
        subject: 'Reminder: Please vote today!',
        htmlContent: '<p>Don’t forget to log in and vote today!</p>'
      })
    })

    if (!res.ok) {
      console.error(`Failed to email ${user.user_email}:`, await res.text())
    } else {
      console.log(`Email sent to ${user.user_email}`)
    }
  }

  return new Response('Done', { status: 200 })
})