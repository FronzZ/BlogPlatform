export interface LoginRequest {
   user: {
      email: string;
      password: string;
   };
}

export interface LoginResponse {
   user: {
      username: string;
      email: string;
      token: string;
      image?: string;
   };
}

export interface RegistrRequest {
   user: {
      username: string;
      email: string;
      password: string;
   };
}

export interface RegisterResponse {
   user: {
      username: string;
      email: string;
      token: string;
   };
}

export interface currentUserResponse {
   username: string;
   email: string;
   image?: string;
}

export interface updateUserRequest {
   user: {
      username?: string;
      email?: string;
      token?: string;
      image?: string | null;
   };
}

export interface RegistrErrorResponse {
   data: {
      errors: {
         email: string;
         username: string;
      };
   };
   status: number;
}
