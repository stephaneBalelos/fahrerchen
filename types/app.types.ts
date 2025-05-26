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
export type AppCourseCost = DatabaseGenerated['public']['Tables']['course_costs']['Row']
export type AppCourseType = DatabaseGenerated['public']['Enums']['course_type']
export type AppCourseActivity = DatabaseGenerated['public']['Tables']['course_activities']['Row']
export type AppCourseActivityType = DatabaseGenerated['public']['Tables']['course_activity_types']['Row']
export type AppCourseActivitySchedule = DatabaseGenerated['public']['Tables']['course_activity_schedules']['Row']
export type AppScheduleType = DatabaseGenerated['public']['Enums']['schedule_type']
export type AppCourseSubscription = DatabaseGenerated['public']['Tables']['course_subscriptions']['Row']

export type AppCourseSubscriptionBill = DatabaseGenerated['public']['Tables']['course_subscription_bills']['Row']
export type AppCourseSubscriptionBillItem = DatabaseGenerated['public']['Tables']['course_subscription_bill_items']['Row']

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

export type AppUserOrganizationsView = Database["public"]["Views"]["users_organizations_view"]["Row"]
export type AppOrganizationSchedulesView = Database["public"]["Views"]["organizations_schedules_view"]["Row"]
export type AppCourseSubscriptionsView = Database["public"]["Views"]["course_subscriptions_view"]["Row"]

export type Database = MergeDeep<DatabaseGenerated, {
  public: {
    Views: {
      users_organizations_view: {
        Row: {
          user_id: string
          user_email: string
          user_firstname: string | null
          user_lastname: string | null
          user_fullname: string | null
          organization_id: string
          organization_name: string
          organization_description: string | null
          organization_avatar_path: string | null
          organization_preferred_language: string
          organization_role: UserRole
          organization_membership_inserted_at: string
        }
      },
      organizations_schedules_view: {
        Row: {
          schedule_id: string
          schedule_organization_id: string
          schedule_start_at: string
          schedule_end_at: string
          schedule_attendees: string[]
          schedule_status: DatabaseGenerated["public"]["Enums"]["schedule_status"]
          schedule_assigned_to: string
          activity_id: string
          activity_name: string
          activity_description: string
          activity_type: DatabaseGenerated["public"]["Enums"]["activity_types"]
          course_id: string
          course_name: string
          course_description: string
        }
      },
      course_subscriptions_view: {
        Row: {
          id: string
          student_id: string
          inserted_at: string
          archived_at: string | null
          costs: number
          organization_id: string
          student_firstname: string
          student_lastname: string
          student_email: string
          student_full_name: string
          student_avatar_path: string | null
          course_name: string
          course_description: string
          course_id: string
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
          activity_allow_self_registration: boolean,
          activity_allow_requests: boolean,
          course_name: string,
          course_description: string,
          assigned_to_email: string,
          assigned_to_firstname: string | null,
          assigned_to_lastname: string | null,
          attendees: string[]
        }
      },
      course_subscriptions_stats_view: {
        Row: {
          id: string,
          course_id: string,
          student_id: string,
          archived_at: Date | null,
          costs: number,
          organization_id: string,
          course_name: string,
          course_description: string,
          total_costs: number,
          total_bills: number,
        }
      }
      course_subscription_bill_items_view: {
        Row: {
          id: string,
          bill_id: string,
          course_cost_id: string,
          course_activity_attendance_id: string,
          item_title: string,
          item_description: string,
          item_price: number,
          cost_name: string,
          cost_description: string,
          cost_price: number,
          activity_id: string,
          activity_name: string,
          activity_description: string,
          activity_type: number,
          activity_start_at: string,
          activity_end_at: string,
          activity_assigned_to_id: string,
          activity_assigned_to_email: string,
          activity_assigned_to_firstname: string,
          activity_assigned_to_lastname: string,
        }
      }
      user_roles_view: {
        Row: {
          email: string
          firstname: string | null
          lastname: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        };
      }
      notifications_view: {
        Row: {
          actor_email: string | null
          actor_firstname: string | null
          actor_lastname: string | null
          actor_fullname: string | null
          actor_id: string | null
          date: string
          id: string
          organization_id: string
          read_at: string | null
          resource_id: string
          target_roles: UserRole[]
          target_id: string
          type: Database["public"]["Enums"]["notification_type"]
          payload: unknown
          updated_at: string
        }
      }
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
