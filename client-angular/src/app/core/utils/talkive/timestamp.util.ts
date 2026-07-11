import { IMessage } from '../../models/systems/talkive/talkive.model';

type TimestampLike = IMessage['createdAt'];

function toDate(value: TimestampLike): Date | null {
  if (value == null) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime()) ? date : null;
  }

  if (typeof value === 'object' && 'seconds' in value) {
    const seconds = (value as { seconds: number }).seconds;
    return Number.isFinite(seconds) ? new Date(seconds * 1000) : null;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (typeof value === 'string') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

export function formatTalkiveTimestamp(value: TimestampLike): string {
  const date = toDate(value);
  if (!date) {
    return '';
  }

  const hour = date.getHours();
  const minute = date.getMinutes().toString().padStart(2, '0');
  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `(${day}/${month}) ${hour}:${minute}`;
}
