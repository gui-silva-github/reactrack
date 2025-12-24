export interface ISignupFirebase {
    username: string;
    email: string;
    password: string;
}

export interface ILoginFirebase {
    email: string;
    password: string;
}

export interface IResetPasswordFirebase {
    email: string;
}