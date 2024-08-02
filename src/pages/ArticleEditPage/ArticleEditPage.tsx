import { useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';

import ArticleForm from 'components/ArticleForm/ArticleForm';
import { NewArticleFormValues } from 'components/ArticleForm/ArticleFormInterfaces';

import { useEditArticleMutation } from '../../redux/apis/articles/ArticlesApi';

import styles from './ArticleEditPage.module.scss';

export default function ArticleEditPage() {
   const navigate = useNavigate();
   const { slug } = useLocation().state;

   const timeoutRef = useRef<number | undefined>();

   const [messageApi, contextHolder] = message.useMessage();
   const [editArticle] = useEditArticleMutation();

   useEffect(() => {
      return () => clearInterval(timeoutRef.current);
   }, []);

   const editSubmit = async (data: NewArticleFormValues) => {
      try {
         const editedArticle = { ...data, tagList: data.tagList.map((tag) => tag.tagName) };
         await editArticle({ slug, body: { article: editedArticle } }).unwrap();
         messageApi.success('Ваша статья успешно отредактирована! =)', 1);
         timeoutRef.current = setTimeout(() => {
            navigate(`/articles/${slug}`);
         }, 1000);
      } catch (e) {
         messageApi.error('Ошибочка при редактировании статьи... =(', 1);
      }
   };

   return (
      <div className={styles.articleEditPage}>
         {contextHolder}
         <ArticleForm onSubmitFn={editSubmit} formTitle="Edit article" slug={slug} />
      </div>
   );
}
