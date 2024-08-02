import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { format } from 'date-fns';

// import type { RootState } from '../../store/index';
import {
   IArticlesResponse,
   IGetArticlesQueryParams,
   ISingleArticleResponse,
   ISingleAtricleRequest,
} from '../../../interfaces/articles/articleData';
import { shortenText, shortenAndLimitTags } from '../../../helpers/articlesHelpers';

export const articleApi = createApi({
   reducerPath: 'articleApi',
   baseQuery: fetchBaseQuery({
      baseUrl: 'https://blog.kata.academy/api/',
      prepareHeaders: (headers) => {
         const token = localStorage.getItem('token');
         if (token) {
            headers.set('Authorization', `Token ${token}`);
         }
         return headers;
      },
   }),
   tagTypes: ['Articles', 'Article', 'User'],
   endpoints: (builder) => ({
      getArticles: builder.query<IArticlesResponse, IGetArticlesQueryParams>({
         query: ({ limit = 5, currentPage = 1 } = {}) => ({
            url: 'articles',
            params: { limit, offset: (currentPage - 1) * limit },
            method: 'GET',
         }),

         providesTags: (result) =>
            result
               ? [
                    ...result.articles.map(({ slug }) => ({ type: 'Articles' as const, id: slug })),
                    { type: 'Articles', id: 'Article-List' },
                 ]
               : [{ type: 'Articles', id: 'Article-List' }],

         transformResponse: (response: IArticlesResponse) => {
            if (response.articles && Array.isArray(response.articles)) {
               return {
                  ...response,
                  articles: response.articles.map((article) => ({
                     ...article,
                     createdAt: format(new Date(article.createdAt), 'MMMM d, yyyy'),
                     title: shortenText(article.title, 50),
                     description: shortenText(article.description, 50),
                     tagList: shortenAndLimitTags(article.tagList, 25, 6),
                  })),
               };
            }
            return response;
         },
      }),

      getArticle: builder.query<ISingleArticleResponse, string>({
         query: (slug) => ({
            url: `articles/${slug}`,
            method: 'GET',
         }),
         providesTags: ['Article'],
         transformResponse: (response: ISingleArticleResponse) => {
            if (response.article && typeof response.article === 'object') {
               return {
                  ...response,
                  article: {
                     ...response.article,
                     createdAt: format(new Date(response.article.createdAt), 'MMMM d, yyyy'),
                     tagList: shortenAndLimitTags(response.article.tagList),
                  },
               };
            }
            return response;
         },
      }),

      createArticle: builder.mutation<ISingleArticleResponse, ISingleAtricleRequest>({
         query: (body) => ({
            url: 'articles',
            method: 'POST',
            body,
         }),
         invalidatesTags: [{ type: 'Articles', id: 'Article-List' }],
      }),

      deleteArticle: builder.mutation<void, string>({
         query: (slug) => ({
            url: `articles/${slug}`,
            method: 'DELETE',
         }),
         invalidatesTags: [{ type: 'Articles', id: 'Article-List' }],
      }),

      editArticle: builder.mutation<ISingleArticleResponse, { slug: string; body: ISingleAtricleRequest }>({
         query: ({ slug, body }) => ({
            url: `articles/${slug}`,
            method: 'PUT',
            body,
         }),
         invalidatesTags: (result) => [{ type: 'Articles', id: result?.article.slug }, 'Article'],
      }),

      favoriteArticle: builder.mutation<ISingleArticleResponse, string>({
         query: (slug) => ({
            url: `articles/${slug}/favorite`,
            method: 'POST',
         }),
         invalidatesTags: (result) => [{ type: 'Articles', id: result?.article.slug }, 'Article'],
      }),

      unfavoriteArticle: builder.mutation<ISingleArticleResponse, string>({
         query: (slug) => ({
            url: `articles/${slug}/favorite`,
            method: 'DELETE',
         }),
         invalidatesTags: (result) => [{ type: 'Articles', id: result?.article.slug }, 'Article'],
      }),
   }),
});

export const {
   useGetArticlesQuery,
   useGetArticleQuery,
   useCreateArticleMutation,
   useFavoriteArticleMutation,
   useUnfavoriteArticleMutation,
   useDeleteArticleMutation,
   useEditArticleMutation,
} = articleApi;
