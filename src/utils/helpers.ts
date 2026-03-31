import type { EventsDict } from '../types/api';

export function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPhaseLabelFromEvents(code: string, events: EventsDict): string {
  const eventCode = code.slice(0, 22);
  const event = events[eventCode];
  if (!event) return '';
  const phaseCode = code.slice(22, 26).trim().replace(/-/g, '');
  const phase = event.phases.find((p) => p.code.slice(22, 26).trim().replace(/-/g, '') === phaseCode);
  return phase?.shortDescription ?? '';
}
