export interface AdminTelemetry {
  total_users: number;
  total_agencies: number;
  trips_generated: number;
  api_latency: string;
  tokens_used: string;
  cpu_load: string;
  memory_used: string;
}

export interface AdminUserRecord {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status?: string;
  joined?: string;
  created_at?: string;
}

export interface AIPromptConfig {
  promptTemplate: string;
  temperature: number;
  modelType: string;
}
