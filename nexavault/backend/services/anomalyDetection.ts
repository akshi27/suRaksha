import { readJsonFile, writeJsonFile } from '../utils/fileUtils';

interface LogEntry {
  capsuleId: string;
  timestamp: string;
  location: string;
}

interface Capsule {
  id: string;
  userId: string;
  serviceName: string;
  status: string;
  suspendedAt?: string;
  suspensionReason?: string;
}

interface Alert {
  id: string;
  userId: string;
  capsuleId: string;
  type: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  read: boolean;
  data: {
    queries: number;
    locations: number;
    timeWindow: string;
  };
}

export const startAnomalyDetection = () => {
  console.log('🔍 Starting anomaly detection service...');

  setInterval(async () => {
    await detectAnomalies();
  }, 5 * 60 * 1000); // every 5 minutes
};

const detectAnomalies = async () => {
  try {
    const logs: LogEntry[] = await readJsonFile('backend/data/logs.json');
    const capsules: Capsule[] = await readJsonFile('backend/data/capsules.json');
    const alerts: Alert[] = await readJsonFile('backend/data/alerts.json');

    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    // Filter recent logs (last 10 minutes)
    const recentLogs = logs.filter(log => new Date(log.timestamp) > tenMinutesAgo);

    // Group logs by capsuleId
    const logsByCapsule: Record<string, LogEntry[]> = {};
    for (const log of recentLogs) {
      if (!logsByCapsule[log.capsuleId]) {
        logsByCapsule[log.capsuleId] = [];
      }
      logsByCapsule[log.capsuleId].push(log);
    }

    // Analyze for anomalies
    for (const [capsuleId, capsuleLogs] of Object.entries(logsByCapsule)) {
      const uniqueLocations = new Set(capsuleLogs.map(log => log.location));

      if (capsuleLogs.length > 5 && uniqueLocations.size > 3) {
        const capsuleIndex = capsules.findIndex(c => c.id === capsuleId);

        if (
          capsuleIndex !== -1 &&
          capsules[capsuleIndex].status === 'active'
        ) {
          // Suspend the capsule
          capsules[capsuleIndex].status = 'suspended';
          capsules[capsuleIndex].suspendedAt = now.toISOString();
          capsules[capsuleIndex].suspensionReason = 'Anomalous query pattern detected';

          const newAlert: Alert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            userId: capsules[capsuleIndex].userId,
            capsuleId,
            type: 'anomaly_detected',
            title: 'Suspicious Activity Detected',
            message: `Capsule for ${capsules[capsuleIndex].serviceName} has been suspended due to unusual query patterns.`,
            severity: 'high',
            timestamp: now.toISOString(),
            read: false,
            data: {
              queries: capsuleLogs.length,
              locations: uniqueLocations.size,
              timeWindow: '10 minutes'
            }
          };

          alerts.push(newAlert);
          console.log(`🚨 Anomaly detected for capsule ${capsuleId}. Suspended.`);
        }
      }
    }

    // Persist updated capsules and alerts
    await writeJsonFile('backend/data/capsules.json', capsules);
    await writeJsonFile('backend/data/alerts.json', alerts);
  } catch (error) {
    console.error('Anomaly detection error:', error);
  }
};
