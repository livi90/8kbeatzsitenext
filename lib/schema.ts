export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      beats: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          genere: string;
          download_url: string;
          image_url: string | null;
          bpm: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          genere: string;
          download_url: string;
          image_url: string;
          bpm: number;
        };
        Update: {
          id?: number;
          name?: string;
          genere?: string;
          download_url?: string;
          image_url?: string;
          bpm?: number;
        };
      };
      packs: {
        Row: {
          id: number;
          created_at: string;
          name: string;
          description: string;
          download_url: string;
        };
        Insert: {
          id?: number;
          created_at?: string;
          name: string;
          description: string;
          download_url: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string;
          download_url?: string;
        };
      };
      ads: {
        Row: {
          id: number;
          created_at: string;
          image_url: string;
          ad_link: string;
          views: number;
          clicks: number;
        };
        Insert: {
          id?: number;
          created_at?: string;
          image_url: string;
          ad_link: string;
        };
        Update: {
          id?: number;
          image_url: string;
          ad_link: string;
          views: number;
          clicks: number;
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        [_ in never]: never;
      };
      CompositeTypes: {
        [_ in never]: never;
      };
    };
  };
}
