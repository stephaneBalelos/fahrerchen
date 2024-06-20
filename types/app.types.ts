import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";

export type UserRole = DatabaseGenerated['public']['Enums']['app_role']
export type AppOrganisation = DatabaseGenerated['public']['Tables']['organisations']['Row']

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


