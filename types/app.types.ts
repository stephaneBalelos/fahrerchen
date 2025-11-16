import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";
import type Stripe from "stripe";

export type UserRole = DatabaseGenerated['public']['Enums']['app_role']
export type RolePermission = DatabaseGenerated['public']['Enums']['app_permission']
export type AppUser = DatabaseGenerated['public']['Tables']['users']['Row']
export type AppUserWithRole = DatabaseGenerated['public']['Tables']['users']['Row'] & { role: UserRole }
export type AppOrganization = DatabaseGenerated['public']['Tables']['organizations']['Row']
export type OrganizationEdit = Omit<AppOrganization, 'id' | 'description' | 'inserted_at' | 'updated_at' | 'setup_completed' | 'allow_self_registration' | 'avatar_path'>
export type AppOrganizationMember = DatabaseGenerated['public']['Tables']['organization_members']['Row']
export type AppOrganizationsInvitation = DatabaseGenerated['public']['Tables']['organizations_invitations']['Row']
export type AppStudent = DatabaseGenerated['public']['Tables']['students']['Row']
export type StudentEdit = Omit<AppStudent, 'id' | 'organization_id' | 'created_at' | 'avatar_path' | 'updated_at' | 'user_id' | 'full_name'>
export type AppCourseType = DatabaseGenerated['public']['Enums']['course_type']
export type AppCourse = DatabaseGenerated['public']['Tables']['courses']['Row']

export type AppCourseCost = DatabaseGenerated['public']['Tables']['course_costs']['Row']
export type CourseCostEdit = Omit<AppCourseCost, 'id' | 'organization_id' | 'inserted_at' | 'updated_at'>
export type AppCourseCostsCombination = DatabaseGenerated['public']['Tables']['course_costs_combinations']['Row']
export type CourseCostsCombinationEdit = Omit<AppCourseCostsCombination, 'id' | 'organization_id' | 'cost_id' | 'course_id'>

export type AppCourseActivityType = DatabaseGenerated['public']['Enums']['activity_types']

export type AppCourseActivity = DatabaseGenerated['public']['Tables']['course_activities']['Row']
export type CourseActivityEdit = Omit<AppCourseActivity, 'id' | 'organization_id' | 'inserted_at' | 'updated_at'>
export type AppCourseActivitiesCombination = DatabaseGenerated['public']['Tables']['course_activities_combinations']['Row']
export type CourseActivitiesCombinationEdit = Omit<AppCourseActivitiesCombination, 'id' | 'organization_id' | 'activity_id' | 'course_id'>

export type AppCourseActivityRecurrenceRule = DatabaseGenerated['public']['Tables']['activity_recurrence_rules']['Row']

export type AppCourseActivitySchedule = DatabaseGenerated['public']['Tables']['course_activity_schedules']['Row']
export type CourseActivityScheduleEdit = Omit<AppCourseActivitySchedule, 'id' | 'organization_id' | 'inserted_at' | 'updated_at'  | 'attendees'>
export type AppScheduleType = DatabaseGenerated['public']['Enums']['schedule_type']
export type AppScheduleStatus = DatabaseGenerated['public']['Enums']['schedule_status']

export type AppCourseActivityScheduleRequest = DatabaseGenerated['public']['Tables']['course_activity_schedule_requests']['Row']
export type CourseActivityScheduleRequestEdit = Omit<AppCourseActivityScheduleRequest, 'id' | 'organization_id' | 'inserted_at' | 'requested_by' | 'subscription_id' | 'activity_id'>

export type AppCourseSubscription = DatabaseGenerated['public']['Tables']['course_subscriptions']['Row']

export type CourseActivitySchedulesAttendee = DatabaseGenerated['public']['Tables']['course_activity_schedules_attendees']['Row']

export type AppCourseSubscriptionBill = DatabaseGenerated['public']['Tables']['course_subscription_bills']['Row']
export type AppCourseSubscriptionBillItem = DatabaseGenerated['public']['Tables']['course_subscription_bill_items']['Row']

export type AppCourseDocument = DatabaseGenerated['public']['Tables']['course_documents']['Row']
export type CourseDocumentEdit = Omit<AppCourseDocument, 'id' | 'organization_id' | 'inserted_at' | 'updated_at' | 'path'>
export type AppCourseDocumentCombination = DatabaseGenerated['public']['Tables']['course_documents_combinations']['Row']

export type AppCourseRequiredDocument = DatabaseGenerated['public']['Tables']['course_required_documents']['Row']
export type CourseRequiredDocumentEdit = Omit<AppCourseRequiredDocument, 'id' | 'organization_id' | 'inserted_at' | 'updated_at'>
export type AppCourseRequiredDocumentCombination = DatabaseGenerated['public']['Tables']['course_required_documents_combinations']['Row']

export type AppStudentRegistrationRequest = DatabaseGenerated['public']['Tables']['students_registration_requests']['Row']

export type AppOrganizationBillingSettings = DatabaseGenerated['public']['Tables']['organization_billing_settings']['Row']
export type OrganizationBillingSettingsEdit = Omit<AppOrganizationBillingSettings, 'id' | 'organization_id' | 'created_at' | 'updated_at'>

export type NotificationType = DatabaseGenerated['public']['Enums']['notification_type']
export type AppOrganizationNotification = DatabaseGenerated['public']['Tables']['organization_notifications']['Row']

export type AppStripeAccountPaymentMethodSettings = {
  credit_card: {
    payment_method_id: Stripe.PaymentMethod.Type
    enabled: boolean
  },
  klarna: {
    payment_method_id: Stripe.PaymentMethod.Type
    enabled: boolean
  }
}

export type AppOrganizationsStripeAccount = Omit<DatabaseGenerated['public']['Tables']['organizations_stripe_accounts']['Row'], 'payment_methods'> & {
    payment_methods: AppStripeAccountPaymentMethodSettings
}


export type StripeConnectPostBody = {
  org_id: string
}

export type StripeConnectPostResponse = {
    accountId: string
}

export type StripeConnectLinkAccountPostBody = {
  org_id: string
}

export type Database = MergeDeep<DatabaseGenerated, {
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
