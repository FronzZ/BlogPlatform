import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';

import Layout from 'components/Layout/Layout';

import ProfilePage from '../../pages/EditProfilePage/EditProfilePage';
import ArticlesPage from '../../pages/ArticlesPage/ArticlesPage';
import ArticlePage from '../../pages/ArticlePage/ArticlePage';
import ArticleCreatePage from '../../pages/ArticleCreatePage/ArticleCreatePage';
import ArticleEditPage from '../../pages/ArticleEditPage/ArticleEditPage';
import SignUpPage from '../../pages/SignUpPage/SignUpPage';
import SignInPage from '../../pages/SignInPage/SignInPage';

export default function App() {
   return (
      <ConfigProvider
         theme={{
            token: {
               boxShadow: 'none',
            },
            components: {
               Pagination: {
                  itemActiveBg: '#1890FF',
                  colorPrimary: 'white',
                  colorPrimaryHover: 'white',
               },
            },
         }}
      >
         <Routes>
            <Route path="/" element={<Layout />}>
               <Route index element={<ArticlesPage />} />
               <Route path="articles" element={<ArticlesPage />} />
               <Route path="articles/:slug" element={<ArticlePage />} />
               <Route path="articles/:slug/edit" element={<ArticleEditPage />} />
               <Route path="new-article" element={<ArticleCreatePage />} />
               <Route path="profile" element={<ProfilePage />} />
               <Route path="sign-up" element={<SignUpPage />} />
               <Route path="sign-in" element={<SignInPage />} />
            </Route>
         </Routes>
      </ConfigProvider>
   );
}
