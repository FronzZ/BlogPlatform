export interface IAuthor {
   username: string;
   image: string;
   following: boolean;
   bio?: null;
}

export interface IArticle {
   slug: string;
   title: string;
   description: string;
   createdAt: string;
   updatedAt: string;
   tagList: string[];
   favorited: boolean;
   favoritesCount: number;
   author: IAuthor;
   body?: string;
}

export interface IArticlesResponse {
   articles: IArticle[];
   articlesCount: number;
}

export interface ISingleArticleResponse {
   article: IArticle;
}

export interface ISingleAtricleRequest {
   article: {
      title: string;
      description: string;
      body: string;
      tagList: string[];
   };
}

export interface IGetArticlesQueryParams {
   limit?: number;
   currentPage?: number;
   isAuthenticated?: boolean;
}
