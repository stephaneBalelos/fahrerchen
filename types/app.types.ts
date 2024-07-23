import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";

export type UserRole = DatabaseGenerated['public']['Enums']['app_role']
export type AppUser = DatabaseGenerated['public']['Tables']['users']['Row']
export type AppUserWithRole = DatabaseGenerated['public']['Tables']['users']['Row'] & { role: UserRole }
export type AppOrganization = DatabaseGenerated['public']['Tables']['organizations']['Row']
export type AppOrganizationMember = DatabaseGenerated['public']['Tables']['organization_members']['Row']
export type AppStudent = DatabaseGenerated['public']['Tables']['students']['Row']
export type AppCourse = DatabaseGenerated['public']['Tables']['courses']['Row']
export type AppCourseType = DatabaseGenerated['public']['Tables']['course_types']['Row']
export type AppCourseActivity = DatabaseGenerated['public']['Tables']['course_activities']['Row']
export type AppCourseActivityType = DatabaseGenerated['public']['Tables']['course_activity_types']['Row']
export type AppCourseActivitySchedule = DatabaseGenerated['public']['Tables']['course_activity_schedules']['Row']
export type AppScheduleType = DatabaseGenerated['public']['Enums']['schedule_type']
export type AppCourseSubscription = DatabaseGenerated['public']['Tables']['course_subscriptions']['Row']



export type StripeConnectPostBody = {
  org_id: string
}

export type Database = MergeDeep<DatabaseGenerated, {
  public: {
    Views: {
      user_roles_view: {
        Row: {
          email: string
          firstname: string | null
          lastname: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        };
      };
    };
  };
  storage: {
    Tables: {
      objects: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          metadata: {
            name?: string,
            beschreibung?: string,
          }
          name: string
          object_id: string
        }
      }
    }
  }
}>;

export type AppFileObject = Omit<Database["storage"]["Tables"]["objects"]["Row"], "path_tokens" | "owner_id" | "version" | "object_id">
