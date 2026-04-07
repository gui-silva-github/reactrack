import { HttpErrorResponse } from '@angular/common/http';

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;
    if (body && typeof body === 'object' && 'message' in body) {
      const msg = (body as { message: unknown }).message;
      if (typeof msg === 'string' && msg.trim().length > 0) {
        return msg;
      }
    }
    if (typeof error.message === 'string' && error.message.length > 0) {
      return error.message;
    }
  }
  return fallback;
}
