
export interface ScanResult {
  url: string;
  riskScore: number; // 0 to 100
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  analysis: {
    heuristics: string[];
    reputation: string;
    sslDns: string;
    explanation: string;
  };
  details: {
    hasIpAddress: boolean;
    isLongUrl: boolean;
    excessiveSubdomains: boolean;
    unusualTld: boolean;
    suspiciousKeywords: string[];
  };
}

export interface SecurityMetric {
  label: string;
  value: string | number;
  status: 'secure' | 'warning' | 'danger';
}
