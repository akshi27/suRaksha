import { readJsonFile, writeJsonFile } from './fileUtils.js';

export async function addAlert({ type, message, capsuleId, service, userId }) {
  const alerts = await readJsonFile('data/alerts.json');
  const newAlert = {
    id: `alert_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    message,
    capsuleId,
    service,
    userId
  };
  alerts.push(newAlert);
  await writeJsonFile('data/alerts.json', alerts);
}
