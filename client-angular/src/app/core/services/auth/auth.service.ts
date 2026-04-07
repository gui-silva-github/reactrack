import { Injectable, signal, computed } from "@angular/core";
import { Observable, of, switchMap, map, tap } from "rxjs";
import { HttpService } from '../http/http.service';
import { IGetResponse, IPostResponse } from "../../models/apiResponse/api-response.model";
import {
  ILoginUserRequest, IRegisterUserRequest, IVerifyEmailRequest,
  IResetPasswordRequest, ISendResetOtpRequest, ISendVerifyOtpRequest
} from "../../models/authRequest/auth-request.model";
import { IUserData } from "../../models/userData/user-data.model";
import { normalizeUserData } from "../../utils/user-data.util";

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
      next: (response: IGetResponse) => {
        if (response.success && response.userData) {
          this.isLoggedInSignal.set(true);
          this.userDataSignal.set(normalizeUserData(response.userData));
        } else if (response.success) {
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
      next: (response: IGetResponse) => {
        if (response.success && response.userData) {
          this.userDataSignal.set(normalizeUserData(response.userData));
        } else {
          this.userDataSignal.set(null);
        }
      },
      error: () => {
        this.userDataSignal.set(null);
      }
    })
  }

  private loadUserDataAfterAuth(): Observable<void> {
    return this.http.get<IGetResponse>('/user/data').pipe(
      tap((response: IGetResponse) => {
        if (response.success && response.userData) {
          this.userDataSignal.set(normalizeUserData(response.userData));
        }
      }),
      map(() => undefined)
    );
  }

  login(payload: ILoginUserRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/login', payload).pipe(
      switchMap((response: IPostResponse) => {
        if (!response.success) {
          return of(response);
        }
        this.isLoggedInSignal.set(true);
        return this.loadUserDataAfterAuth().pipe(map(() => response));
      })
    );
  }

  register(payload: IRegisterUserRequest): Observable<IPostResponse> {
    return this.http.post<IPostResponse>('/auth/register', payload).pipe(
      switchMap((response: IPostResponse) => {
        if (!response.success) {
          return of(response);
        }
        this.isLoggedInSignal.set(true);
        return this.loadUserDataAfterAuth().pipe(map(() => response));
      })
    );
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
    return this.http.post<IPostResponse>('/auth/verify-account', { otp: payload.otp }).pipe(
      tap((response: IPostResponse) => {
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
