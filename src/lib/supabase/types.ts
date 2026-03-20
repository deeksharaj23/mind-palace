export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      nodes: {
        Row: {
          id: string;
          type: "thought" | "journal" | "dream" | "mood" | "health";
          content: string | null;
          tags: string[];
          timestamp: string;
          emotion: string | null;
          intensity: number | null;
          embedding?: number[] | null;
        };
        Insert: {
          id?: string;
          type: "thought" | "journal" | "dream" | "mood" | "health";
          content?: string | null;
          tags?: string[];
          timestamp?: string;
          emotion?: string | null;
          intensity?: number | null;
          embedding?: number[] | null;
        };
        Update: {
          id?: string;
          type?: "thought" | "journal" | "dream" | "mood" | "health";
          content?: string | null;
          tags?: string[];
          timestamp?: string;
          emotion?: string | null;
          intensity?: number | null;
          embedding?: number[] | null;
        };
      };
    };
  };
}
