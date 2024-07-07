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
          course_id: string
          description: string
          id: string
          name: string
          organisation_id: string
          price: number
          requirement_id: string | null
        }
        Insert: {
          course_id: string
          description: string
          id?: string
          name: string
          organisation_id: string
          price?: number
          requirement_id?: string | null
        }
        Update: {
          course_id?: string
          description?: string
          id?: string
          name?: string
          organisation_id?: string
          price?: number
          requirement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_activities_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activities_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activities_requirement_id_fkey"
            columns: ["requirement_id"]
            isOneToOne: false
            referencedRelation: "course_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      course_activity_attendances: {
        Row: {
          activity_schedule_id: string | null
          attended_at: string | null
          course_activity: string
          course_id: string
          course_subscription_id: string
          id: string
          organisation_id: string
          student_id: string
        }
        Insert: {
          activity_schedule_id?: string | null
          attended_at?: string | null
          course_activity: string
          course_id: string
          course_subscription_id: string
          id?: string
          organisation_id: string
          student_id: string
        }
        Update: {
          activity_schedule_id?: string | null
          attended_at?: string | null
          course_activity?: string
          course_id?: string
          course_subscription_id?: string
          id?: string
          organisation_id?: string
          student_id?: string
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
            foreignKeyName: "course_activity_attendances_course_activity_fkey"
            columns: ["course_activity"]
            isOneToOne: false
            referencedRelation: "course_activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
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
            foreignKeyName: "course_activity_attendances_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_attendances_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      course_activity_schedules: {
        Row: {
          activity_id: string
          assigned_to: string | null
          day_of_week: number
          end_at: string
          id: string
          organisation_id: string
          repeat: boolean
          start_at: string
        }
        Insert: {
          activity_id: string
          assigned_to?: string | null
          day_of_week: number
          end_at: string
          id?: string
          organisation_id: string
          repeat?: boolean
          start_at: string
        }
        Update: {
          activity_id?: string
          assigned_to?: string | null
          day_of_week?: number
          end_at?: string
          id?: string
          organisation_id?: string
          repeat?: boolean
          start_at?: string
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
            referencedRelation: "organisation_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_activity_schedules_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      course_requirements: {
        Row: {
          course_id: string
          description: string | null
          id: string
          name: string
          organisation_id: string
          required: number
          requirements_type: number
        }
        Insert: {
          course_id: string
          description?: string | null
          id?: string
          name: string
          organisation_id: string
          required: number
          requirements_type: number
        }
        Update: {
          course_id?: string
          description?: string | null
          id?: string
          name?: string
          organisation_id?: string
          required?: number
          requirements_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_requirements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_requirements_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_requirements_requirements_type_fkey"
            columns: ["requirements_type"]
            isOneToOne: false
            referencedRelation: "course_requirements_types"
            referencedColumns: ["id"]
          },
        ]
      }
      course_requirements_types: {
        Row: {
          description: string
          id: number
          name: string
          type: Database["public"]["Enums"]["requirements_types"]
        }
        Insert: {
          description: string
          id?: number
          name: string
          type: Database["public"]["Enums"]["requirements_types"]
        }
        Update: {
          description?: string
          id?: number
          name?: string
          type?: Database["public"]["Enums"]["requirements_types"]
        }
        Relationships: []
      }
      course_subscription_bills: {
        Row: {
          amount: number
          course_subscription_id: string
          id: string
          organisation_id: string
          paid_at: string | null
        }
        Insert: {
          amount?: number
          course_subscription_id: string
          id?: string
          organisation_id: string
          paid_at?: string | null
        }
        Update: {
          amount?: number
          course_subscription_id?: string
          id?: string
          organisation_id?: string
          paid_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_subscription_bills_course_subscription_id_fkey"
            columns: ["course_subscription_id"]
            isOneToOne: true
            referencedRelation: "course_subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_subscription_bills_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
          organisation_id: string
          student_id: string
        }
        Insert: {
          archived_at?: string | null
          costs?: number
          course_id: string
          id?: string
          inserted_at?: string
          organisation_id: string
          student_id: string
        }
        Update: {
          archived_at?: string | null
          costs?: number
          course_id?: string
          id?: string
          inserted_at?: string
          organisation_id?: string
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
            foreignKeyName: "course_subscriptions_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
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
      course_types: {
        Row: {
          description: string
          id: number
          type: Database["public"]["Enums"]["course_type"]
        }
        Insert: {
          description: string
          id?: number
          type: Database["public"]["Enums"]["course_type"]
        }
        Update: {
          description?: string
          id?: number
          type?: Database["public"]["Enums"]["course_type"]
        }
        Relationships: []
      }
      courses: {
        Row: {
          description: string
          id: string
          inserted_at: string
          name: string
          organisation_id: string
          type: number
        }
        Insert: {
          description: string
          id?: string
          inserted_at?: string
          name: string
          organisation_id: string
          type: number
        }
        Update: {
          description?: string
          id?: string
          inserted_at?: string
          name?: string
          organisation_id?: string
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "courses_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
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
      organisation_members: {
        Row: {
          id: string
          inserted_at: string
          organisation_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          organisation_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          inserted_at?: string
          organisation_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_members_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organisations: {
        Row: {
          id: string
          inserted_at: string
          name: string
          owner_id: string
        }
        Insert: {
          id?: string
          inserted_at?: string
          name: string
          owner_id: string
        }
        Update: {
          id?: string
          inserted_at?: string
          name?: string
          owner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
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
          birth_date: string
          email: string
          firstname: string
          id: string
          lastname: string
          organisation_id: string
        }
        Insert: {
          birth_date: string
          email: string
          firstname: string
          id?: string
          lastname: string
          organisation_id: string
        }
        Update: {
          birth_date?: string
          email?: string
          firstname?: string
          id?: string
          lastname?: string
          organisation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_roles_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string
          firstname: string | null
          id: string
          lastname: string | null
          status: Database["public"]["Enums"]["user_status"] | null
        }
        Insert: {
          email: string
          firstname?: string | null
          id: string
          lastname?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Update: {
          email?: string
          firstname?: string | null
          id?: string
          lastname?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_roles_view: {
        Row: {
          email: string | null
          firstname: string | null
          id: string | null
          lastname: string | null
          role: Database["public"]["Enums"]["app_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
          org_id: string
        }
        Returns: boolean
      }
      create_student: {
        Args: {
          firstname: string
          lastname: string
          email: string
          birth_date: string
          organisation_id: string
        }
        Returns: {
          birth_date: string
          email: string
          firstname: string
          id: string
          lastname: string
          organisation_id: string
        }
      }
    }
    Enums: {
      app_permission:
        | "users.read"
        | "users.update"
        | "users.delete"
        | "organisations.read"
        | "organisations.update"
        | "organisations.delete"
        | "organisation_members.read"
        | "organisation_members.update"
        | "organisation_members.delete"
        | "students.read"
        | "students.create"
        | "students.update"
        | "students.delete"
        | "courses.read"
        | "courses.create"
        | "courses.update"
        | "courses.delete"
        | "course_subscriptions.read"
        | "course_subscriptions.create"
        | "course_subscriptions.update"
        | "course_subscriptions.delete"
        | "course_requirements.read"
        | "course_requirements.create"
        | "course_requirements.update"
        | "course_requirements.delete"
        | "course_activities.read"
        | "course_activities.create"
        | "course_activities.update"
        | "course_activities.delete"
        | "course_activity_attendances.read"
        | "course_activity_attendances.create"
        | "course_activity_attendances.update"
        | "course_activity_attendances.delete"
        | "course_subscription_bills.read"
        | "course_subscription_bills.create"
        | "course_subscription_bills.update"
        | "course_subscription_bills.delete"
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
      requirements_types: "THEORY" | "PRACTICE" | "EXAM" | "OTHER"
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

