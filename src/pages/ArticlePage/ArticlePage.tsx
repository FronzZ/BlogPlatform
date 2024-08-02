import { useParams } from 'react-router-dom';

import Article from 'components/Article/Article';

import { useGetArticleQuery } from '../../redux/apis/articles/ArticlesApi';

import styles from './ArticlePage.module.scss';

export default function ArticlePage() {
   const { slug } = useParams();
   const { data, isSuccess } = useGetArticleQuery(slug as string);

   return <div className={styles.fullBodyArticle}>{isSuccess && <Article data={data?.article} isLink={false} />}</div>;
}
