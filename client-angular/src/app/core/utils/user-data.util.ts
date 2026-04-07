import { IUserData } from '../models/userData/user-data.model';

export function normalizeUserData(raw: Partial<IUserData> & { id?: string }): IUserData {
  return {
    id: raw.id != null ? String(raw.id) : '',
    name: raw.name ?? '',
    email: raw.email ?? '',
    isAccountVerified: Boolean(raw.isAccountVerified),
  };
}
