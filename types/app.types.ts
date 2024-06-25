import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";

export type UserRole = DatabaseGenerated['public']['Enums']['app_role']
export type AppUser = DatabaseGenerated['public']['Tables']['users']['Row']
export type AppUserWithRole = DatabaseGenerated['public']['Tables']['users']['Row'] & { role: UserRole }
export type AppOrganisation = DatabaseGenerated['public']['Tables']['organisations']['Row']
export type AppStudent = DatabaseGenerated['public']['Tables']['students']['Row']
export type AppCourse = DatabaseGenerated['public']['Tables']['courses']['Row']

export type Database = MergeDeep<DatabaseGenerated,   {
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
  }>;


