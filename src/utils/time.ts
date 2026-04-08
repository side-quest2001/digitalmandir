import type { AartiSchedule } from '../types/models';

export function formatTimeLabel(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function getCurrentTimeLabel() {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date());
}

export function getNextAarti(schedule: AartiSchedule) {
  const now = new Date();
  const morning = buildTime(schedule.morning);
  const evening = buildTime(schedule.evening);

  if (now <= morning) {
    return {
      label: formatTimeLabel(schedule.morning),
      phase: 'Morning Aarti',
    };
  }

  if (now <= evening) {
    return {
      label: formatTimeLabel(schedule.evening),
      phase: 'Evening Aarti',
    };
  }

  return {
    label: formatTimeLabel(schedule.morning),
    phase: 'Tomorrow Morning Aarti',
  };
}

function buildTime(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return date;
}
