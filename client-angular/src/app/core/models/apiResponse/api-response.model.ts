import { IUserData } from '../userData/user-data.model';

export interface IGetResponse {
  userData?: IUserData;
  message?: string;
  success: boolean;
}

export interface IPostResponse {
  message?: string;
  success: boolean;
}
