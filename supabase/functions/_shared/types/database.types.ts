export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      course_activities: {
        Row: {
          activity_type: number
          allow_requests: boolean
          allow_self_registration: boolean
          course_id: string
          description: string
          id: string
          name: string
          organization_id: string
          price: number
          required: number
          sorting_order: number
        }
        Insert: {
          activity_type: number
          allow_requests?: boolean
          allow_self_registration?: boolean
          course_id: string
          description: string
          id?: string
          name: string
          organization_id: string
          price?: number
          required?: number
          sorting_order?: number
        }
        Update: {
          activity_type?: number
          allow_requests?: boolean
          allow_self_registration?: boolean
          course_id?: string
          description?: string
          id?: string
          name?: string
          organization_id?: string
          price?: number
          required?: number
          sorting_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_activities_activity_type_fkey"
            columns: ["activity_type"]
            isOneToOne: false
            referencedRelation: "course_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activities_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_activities_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activities_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activities_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_activity_schedules: {
        Row: {
          activity_id: string
          assigned_to: string | null
          attendees: string[]
          course_id: string
          end_at: string
          id: string
          organization_id: string
          start_at: string
          status: Database["public"]["Enums"]["schedule_status"]
        }
        Insert: {
          activity_id: string
          assigned_to?: string | null
          attendees?: string[]
          course_id: string
          end_at: string
          id?: string
          organization_id: string
          start_at: string
          status?: Database["public"]["Enums"]["schedule_status"]
        }
        Update: {
          activity_id?: string
          assigned_to?: string | null
          attendees?: string[]
          course_id?: string
          end_at?: string
          id?: string
          organization_id?: string
          start_at?: string
          status?: Database["public"]["Enums"]["schedule_status"]
        }
        Relationships: [
          {
            foreignKeyName: "course_activity_schedules_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "course_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_activity_schedules_attendances: {
        Row: {
          activity_description: string
          activity_name: string
          activity_price: number
          activity_type: number
          course_activity_id: string | null
          course_activity_schedule_id: string | null
          course_subscription_id: string
          id: string
          inserted_at: string
          organization_id: string
          schedule_assigned_to_email: string
          schedule_assigned_to_firstname: string
          schedule_assigned_to_id: string | null
          schedule_assigned_to_lastname: string
          schedule_end_at: string
          schedule_start_at: string
          successfully_completed: boolean
        }
        Insert: {
          activity_description: string
          activity_name: string
          activity_price?: number
          activity_type: number
          course_activity_id?: string | null
          course_activity_schedule_id?: string | null
          course_subscription_id: string
          id?: string
          inserted_at?: string
          organization_id: string
          schedule_assigned_to_email: string
          schedule_assigned_to_firstname: string
          schedule_assigned_to_id?: string | null
          schedule_assigned_to_lastname: string
          schedule_end_at: string
          schedule_start_at: string
          successfully_completed?: boolean
        }
        Update: {
          activity_description?: string
          activity_name?: string
          activity_price?: number
          activity_type?: number
          course_activity_id?: string | null
          course_activity_schedule_id?: string | null
          course_subscription_id?: string
          id?: string
          inserted_at?: string
          organization_id?: string
          schedule_assigned_to_email?: string
          schedule_assigned_to_firstname?: string
          schedule_assigned_to_id?: string | null
          schedule_assigned_to_lastname?: string
          schedule_end_at?: string
          schedule_start_at?: string
          successfully_completed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "course_activity_schedules_atte_course_activity_schedule_id_fkey"
            columns: ["course_activity_schedule_id"]
            isOneToOne: false
            referencedRelation: "course_activity_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_atte_course_activity_schedule_id_fkey"
            columns: ["course_activity_schedule_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["schedule_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendan_schedule_assigned_to_id_fkey"
            columns: ["schedule_assigned_to_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendan_schedule_assigned_to_id_fkey"
            columns: ["schedule_assigned_to_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendan_schedule_assigned_to_id_fkey"
            columns: ["schedule_assigned_to_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendanc_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendanc_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendances_activity_type_fkey"
            columns: ["activity_type"]
            isOneToOne: false
            referencedRelation: "course_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendances_course_activity_id_fkey"
            columns: ["course_activity_id"]
            isOneToOne: false
            referencedRelation: "course_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendances_course_activity_id_fkey"
            columns: ["course_activity_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["activity_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_attendances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_activity_types: {
        Row: {
          id: number
          type: Database["public"]["Enums"]["activity_types"]
        }
        Insert: {
          id?: number
          type: Database["public"]["Enums"]["activity_types"]
        }
        Update: {
          id?: number
          type?: Database["public"]["Enums"]["activity_types"]
        }
        Relationships: []
      }
      course_costs: {
        Row: {
          course_id: string
          description: string
          id: string
          name: string
          organization_id: string
          price: number
        }
        Insert: {
          course_id: string
          description: string
          id?: string
          name: string
          organization_id: string
          price?: number
        }
        Update: {
          course_id?: string
          description?: string
          id?: string
          name?: string
          organization_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_costs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_costs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_costs_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_costs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_costs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_documents: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          last_modified_at: string
          name: string | null
          organization_id: string
          path: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          last_modified_at?: string
          name?: string | null
          organization_id: string
          path: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          last_modified_at?: string
          name?: string | null
          organization_id?: string
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_required_documents: {
        Row: {
          course_id: string
          description: string
          id: string
          name: string
          name_slug: string | null
          organization_id: string
        }
        Insert: {
          course_id: string
          description: string
          id?: string
          name: string
          name_slug?: string | null
          organization_id: string
        }
        Update: {
          course_id?: string
          description?: string
          id?: string
          name?: string
          name_slug?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_required_documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_required_documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_required_documents_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_required_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_required_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_subscription_bill_items: {
        Row: {
          activity_type: number | null
          bill_id: string | null
          course_activity_attendance_id: string | null
          course_cost_id: string | null
          course_subscription_id: string
          description: string
          id: string
          inserted_at: string
          organization_id: string
          price: number
          title: string
        }
        Insert: {
          activity_type?: number | null
          bill_id?: string | null
          course_activity_attendance_id?: string | null
          course_cost_id?: string | null
          course_subscription_id: string
          description: string
          id?: string
          inserted_at?: string
          organization_id: string
          price?: number
          title: string
        }
        Update: {
          activity_type?: number | null
          bill_id?: string | null
          course_activity_attendance_id?: string | null
          course_cost_id?: string | null
          course_subscription_id?: string
          description?: string
          id?: string
          inserted_at?: string
          organization_id?: string
          price?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_bill_item_course_activity_attendance_i_fkey"
            columns: ["course_activity_attendance_id"]
            isOneToOne: false
            referencedRelation: "course_activity_schedules_attendances"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_activity_type_fkey"
            columns: ["activity_type"]
            isOneToOne: false
            referencedRelation: "course_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "course_subscription_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "course_subscription_bills_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_course_cost_id_fkey"
            columns: ["course_cost_id"]
            isOneToOne: false
            referencedRelation: "course_costs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_subscription_bills: {
        Row: {
          bill_number: string
          canceled_at: string | null
          course_subscription_id: string
          created_at: string
          id: string
          organization_id: string
          paid_at: string | null
          ready_to_pay: boolean
          stripe_payment_intent_id: string | null
          total: number
          total_with_vat: number | null
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          bill_number: string
          canceled_at?: string | null
          course_subscription_id: string
          created_at?: string
          id?: string
          organization_id: string
          paid_at?: string | null
          ready_to_pay?: boolean
          stripe_payment_intent_id?: string | null
          total?: number
          total_with_vat?: number | null
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          bill_number?: string
          canceled_at?: string | null
          course_subscription_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          paid_at?: string | null
          ready_to_pay?: boolean
          stripe_payment_intent_id?: string | null
          total?: number
          total_with_vat?: number | null
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_bills_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      course_subscription_documents: {
        Row: {
          course_subscription_id: string
          created_at: string
          id: string
          organization_id: string
          path: string
          required_document_id: string | null
        }
        Insert: {
          course_subscription_id: string
          created_at?: string
          id?: string
          organization_id: string
          path: string
          required_document_id?: string | null
        }
        Update: {
          course_subscription_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          path?: string
          required_document_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_documents_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_documents_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "course_subscription_documents_required_document_id_fkey"
            columns: ["required_document_id"]
            isOneToOne: false
            referencedRelation: "course_required_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscriptions: {
        Row: {
          archived_at: string | null
          costs: number
          course_id: string
          id: string
          inserted_at: string
          organization_id: string
          student_id: string
        }
        Insert: {
          archived_at?: string | null
          costs?: number
          course_id: string
          id?: string
          inserted_at?: string
          organization_id: string
          student_id: string
        }
        Update: {
          archived_at?: string | null
          costs?: number
          course_id?: string
          id?: string
          inserted_at?: string
          organization_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          allow_self_registration: boolean
          create_bill_on_subscription: boolean
          description: string
          id: string
          inserted_at: string
          is_active: boolean
          name: string
          organization_id: string
          type: Database["public"]["Enums"]["course_type"]
        }
        Insert: {
          allow_self_registration?: boolean
          create_bill_on_subscription?: boolean
          description: string
          id?: string
          inserted_at?: string
          is_active?: boolean
          name: string
          organization_id: string
          type: Database["public"]["Enums"]["course_type"]
        }
        Update: {
          allow_self_registration?: boolean
          create_bill_on_subscription?: boolean
          description?: string
          id?: string
          inserted_at?: string
          is_active?: boolean
          name?: string
          organization_id?: string
          type?: Database["public"]["Enums"]["course_type"]
        }
        Relationships: [
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      notifications_jobs: {
        Row: {
          actor_id: string | null
          created_at: string
          id: number
          notification_type: Database["public"]["Enums"]["notification_type"]
          organization_id: string
          payload: Json
          status: Database["public"]["Enums"]["notification_job_status"]
          updated_at: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: number
          notification_type: Database["public"]["Enums"]["notification_type"]
          organization_id: string
          payload: Json
          status: Database["public"]["Enums"]["notification_job_status"]
          updated_at?: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: number
          notification_type?: Database["public"]["Enums"]["notification_type"]
          organization_id?: string
          payload?: Json
          status?: Database["public"]["Enums"]["notification_job_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_jobs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "notifications_jobs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_jobs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_jobs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_billing_settings: {
        Row: {
          bank_account_bic: string
          bank_account_iban: string
          bank_account_name: string
          bank_account_number: string
          created_at: string
          id: string
          invoice_footer: string | null
          invoice_message: string | null
          invoice_subtitle: string | null
          invoice_title: string
          tax_id: string
          template_name: string
          updated_at: string
          vat_exempt: boolean
          vat_rate: number
        }
        Insert: {
          bank_account_bic: string
          bank_account_iban: string
          bank_account_name: string
          bank_account_number: string
          created_at?: string
          id: string
          invoice_footer?: string | null
          invoice_message?: string | null
          invoice_subtitle?: string | null
          invoice_title?: string
          tax_id: string
          template_name?: string
          updated_at?: string
          vat_exempt?: boolean
          vat_rate?: number
        }
        Update: {
          bank_account_bic?: string
          bank_account_iban?: string
          bank_account_name?: string
          bank_account_number?: string
          created_at?: string
          id?: string
          invoice_footer?: string | null
          invoice_message?: string | null
          invoice_subtitle?: string | null
          invoice_title?: string
          tax_id?: string
          template_name?: string
          updated_at?: string
          vat_exempt?: boolean
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "organization_billing_settings_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_billing_settings_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          inserted_at: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          inserted_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      organization_notifications: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          organization_id: string
          payload: Json
          read: boolean
          target_user_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          organization_id: string
          payload: Json
          read?: boolean
          target_user_id: string
          type: Database["public"]["Enums"]["notification_type"]
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          organization_id?: string
          payload?: Json
          read?: boolean
          target_user_id?: string
          type?: Database["public"]["Enums"]["notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "organization_notifications_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "organization_notifications_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_notifications_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "organization_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "organization_notifications_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "organization_notifications_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_notifications_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_city: string
          address_country: string
          address_street: string
          address_zip: string
          allow_self_registration: boolean
          avatar_path: string | null
          description: string | null
          email: string
          handle: string
          id: string
          inserted_at: string
          name: string
          owner_id: string
          phone_number: string
          preferred_language: string
          website: string | null
        }
        Insert: {
          address_city?: string
          address_country?: string
          address_street?: string
          address_zip?: string
          allow_self_registration?: boolean
          avatar_path?: string | null
          description?: string | null
          email?: string
          handle: string
          id?: string
          inserted_at?: string
          name: string
          owner_id: string
          phone_number?: string
          preferred_language?: string
          website?: string | null
        }
        Update: {
          address_city?: string
          address_country?: string
          address_street?: string
          address_zip?: string
          allow_self_registration?: boolean
          avatar_path?: string | null
          description?: string | null
          email?: string
          handle?: string
          id?: string
          inserted_at?: string
          name?: string
          owner_id?: string
          phone_number?: string
          preferred_language?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      organizations_invitations: {
        Row: {
          email: string
          id: string
          inserted_at: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          status: number
        }
        Insert: {
          email: string
          id?: string
          inserted_at?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          status?: number
        }
        Update: {
          email?: string
          id?: string
          inserted_at?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "organizations_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_invitations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations_stripe_accounts: {
        Row: {
          id: string
          payment_methods: Json | null
          stripe_account_id: string
        }
        Insert: {
          id: string
          payment_methods?: Json | null
          stripe_account_id: string
        }
        Update: {
          id?: string
          payment_methods?: Json | null
          stripe_account_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_stripe_accounts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_stripe_accounts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          id?: number
          permission: Database["public"]["Enums"]["app_permission"]
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          id?: number
          permission?: Database["public"]["Enums"]["app_permission"]
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      students: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_street: string | null
          address_zip: string | null
          avatar_path: string | null
          birth_date: string
          created_at: string
          email: string
          firstname: string
          full_name: string | null
          has_a_license: boolean
          id: string
          lastname: string
          organization_id: string
          phone_number: string | null
          user_id: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar_path?: string | null
          birth_date: string
          created_at?: string
          email: string
          firstname: string
          full_name?: string | null
          has_a_license?: boolean
          id?: string
          lastname: string
          organization_id: string
          phone_number?: string | null
          user_id?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_street?: string | null
          address_zip?: string | null
          avatar_path?: string | null
          birth_date?: string
          created_at?: string
          email?: string
          firstname?: string
          full_name?: string | null
          has_a_license?: boolean
          id?: string
          lastname?: string
          organization_id?: string
          phone_number?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      students_registration_requests: {
        Row: {
          address_city: string
          address_country: string
          address_street: string
          address_zip: string
          birth_date: string
          email: string
          firstname: string
          has_a_license: boolean
          id: string
          inserted_at: string
          lastname: string
          organization_id: string
          phone_number: string
          requested_course_id: string | null
          status: number
        }
        Insert: {
          address_city: string
          address_country: string
          address_street: string
          address_zip: string
          birth_date: string
          email: string
          firstname: string
          has_a_license?: boolean
          id?: string
          inserted_at?: string
          lastname: string
          organization_id: string
          phone_number: string
          requested_course_id?: string | null
          status?: number
        }
        Update: {
          address_city?: string
          address_country?: string
          address_street?: string
          address_zip?: string
          birth_date?: string
          email?: string
          firstname?: string
          has_a_license?: boolean
          id?: string
          inserted_at?: string
          lastname?: string
          organization_id?: string
          phone_number?: string
          requested_course_id?: string | null
          status?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_registration_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_registration_requests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "students_registration_requests_requested_course_id_fkey"
            columns: ["requested_course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "students_registration_requests_requested_course_id_fkey"
            columns: ["requested_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_registration_requests_requested_course_id_fkey"
            columns: ["requested_course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_path: string | null
          email: string
          firstname: string | null
          fullname: string | null
          id: string
          lastname: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_path?: string | null
          email: string
          firstname?: string | null
          fullname?: string | null
          id: string
          lastname?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_path?: string | null
          email?: string
          firstname?: string | null
          fullname?: string | null
          id?: string
          lastname?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      course_subscription_bills_view: {
        Row: {
          bill_number: string | null
          canceled_at: string | null
          course_description: string | null
          course_id: string | null
          course_name: string | null
          course_subscription_id: string | null
          created_at: string | null
          id: string | null
          organization_id: string | null
          paid_at: string | null
          ready_to_pay: boolean | null
          student_email: string | null
          student_firstname: string | null
          student_id: string | null
          student_lastname: string | null
          total: number | null
          total_with_vat: number | null
          vat_amount: number | null
          vat_rate: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_bills_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "organizations_schedules_view"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscriptions_view: {
        Row: {
          archived_at: string | null
          costs: number | null
          course_description: string | null
          course_id: string | null
          course_name: string | null
          course_type: Database["public"]["Enums"]["course_type"] | null
          id: string | null
          inserted_at: string | null
          organization_id: string | null
          student_avatar_path: string | null
          student_email: string | null
          student_firstname: string | null
          student_full_name: string | null
          student_id: string | null
          student_lastname: string | null
          student_user_id: string | null
          student_user_status: Database["public"]["Enums"]["user_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations_schedules_view: {
        Row: {
          activity_description: string | null
          activity_id: string | null
          activity_name: string | null
          activity_type: number | null
          assigned_to_avatar_path: string | null
          assigned_to_email: string | null
          assigned_to_firstname: string | null
          assigned_to_fullname: string | null
          assigned_to_lastname: string | null
          course_description: string | null
          course_id: string | null
          course_name: string | null
          schedule_assigned_to: string | null
          schedule_attendees: string[] | null
          schedule_end_at: string | null
          schedule_id: string | null
          schedule_organization_id: string | null
          schedule_start_at: string | null
          schedule_status: Database["public"]["Enums"]["schedule_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "course_activities_activity_type_fkey"
            columns: ["activity_type"]
            isOneToOne: false
            referencedRelation: "course_activity_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["schedule_assigned_to"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["student_user_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["schedule_assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["schedule_assigned_to"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "course_activity_schedules_organization_id_fkey"
            columns: ["schedule_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_organization_id_fkey"
            columns: ["schedule_organization_id"]
            isOneToOne: false
            referencedRelation: "users_organizations_view"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      users_organizations_view: {
        Row: {
          organization_avatar_path: string | null
          organization_description: string | null
          organization_handle: string | null
          organization_id: string | null
          organization_membership_inserted_at: string | null
          organization_name: string | null
          organization_preferred_language: string | null
          organization_role: Database["public"]["Enums"]["app_role"] | null
          user_email: string | null
          user_firstname: string | null
          user_fullname: string | null
          user_id: string | null
          user_lastname: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_attendee_to_schedule: {
        Args: { course_schedule_id: string; course_subscription_id: string }
        Returns: boolean
      }
      are_users_in_same_organization: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: boolean
      }
      authorize: {
        Args: {
          org_id: string
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      check_subscription_organization: {
        Args: { course_id: string; org_id: string; student_id: string }
        Returns: boolean
      }
      course_allows_self_registration: {
        Args: { course_id: string }
        Returns: boolean
      }
      course_subscription_belongs_to_student_user: {
        Args: { course_subscription_id: string }
        Returns: boolean
      }
      generate_bill_for_subscription: {
        Args: { subscription_id: string }
        Returns: string
      }
      is_bill_active: {
        Args: { bill_id: string }
        Returns: boolean
      }
      is_main_owner: {
        Args: { org_id: string }
        Returns: boolean
      }
      is_schedule_active: {
        Args: { schedule_id: string }
        Returns: boolean
      }
      is_subscription_active: {
        Args: { subscription_id: string }
        Returns: boolean
      }
      remove_attendee_from_schedule: {
        Args: { course_schedule_id: string; course_subscription_id: string }
        Returns: boolean
      }
      remove_subscription_from_active_schedules: {
        Args: { course_subscription_id: string }
        Returns: undefined
      }
      should_course_create_bill_on_subscription: {
        Args: { course_id: string }
        Returns: boolean
      }
      slugify: {
        Args: { value: string }
        Returns: string
      }
      validate_course_subscription_before_archiving: {
        Args: { cs_id: string }
        Returns: boolean
      }
    }
    Enums: {
      activity_types: "THEORY" | "PRACTICE" | "EXAM" | "OTHER"
      app_permission:
        | "users.read"
        | "users.update"
        | "users.delete"
        | "organizations.read"
        | "organizations.create"
        | "organizations.update"
        | "organizations.delete"
        | "organizations_stripe_accounts.read"
        | "organizations_stripe_accounts.create"
        | "organizations_stripe_accounts.update"
        | "organization_members.read"
        | "organization_members.create"
        | "organization_members.update"
        | "organization_members.delete"
        | "organization_invitations.read"
        | "organization_invitations.create"
        | "organization_invitations.update"
        | "organization_invitations.delete"
        | "students.read"
        | "students.create"
        | "students.update"
        | "students.delete"
        | "students_registration_requests.read"
        | "students_registration_requests.create"
        | "students_registration_requests.update"
        | "students_registration_requests.delete"
        | "courses.read"
        | "courses.create"
        | "courses.update"
        | "courses.delete"
        | "course_documents.read"
        | "course_documents.create"
        | "course_documents.update"
        | "course_documents.delete"
        | "course_required_documents.read"
        | "course_required_documents.create"
        | "course_required_documents.update"
        | "course_required_documents.delete"
        | "course_subscriptions.read"
        | "course_subscriptions.create"
        | "course_subscriptions.update"
        | "course_subscriptions.delete"
        | "course_subscription_documents.read"
        | "course_subscription_documents.create"
        | "course_subscription_documents.update"
        | "course_subscription_documents.delete"
        | "course_activities.read"
        | "course_activities.create"
        | "course_activities.update"
        | "course_activities.delete"
        | "course_activity_schedules_attendances.read"
        | "course_activity_schedules_attendances.create"
        | "course_activity_schedules_attendances.update"
        | "course_activity_schedules_attendances.delete"
        | "course_costs.read"
        | "course_costs.create"
        | "course_costs.update"
        | "course_costs.delete"
        | "course_activity_schedules.read"
        | "course_activity_schedules.create"
        | "course_activity_schedules.update"
        | "course_activity_schedules.delete"
        | "course_subscription_bills.read"
        | "course_subscription_bills.create"
        | "course_subscription_bills.update"
        | "course_subscription_bills.delete"
        | "course_subscription_bill_items.read"
        | "course_subscription_bill_items.create"
        | "course_subscription_bill_items.update"
        | "course_subscription_bill_items.delete"
        | "organization_billing_settings.read"
        | "organization_billing_settings.create"
        | "organization_billing_settings.update"
        | "organization_billing_settings.delete"
      app_role: "owner" | "manager" | "teacher" | "student"
      course_type:
        | "AM"
        | "A1"
        | "A2"
        | "A"
        | "B"
        | "BE"
        | "C1"
        | "C1E"
        | "C"
        | "CE"
        | "D1"
        | "D1E"
        | "D"
        | "DE"
        | "L"
        | "T"
      notification_job_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
      notification_type:
        | "course_subscriptions.inserted"
        | "course_activity_schedules.assigned_to.updated"
        | "course_activity_schedules.attendees.updated"
        | "course_activity_schedules.status.updated"
        | "course_activity_schedules.date.updated"
        | "course_activity_schedules.deleted"
        | "course_activity_schedules_attendances.inserted"
        | "course_subscription_bills.paid_at.updated"
        | "course_subscription_bills.ready_to_pay.updated"
        | "course_subscription_bills.canceled_at.updated"
        | "students_registration_requests.inserted"
      schedule_status: "PLANNED" | "COMPLETED" | "CANCELED"
      schedule_type: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY"
      user_status: "ONLINE" | "OFFLINE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prefixes_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: {
        Args: { name: string }
        Returns: string
      }
      filename: {
        Args: { name: string }
        Returns: string
      }
      foldername: {
        Args: { name: string }
        Returns: string[]
      }
      get_level: {
        Args: { name: string }
        Returns: number
      }
      get_prefix: {
        Args: { name: string }
        Returns: string
      }
      get_prefixes: {
        Args: { name: string }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      activity_types: ["THEORY", "PRACTICE", "EXAM", "OTHER"],
      app_permission: [
        "users.read",
        "users.update",
        "users.delete",
        "organizations.read",
        "organizations.create",
        "organizations.update",
        "organizations.delete",
        "organizations_stripe_accounts.read",
        "organizations_stripe_accounts.create",
        "organizations_stripe_accounts.update",
        "organization_members.read",
        "organization_members.create",
        "organization_members.update",
        "organization_members.delete",
        "organization_invitations.read",
        "organization_invitations.create",
        "organization_invitations.update",
        "organization_invitations.delete",
        "students.read",
        "students.create",
        "students.update",
        "students.delete",
        "students_registration_requests.read",
        "students_registration_requests.create",
        "students_registration_requests.update",
        "students_registration_requests.delete",
        "courses.read",
        "courses.create",
        "courses.update",
        "courses.delete",
        "course_documents.read",
        "course_documents.create",
        "course_documents.update",
        "course_documents.delete",
        "course_required_documents.read",
        "course_required_documents.create",
        "course_required_documents.update",
        "course_required_documents.delete",
        "course_subscriptions.read",
        "course_subscriptions.create",
        "course_subscriptions.update",
        "course_subscriptions.delete",
        "course_subscription_documents.read",
        "course_subscription_documents.create",
        "course_subscription_documents.update",
        "course_subscription_documents.delete",
        "course_activities.read",
        "course_activities.create",
        "course_activities.update",
        "course_activities.delete",
        "course_activity_schedules_attendances.read",
        "course_activity_schedules_attendances.create",
        "course_activity_schedules_attendances.update",
        "course_activity_schedules_attendances.delete",
        "course_costs.read",
        "course_costs.create",
        "course_costs.update",
        "course_costs.delete",
        "course_activity_schedules.read",
        "course_activity_schedules.create",
        "course_activity_schedules.update",
        "course_activity_schedules.delete",
        "course_subscription_bills.read",
        "course_subscription_bills.create",
        "course_subscription_bills.update",
        "course_subscription_bills.delete",
        "course_subscription_bill_items.read",
        "course_subscription_bill_items.create",
        "course_subscription_bill_items.update",
        "course_subscription_bill_items.delete",
        "organization_billing_settings.read",
        "organization_billing_settings.create",
        "organization_billing_settings.update",
        "organization_billing_settings.delete",
      ],
      app_role: ["owner", "manager", "teacher", "student"],
      course_type: [
        "AM",
        "A1",
        "A2",
        "A",
        "B",
        "BE",
        "C1",
        "C1E",
        "C",
        "CE",
        "D1",
        "D1E",
        "D",
        "DE",
        "L",
        "T",
      ],
      notification_job_status: ["PENDING", "PROCESSING", "COMPLETED", "FAILED"],
      notification_type: [
        "course_subscriptions.inserted",
        "course_activity_schedules.assigned_to.updated",
        "course_activity_schedules.attendees.updated",
        "course_activity_schedules.status.updated",
        "course_activity_schedules.date.updated",
        "course_activity_schedules.deleted",
        "course_activity_schedules_attendances.inserted",
        "course_subscription_bills.paid_at.updated",
        "course_subscription_bills.ready_to_pay.updated",
        "course_subscription_bills.canceled_at.updated",
        "students_registration_requests.inserted",
      ],
      schedule_status: ["PLANNED", "COMPLETED", "CANCELED"],
      schedule_type: ["ONCE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"],
      user_status: ["ONLINE", "OFFLINE"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS"],
    },
  },
} as const

