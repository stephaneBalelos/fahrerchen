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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
        ]
      }
      course_activity_attendances: {
        Row: {
          activity_schedule_id: string | null
          course_activity_id: string
          course_subscription_id: string
          id: string
          organization_id: string
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          activity_schedule_id?: string | null
          course_activity_id: string
          course_subscription_id: string
          id?: string
          organization_id: string
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          activity_schedule_id?: string | null
          course_activity_id?: string
          course_subscription_id?: string
          id?: string
          organization_id?: string
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "course_activity_attendances_activity_schedule_id_fkey"
            columns: ["activity_schedule_id"]
            isOneToOne: false
            referencedRelation: "course_activity_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_activity_schedule_id_fkey"
            columns: ["activity_schedule_id"]
            isOneToOne: false
            referencedRelation: "course_activity_schedules_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_course_activity_id_fkey"
            columns: ["course_activity_id"]
            isOneToOne: false
            referencedRelation: "course_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: false
            referencedRelation: "course_subscriptions_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscription_bill_history: {
        Row: {
          activity: Database["public"]["Enums"]["bill_history_action_type"]
          actor_id: string | null
          bill_id: string
          id: string
          inserted_at: string
          item_description: string
          item_price: number
          organization_id: string
        }
        Insert: {
          activity: Database["public"]["Enums"]["bill_history_action_type"]
          actor_id?: string | null
          bill_id: string
          id?: string
          inserted_at?: string
          item_description: string
          item_price: number
          organization_id: string
        }
        Update: {
          activity?: Database["public"]["Enums"]["bill_history_action_type"]
          actor_id?: string | null
          bill_id?: string
          id?: string
          inserted_at?: string
          item_description?: string
          item_price?: number
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_bill_history_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_history_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "course_subscription_bills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_history_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "course_subscription_bills_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bill_history_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscription_bill_items: {
        Row: {
          bill_id: string
          course_activity_attendance_id: string | null
          course_activity_id: string | null
          description: string
          id: string
          inserted_at: string
          organization_id: string
          price: number
        }
        Insert: {
          bill_id: string
          course_activity_attendance_id?: string | null
          course_activity_id?: string | null
          description: string
          id?: string
          inserted_at?: string
          organization_id: string
          price?: number
        }
        Update: {
          bill_id?: string
          course_activity_attendance_id?: string | null
          course_activity_id?: string | null
          description?: string
          id?: string
          inserted_at?: string
          organization_id?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_bill_item_course_activity_attendance_i_fkey"
            columns: ["course_activity_attendance_id"]
            isOneToOne: true
            referencedRelation: "course_activity_attendances"
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
            foreignKeyName: "course_subscription_bill_items_course_activity_id_fkey"
            columns: ["course_activity_id"]
            isOneToOne: false
            referencedRelation: "course_activities"
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscription_bills: {
        Row: {
          canceled_at: string | null
          course_subscription_id: string
          created_at: string
          id: string
          organization_id: string
          paid_at: string | null
          ready_to_pay: boolean
          stripe_payment_intent_id: string | null
          total: number
        }
        Insert: {
          canceled_at?: string | null
          course_subscription_id: string
          created_at?: string
          id?: string
          organization_id: string
          paid_at?: string | null
          ready_to_pay?: boolean
          stripe_payment_intent_id?: string | null
          total?: number
        }
        Update: {
          canceled_at?: string | null
          course_subscription_id?: string
          created_at?: string
          id?: string
          organization_id?: string
          paid_at?: string | null
          ready_to_pay?: boolean
          stripe_payment_intent_id?: string | null
          total?: number
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_view"
            referencedColumns: ["id"]
          },
        ]
      }
      course_types: {
        Row: {
          description: string | null
          id: number
          type: Database["public"]["Enums"]["course_type"]
        }
        Insert: {
          description?: string | null
          id?: number
          type: Database["public"]["Enums"]["course_type"]
        }
        Update: {
          description?: string | null
          id?: number
          type?: Database["public"]["Enums"]["course_type"]
        }
        Relationships: []
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
          type: number
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
          type: number
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
          type?: number
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "course_types"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_street: string | null
          address_zip: string | null
          allow_self_registration: boolean
          avatar_path: string | null
          description: string | null
          email: string | null
          id: string
          inserted_at: string
          name: string
          owner_id: string
          phone_number: string | null
          preferred_language: string
          website: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_street?: string | null
          address_zip?: string | null
          allow_self_registration?: boolean
          avatar_path?: string | null
          description?: string | null
          email?: string | null
          id?: string
          inserted_at?: string
          name: string
          owner_id: string
          phone_number?: string | null
          preferred_language?: string
          website?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_street?: string | null
          address_zip?: string | null
          allow_self_registration?: boolean
          avatar_path?: string | null
          description?: string | null
          email?: string | null
          id?: string
          inserted_at?: string
          name?: string
          owner_id?: string
          phone_number?: string | null
          preferred_language?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_registration_requests_requested_course_id_fkey"
            columns: ["requested_course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
        }
        Insert: {
          avatar_path?: string | null
          email: string
          firstname?: string | null
          fullname?: string | null
          id: string
          lastname?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Update: {
          avatar_path?: string | null
          email?: string
          firstname?: string | null
          fullname?: string | null
          id?: string
          lastname?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Relationships: []
      }
    }
    Views: {
      course_activity_schedules_view: {
        Row: {
          activity_description: string | null
          activity_id: string | null
          activity_name: string | null
          activity_type: number | null
          assigned_to: string | null
          assigned_to_email: string | null
          assigned_to_firstname: string | null
          assigned_to_fullname: string | null
          assigned_to_lastname: string | null
          course_description: string | null
          course_id: string | null
          course_name: string | null
          end_at: string | null
          id: string | null
          organization_id: string | null
          start_at: string | null
          status: Database["public"]["Enums"]["schedule_status"] | null
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
            foreignKeyName: "course_activity_schedules_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "course_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
        ]
      }
      course_subscription_bill_items_view: {
        Row: {
          activity_description: string | null
          activity_name: string | null
          bill_id: string | null
          items:
            | Database["public"]["Tables"]["course_subscription_bill_items"]["Row"][]
            | null
          total: number | null
        }
        Relationships: [
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
        ]
      }
      course_subscription_bills_view: {
        Row: {
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
          stripe_payment_intent_id: string | null
          student_email: string | null
          student_firstname: string | null
          student_id: string | null
          student_lastname: string | null
          total: number | null
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_view"
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
          id: string | null
          organization_id: string | null
          student_email: string | null
          student_firstname: string | null
          student_id: string | null
          student_lastname: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students_view"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members_view: {
        Row: {
          id: string | null
          inserted_at: string | null
          organization_id: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          user_avatar_path: string | null
          user_email: string | null
          user_firstname: string | null
          user_fullname: string | null
          user_id: string | null
          user_lastname: string | null
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations_view: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_street: string | null
          address_zip: string | null
          allow_self_registration: boolean | null
          id: string | null
          name: string | null
          organization_courses: Json | null
          owner_email: string | null
          owner_firstname: string | null
          owner_id: string | null
          owner_lastname: string | null
          preferred_language: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      students_view: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_street: string | null
          address_zip: string | null
          avatar_path: string | null
          birth_date: string | null
          created_at: string | null
          email: string | null
          firstname: string | null
          has_a_license: boolean | null
          id: string | null
          lastname: string | null
          organization_id: string | null
          phone_number: string | null
          subscriptions_count: number | null
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
            referencedRelation: "organizations_view"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      are_users_in_same_organization: {
        Args: {
          user_id_1: string
          user_id_2: string
        }
        Returns: boolean
      }
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
          org_id: string
        }
        Returns: boolean
      }
      can_update_bill: {
        Args: {
          bill_id: string
        }
        Returns: boolean
      }
      create_student: {
        Args: {
          firstname: string
          lastname: string
          email: string
          birth_date: string
          organization_id: string
        }
        Returns: {
          address_city: string | null
          address_country: string | null
          address_street: string | null
          address_zip: string | null
          avatar_path: string | null
          birth_date: string
          created_at: string
          email: string
          firstname: string
          has_a_license: boolean
          id: string
          lastname: string
          organization_id: string
          phone_number: string | null
          user_id: string | null
        }
      }
      is_main_owner: {
        Args: {
          org_id: string
        }
        Returns: boolean
      }
      is_subscription_active: {
        Args: {
          subscription_id: string
        }
        Returns: boolean
      }
      send_transactional_email: {
        Args: {
          message_id: string
          payload: Json
        }
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
        | "course_subscriptions.read"
        | "course_subscriptions.create"
        | "course_subscriptions.update"
        | "course_subscriptions.delete"
        | "course_activities.read"
        | "course_activities.create"
        | "course_activities.update"
        | "course_activities.delete"
        | "course_activity_schedules.read"
        | "course_activity_schedules.create"
        | "course_activity_schedules.update"
        | "course_activity_schedules.delete"
        | "course_activity_attendances.read"
        | "course_activity_attendances.create"
        | "course_activity_attendances.update"
        | "course_activity_attendances.delete"
        | "course_subscription_bills.read"
        | "course_subscription_bills.create"
        | "course_subscription_bills.update"
        | "course_subscription_bills.delete"
      app_role: "owner" | "manager" | "teacher" | "student"
      attendance_status: "REGISTERED" | "ATTENDED" | "CANCELED"
      bill_history_action_type:
        | "ITEM_ADDED"
        | "ITEM_REMOVED"
        | "ITEM_UPDATED"
        | "BILL_READY_TO_PAY"
        | "BILL_PAID"
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
          updated_at?: string | null
        }
        Relationships: []
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
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

