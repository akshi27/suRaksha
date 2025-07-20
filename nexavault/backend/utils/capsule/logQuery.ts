// src/utils/capsule/logQuery.ts

type CapsuleLog = {
  serviceName: string;
  capsuleType: 'real' | 'demo';
  query: string;
  response: string;
  timestamp?: string;
};

// In-memory log store (for demo/local testing)
const capsuleLogs: CapsuleLog[] = [];

export async function logCapsuleQuery(log: CapsuleLog): Promise<void> {
  capsuleLogs.push({
    ...log,
    timestamp: new Date().toISOString()
  });

  console.log(`[🧠 Capsule Query Log]`, {
    service: log.serviceName,
    type: log.capsuleType,
    query: log.query,
    response: log.response,
    time: new Date().toLocaleString()
  });
}

export function getCapsuleLogs(serviceName: string, capsuleType: 'real' | 'demo'): CapsuleLog[] {
  return capsuleLogs.filter(
    log => log.serviceName === serviceName && log.capsuleType === capsuleType
  );
}
