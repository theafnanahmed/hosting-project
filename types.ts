
export interface Project {
  id: string;
  name: string;
  repo: string;
  status: 'online' | 'building' | 'failed' | 'idle';
  url: string;
  lastDeployed: string;
  framework: 'react' | 'nextjs' | 'vue' | 'static';
  traffic: number;
}

export interface BuildLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

export interface AIAdvice {
  title: string;
  content: string;
  impact: 'high' | 'medium' | 'low';
}
