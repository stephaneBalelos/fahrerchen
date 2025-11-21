/// <reference lib="deno.ns" />
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import { getCourseActivityById, getCourseActivityRecurrenceRuleById, getLastScheduleOccurenceDate } from "../_shared/utils.ts";
import rrule from "npm:rrule@2.7.0";
import { addDays, addMinutes } from "npm:date-fns"
import type { Database } from "../_shared/types/database.types.ts";

type ScheduleEdit = Omit<Database['public']['Tables']['course_activity_schedules']['Row'], 'id' | 'status' | 'assigned_to' | 'inserted_at' | 'updated_at' | 'attendees_count'>;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("not allowed", { status: 400 })
  }

  const hookSecret = req.headers.get('X-DB-Webhook-Secret')
  if (!hookSecret || hookSecret !== Deno.env.get('DB_WEBHOOK_SECRET')) {
    return new Response('unauthorized', { status: 401 })
  }

  const body = await req.json() as {
    payload: {
      recurrence_rule_id: string
    }
    timestamp: string
  }

  const activityRecurenceRuleId = body.payload.recurrence_rule_id

  console.log(body)

  if (!activityRecurenceRuleId) {
    return new Response(
      JSON.stringify({ error: "No recurrence_rule_id provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  )

  const recurrenceRule = await getCourseActivityRecurrenceRuleById(supabase, activityRecurenceRuleId)
  if (!recurrenceRule) {
    return new Response(
      JSON.stringify({ error: "Recurrence rule not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    )
  }
  const courseActivity = await getCourseActivityById(supabase, recurrenceRule.activity_id)
  if (!courseActivity) {
    return new Response(
      JSON.stringify({ error: "Course activity not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    )
  }
  const lastOccurenceDate = await getLastScheduleOccurenceDate(supabase, recurrenceRule.id, new Date(body.timestamp))

  try {
    const rRule = rrule.RRule.fromString(recurrenceRule.rrule)

    // Get the last scheduled occurence date

    if (lastOccurenceDate) {
      // Check if the last occurence date is in the next 60 days
      const sixtyDaysFromNow = addDays(new Date(body.timestamp), 60)
      if (lastOccurenceDate >= sixtyDaysFromNow) {
        console.log(`No need to extend schedules for recurrence rule ${recurrenceRule.id}, last occurence is beyond 60 days`)
        return new Response(
          "OK",
          { headers: { "Content-Type": "application/json" } },
        )
      }
      // Set the rRule's after date to the last occurence date to avoid duplicates
      rRule.options.dtstart = addMinutes(lastOccurenceDate, 1)
    }

    rRule.options.until = new Date(addDays(rRule.options.dtstart!, 30)) // Extend by 30 days;

    const schedules = rRule.all().map(date => {
      const schedule: ScheduleEdit = {
        activity_id: recurrenceRule.activity_id,
        start_at: new Date(date).toISOString(),
        duration_minutes: 45,
        organization_id: recurrenceRule.organization_id,
        recurrence_rule_id: recurrenceRule.id,
      }
      return schedule
    })

    const { error } = await supabase.from('course_activity_schedules').insert(schedules)
    if (error) {
      console.error("Failed to insert schedules:", error)
      return new Response(
        JSON.stringify({ error: "Failed to insert schedules" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log(`Inserted ${schedules.length} new schedules for recurrence rule ${recurrenceRule.id}`)

  } catch (error) {
    console.error("Failed to parse RRule:", error)
    // Set the recurrence rule as invalid
    await supabase.from('activity_recurrence_rules').update({ is_valid: false }).eq('id', recurrenceRule.id)
    return new Response(
      JSON.stringify({ error: "Failed to parse recurrence rule" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }

  return new Response(
    "OK",
    { headers: { "Content-Type": "application/json" } },
  )
})