export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_credentials: {
        Row: {
          created_at: string
          email: string
          id: string
          password: string
          password_hash: string | null
          salt: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password: string
          password_hash?: string | null
          salt?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password?: string
          password_hash?: string | null
          salt?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      admin_face_images: {
        Row: {
          created_at: string
          face_descriptor: Json
          face_descriptor_encrypted: string | null
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          face_descriptor: Json
          face_descriptor_encrypted?: string | null
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          face_descriptor?: Json
          face_descriptor_encrypted?: string | null
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      cars: {
        Row: {
          abs_ebd_esc: boolean | null
          adas_features: string[] | null
          airbags: number | null
          body_type: string
          boot_space_liters: number | null
          brand: string
          climate_control: string | null
          connected_car_tech: string[] | null
          created_at: string
          dealer_contact: string | null
          dealer_name: string | null
          description: string | null
          digital_cluster: boolean | null
          doors: number | null
          driver_aids: string[] | null
          engine_capacity_cc: number | null
          engine_capacity_liters: number | null
          engine_size: number | null
          features: string[] | null
          fuel_economy_city: number | null
          fuel_economy_highway: number | null
          fuel_type: string
          ground_clearance_mm: number | null
          hill_assist: boolean | null
          horsepower: number | null
          id: string
          image_url: string | null
          images: string[] | null
          infotainment_system: string | null
          make: string
          mileage_kmpl: number | null
          mileage_range_km: number | null
          model: string
          ncap_rating: number | null
          power_bhp: number | null
          power_kw: number | null
          power_ps: number | null
          price: number
          safety_rating: number | null
          seat_material: string | null
          seating_capacity: number | null
          seats: number | null
          service_cost_per_year: number | null
          torque_nm: number | null
          traction_control: boolean | null
          transmission: string
          updated_at: string
          warranty_years: number | null
          year: number
        }
        Insert: {
          abs_ebd_esc?: boolean | null
          adas_features?: string[] | null
          airbags?: number | null
          body_type: string
          boot_space_liters?: number | null
          brand?: string
          climate_control?: string | null
          connected_car_tech?: string[] | null
          created_at?: string
          dealer_contact?: string | null
          dealer_name?: string | null
          description?: string | null
          digital_cluster?: boolean | null
          doors?: number | null
          driver_aids?: string[] | null
          engine_capacity_cc?: number | null
          engine_capacity_liters?: number | null
          engine_size?: number | null
          features?: string[] | null
          fuel_economy_city?: number | null
          fuel_economy_highway?: number | null
          fuel_type: string
          ground_clearance_mm?: number | null
          hill_assist?: boolean | null
          horsepower?: number | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          infotainment_system?: string | null
          make: string
          mileage_kmpl?: number | null
          mileage_range_km?: number | null
          model: string
          ncap_rating?: number | null
          power_bhp?: number | null
          power_kw?: number | null
          power_ps?: number | null
          price: number
          safety_rating?: number | null
          seat_material?: string | null
          seating_capacity?: number | null
          seats?: number | null
          service_cost_per_year?: number | null
          torque_nm?: number | null
          traction_control?: boolean | null
          transmission: string
          updated_at?: string
          warranty_years?: number | null
          year: number
        }
        Update: {
          abs_ebd_esc?: boolean | null
          adas_features?: string[] | null
          airbags?: number | null
          body_type?: string
          boot_space_liters?: number | null
          brand?: string
          climate_control?: string | null
          connected_car_tech?: string[] | null
          created_at?: string
          dealer_contact?: string | null
          dealer_name?: string | null
          description?: string | null
          digital_cluster?: boolean | null
          doors?: number | null
          driver_aids?: string[] | null
          engine_capacity_cc?: number | null
          engine_capacity_liters?: number | null
          engine_size?: number | null
          features?: string[] | null
          fuel_economy_city?: number | null
          fuel_economy_highway?: number | null
          fuel_type?: string
          ground_clearance_mm?: number | null
          hill_assist?: boolean | null
          horsepower?: number | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          infotainment_system?: string | null
          make?: string
          mileage_kmpl?: number | null
          mileage_range_km?: number | null
          model?: string
          ncap_rating?: number | null
          power_bhp?: number | null
          power_kw?: number | null
          power_ps?: number | null
          price?: number
          safety_rating?: number | null
          seat_material?: string | null
          seating_capacity?: number | null
          seats?: number | null
          service_cost_per_year?: number | null
          torque_nm?: number | null
          traction_control?: boolean | null
          transmission?: string
          updated_at?: string
          warranty_years?: number | null
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          car_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          car_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          car_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_car_id_fkey"
            columns: ["car_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrypt_biometric_data: {
        Args: { encrypted_data: string }
        Returns: Json
      }
      encrypt_biometric_data: {
        Args: { data: Json }
        Returns: string
      }
      hash_password: {
        Args: { password: string } | { password: string; salt?: string }
        Returns: string
      }
      verify_admin_credentials: {
        Args: { p_email: string; p_password: string }
        Returns: boolean
      }
      verify_admin_credentials_simple: {
        Args: { p_email: string; p_password: string }
        Returns: boolean
      }
      verify_password: {
        Args: { hash: string; password: string }
        Returns: boolean
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
  public: {
    Enums: {},
  },
} as const
