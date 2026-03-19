import type { IUserData } from "@/interfaces/userData";

export interface IGetResponse {
    userData?: IUserData;
    message?: string;
    success: boolean;
}