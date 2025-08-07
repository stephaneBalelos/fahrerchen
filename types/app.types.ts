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
export type AppOrganizationBillingSettings = DatabaseGenerated['public']['Tables']['organization_billing_settings']['Row']

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
export type AppCourseSubscriptionBillsView = Database["public"]["Views"]["course_subscription_bills_view"]["Row"]

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
          organization_id: string,
          organization_handle: string
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
          course_type: AppCourseType
        }
      },
      course_subscription_bills_view: {
        Row: {
          id: string,
          bill_number: string,
          organization_id: string,
          total: number,
          vat_rate: number,
          vat_amount: number,
          total_with_vat: number,
          paid_at: string | null,
          canceled_at: string | null,
          created_at: string,
          course_subscription_id: string,
          course_id: string,
          student_id: string,
          student_firstname: string,
          student_lastname: string,
          student_email: string,
          course_name: string,
          course_description: string,
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


export type BillTemplateData = {
  driving_school_logo: string
  driving_school_name: string
  driving_school_address_street: string
  driving_school_address_zip: string
  driving_school_address_city: string
  driving_school_address_country: string
  driving_school_email: string
  driving_school_phone_number: string
  student_firstname: string
  student_lastname: string
  student_address_street: string
  student_address_zip: string
  student_address_city: string
  student_address_country: string
  bill_date: string
  bill_number: string
  invoice_title: string
  invoice_subtitle: string
  bill_total: string
  bill_vat_exempt: boolean
  bill_vat_rate: string
  bill_vat_amount: string
  bill_total_with_vat: string
  invoice_message: string
  invoice_footer: string
  bill_settings_bank_account_name: string
  bill_settings_bank_account_number: string
  bill_settings_bank_account_bic: string
  bill_settings_bank_account_iban: string
  bill_settings_tax_id: string
  bill_items: {
    title: string;
    description: string;
    date: string;
    total: string;
  }[]
}

export type NotificationType = DatabaseGenerated['public']['Enums']['notification_type']
