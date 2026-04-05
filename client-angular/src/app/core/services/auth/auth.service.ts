import { Injectable, signal, computed } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpService } from '../http/http.service';
import { IGetResponse, IPostResponse } from "../../models/apiResponse/api-response.model";
import {
  ILoginUserRequest, IRegisterUserRequest, IVerifyEmailRequest,
  IResetPasswordRequest, ISendResetOtpRequest, ISendVerifyOtpRequest
} from "../../models/authRequest/auth-request.model";
import { IUserData } from "../../models/userData/user-data.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly isLoggedInSignal = signal<boolean>(false);
  private readonly userDataSignal = signal<IUserData | null>(null);

  readonly isLoggedIn = computed(() => this.isLoggedInSignal());
  readonly userData = computed(() => this.userDataSignal());

  constructor(private http: HttpService) {
    this.checkAuthState();
  }

  checkAuthState(): void {
    this.http.get<IGetResponse>('/auth/is-auth').subscribe({
      next: (response) => {
        if (response.success) {
          this.isLoggedInSignal.set(true);
          this.getUserData();
        } else {
          this.isLoggedInSignal.set(false);
          this.userDataSignal.set(null);
        }
      },
      error: () => {
        this.isLoggedInSignal.set(false);
        this.userDataSignal.set(null);
      }
    });
  }

  getUserData(): void {
    this.http.get<IGetResponse>('/user/data').subscribe({
      next: (response) => {
        if (response.success && response.userData) {
          this.userDataSignal.set(response.userData);
        } else {
          this.userDataSignal.set(null);
        }
      },
      error: () => {
        this.userDataSignal.set(null);
      }
    })
  }

  login(payload: ILoginUserRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/login', payload).pipe(
      tap((response) => {
        if (response.success) {
          this.isLoggedInSignal.set(true);
          this.getUserData();
        }
      })
    )
  }

  register(payload: IRegisterUserRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/register', payload);
  }

  logout(): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/logout', {}).pipe(
      tap(() => {
        this.isLoggedInSignal.set(false);
        this.userDataSignal.set(null);
      })
    )
  }

  verifyEmail(payload: IVerifyEmailRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/verify-account', payload).pipe(
      tap((response) => {
        if (response.success){
          this.getUserData();
        }
      })
    )
  }

  sendVerifyOtp(payload: ISendVerifyOtpRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/send-verify-otp', payload);
  }

  sendResetOtp(payload: ISendResetOtpRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/send-reset-otp', payload);
  }

  resetPassword(payload: IResetPasswordRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/reset-password', payload);
  }
}
