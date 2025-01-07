import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";
import type Stripe from "stripe";

export type UserRole = DatabaseGenerated['public']['Enums']['app_role']
export type RolePermission = DatabaseGenerated['public']['Enums']['app_permission']
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
export type AppCourseActivityAttendance = DatabaseGenerated['public']['Tables']['course_activity_attendances']['Row']

export type AppCourseSubscriptionBill = DatabaseGenerated['public']['Tables']['course_subscription_bills']['Row']

export type AppCourseDocument = DatabaseGenerated['public']['Tables']['course_documents']['Row']
export type AppCourseRequiredDocument = DatabaseGenerated['public']['Tables']['course_required_documents']['Row']


export type AppStudentRegistrationRequest = DatabaseGenerated['public']['Tables']['students_registration_requests']['Row']

export type AppStripeAccountPaymentMethodSettings = {
  credit_card: {
    payment_method_id: Stripe.PaymentMethod.Type
    enabled: boolean
  },
  paypal: {
    payment_method_id: Stripe.PaymentMethod.Type
    enabled: boolean
  },
  klarna: {
    payment_method_id: Stripe.PaymentMethod.Type
    enabled: boolean
  }
}

export type AppOrganizationsStripeAccount = DatabaseGenerated['public']['Tables']['organizations_stripe_accounts']['Row']






export type StripeConnectPostBody = {
  org_id: string
}

export type StripeConnectLinkAccountPostBody = {
  org_id: string
}

export type CourseActivityScheduleView = Database["public"]["Views"]["course_activity_schedules_view"]["Row"]

export type Database = MergeDeep<DatabaseGenerated, {
  public: {
    Views: {
      organization_members_view: {
        Row: {
          id: string
          inserted_at: Date
          organization_id: string
          user_id: string
          role: UserRole
          user_email: string
          user_firstname: string | null
          user_lastname: string | null
          user_fullname: string | null
          user_avatar_path: string | null
        }
      },
      course_subscriptions_view: {
        Row: {
          id: string,
          course_id: string,
          student_id: string,
          archived_at: Date | null,
          costs: string,
          organization_id: string,
          course_name: string,
          course_description: string,
          student_email: string,
          student_firstname: string,
          student_lastname: string
        }
      },
      course_activity_schedules_view: {
        Row: {
          id: string
          course_id: string
          activity_id: string
          assigned_to: string
          status: DatabaseGenerated["public"]["Enums"]["schedule_status"]
          start_at: string
          end_at: string
          organization_id: string,
          activity_name: string,
          activity_description: string,
          activity_type: DatabaseGenerated["public"]["Enums"]["activity_types"],
          course_name: string,
          course_description: string,
          assigned_to_email: string,
          assigned_to_firstname: string | null,
          assigned_to_lastname: string | null,
        } 
      },
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
