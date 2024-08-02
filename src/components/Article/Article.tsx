import { useEffect, useRef } from 'react';
import { Tag, Popconfirm, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { Link, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import Likes from 'img/logo.svg?react';

import styles from 'components/Article/Article.module.scss';

import { useAppSelector } from '../../hooks/hooks';
import {
   useFavoriteArticleMutation,
   useUnfavoriteArticleMutation,
   useDeleteArticleMutation,
} from '../../redux/apis/articles/ArticlesApi';
import { userApi } from '../../redux/apis/user/UserApi';

import { IArticleProps } from './ArticleInterfaces';

export default function Article({ data, isLink }: IArticleProps) {
   const isAuthenticated = useAppSelector((state) => state.userData.isAuthenticated);
   const timeoutRef = useRef<number | undefined>(undefined);
   const navigate = useNavigate();

   const { data: userData } = userApi.endpoints.getCurrentUser.useQueryState();
   const [favoriteArticle] = useFavoriteArticleMutation();
   const [unFavoriteArticle] = useUnfavoriteArticleMutation();
   const [deleteArticle] = useDeleteArticleMutation();

   const [messageApi, contextHolder] = message.useMessage();

   useEffect(() => {
      return () => clearInterval(timeoutRef.current);
   }, []);

   const toggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (data.favorited) {
         unFavoriteArticle(data.slug);
      } else {
         favoriteArticle(data.slug);
      }
   };

   const handleDelete = async () => {
      try {
         await deleteArticle(data.slug).unwrap();
         messageApi.success('Статья успешно удалена! =)', 1);
         timeoutRef.current = setTimeout(() => {
            navigate('/', { replace: true });
         }, 1000);
      } catch (e) {
         messageApi.error('Ошибочка вышла... =(', 1);
      }
   };

   const content = (
      <>
         {contextHolder}
         <div className={styles['article-info']}>
            <div className={styles['article-info__header']}>
               <h5 className={styles['article-info__title']}>{data.title}</h5>
               <button
                  type="button"
                  className={styles['article-info__likes']}
                  onClick={toggleLike}
                  disabled={!isAuthenticated}
               >
                  <Likes className={data.favorited ? styles.favoriteLike : styles.defaultLike} />
                  <span>{data.favoritesCount}</span>
               </button>
            </div>
            <div className={styles['article-info__tags']}>
               {data.tagList.map((tag) => (
                  <Tag key={uuidv4()} style={{ padding: '1px 5px', marginRight: '0' }}>
                     {tag}
                  </Tag>
               ))}
            </div>
            <p className={styles['article-info__description']}>{data.description}</p>
         </div>
         <div className={styles['article-stats']}>
            <div className={styles['article-stats__details-wrapper']}>
               <div className={styles['article-stats__details']}>
                  <p className={styles['article-stats__author']}>{data.author.username}</p>
                  <p className={styles['article-stats__date']}>{data.createdAt}</p>
               </div>
               <img className={styles['article-stats__avatar']} src={data.author.image} alt="Avatar" />
            </div>
            {!isLink && userData?.username === data.author.username && (
               <div className={styles['article-control']}>
                  <Popconfirm
                     title="Вы точно хотите удалить статью?"
                     cancelText="Нет"
                     okText="Да"
                     onConfirm={handleDelete}
                     placement="rightTop"
                     overlayStyle={{ overflow: 'visible', width: '246px', height: '104px', marginLeft: '-5px' }}
                  >
                     <button type="button" className={`${styles['article-delete']} ${styles['article-btn']}`}>
                        Delete
                     </button>
                  </Popconfirm>
                  <Link to={`/articles/${data.slug}/edit`} state={{ slug: data.slug }}>
                     <button type="button" className={`${styles['article-edit']} ${styles['article-btn']}`}>
                        Edit
                     </button>
                  </Link>
               </div>
            )}
         </div>
      </>
   );

   return isLink ? (
      <Link to={`articles/${data.slug}`} className={styles.article}>
         {content}
      </Link>
   ) : (
      <>
         <div className={styles.fullArticle}>{content}</div>
         <div className={styles['article-body']}>
            <Markdown>{data.body}</Markdown>
         </div>
      </>
   );
}
