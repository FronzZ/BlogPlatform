import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import ArticleForm from 'components/ArticleForm/ArticleForm';
import { NewArticleFormValues } from 'components/ArticleForm/ArticleFormInterfaces';

import { useCreateArticleMutation } from '../../redux/apis/articles/ArticlesApi';

import styles from './ArticleCreate.module.scss';

export default function ArticleCreatePage() {
   const [createNewArticle] = useCreateArticleMutation();

   const [messageApi, contextHolder] = message.useMessage();

   const navigate = useNavigate();

   const timeoutRef = useRef<number | undefined>();

   useEffect(() => {
      return () => clearInterval(timeoutRef.current);
   }, []);

   const createSubmit = async (data: NewArticleFormValues) => {
      try {
         const newArticle = { ...data, tagList: data.tagList.map((tag) => tag.tagName) };
         await createNewArticle({ article: newArticle }).unwrap();
         messageApi.success('Ваша статья успешно создана! =)', 1);
         timeoutRef.current = setTimeout(() => {
            navigate('/');
         }, 1000);
      } catch (e) {
         messageApi.error('Ошибочка при создании статьи... =(', 1);
      }
   };

   return (
      <div className={styles.articleCreatePage}>
         {contextHolder}
         <ArticleForm onSubmitFn={createSubmit} formTitle="Create new article" />
      </div>
   );
}
