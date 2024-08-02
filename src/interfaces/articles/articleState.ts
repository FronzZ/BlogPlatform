export interface IUserResponse {
   username: string;
   email: string;
   token: string;
   image?: string;
}

export interface IArticleState {
   isAuthenticated: boolean;
   currentPage: number;
}
