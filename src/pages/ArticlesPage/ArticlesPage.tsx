import { Pagination } from 'antd';
import { ScaleLoader } from 'react-spinners';
import { v4 as uuidv4 } from 'uuid';

import Article from 'components/Article/Article';

import { useGetArticlesQuery } from '../../redux/apis/articles/ArticlesApi';
import { setCurrentPage } from '../../redux/slices/userDataSlice';
import { useAppSelector, useAppDispatch } from '../../hooks/hooks';

import styles from './ArticlesPage.module.scss';

export default function ArticlesPage() {
   const currentPage = useAppSelector((state) => state.userData.currentPage);
   const isAuthenticated = useAppSelector((state) => state.userData.isAuthenticated);

   const { data, isLoading } = useGetArticlesQuery({ currentPage, isAuthenticated }, { refetchOnFocus: true });

   const dispatch = useAppDispatch();

   return (
      <div className={styles.articlesPage}>
         {isLoading ? (
            <div className={styles.loader}>
               <ScaleLoader color="#1890FF" height={60} width={8} />
            </div>
         ) : (
            <>
               <ul className={styles.articles}>
                  {data?.articles?.map((article) => (
                     <li key={uuidv4()}>
                        <Article data={article} isLink />
                     </li>
                  ))}
               </ul>
               <div className={styles.pagination}>
                  <Pagination
                     defaultPageSize={5}
                     total={data?.articlesCount}
                     current={currentPage}
                     hideOnSinglePage
                     showSizeChanger={false}
                     onChange={(page) => dispatch(setCurrentPage(page))}
                  />
               </div>
            </>
         )}
      </div>
   );
}
