import { Link, useNavigate } from 'react-router-dom';

import profileImage from 'img/profile.svg';
import styles from 'components/Header/Header.module.scss';

import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { useGetCurrentUserQuery } from '../../redux/apis/user/UserApi';
import { logout } from '../../redux/slices/userDataSlice';

export default function Header() {
   const isAuthenticated = useAppSelector((state) => state.userData.isAuthenticated);
   const { data: userData } = useGetCurrentUserQuery(undefined, {
      skip: !isAuthenticated,
      refetchOnMountOrArgChange: true,
   });

   const navigate = useNavigate();
   const dispatch = useAppDispatch();

   return (
      <header className={styles.header}>
         <div className={styles.logo}>
            <Link to="/">RealWorld Blog</Link>
         </div>

         <div className={styles.linksWrapper}>
            {!userData ? (
               <div className={styles.logOutLinks}>
                  <Link to="sign-in">Sign In</Link>
                  <Link to="sign-up" className={styles.signUp}>
                     Sign Up
                  </Link>
               </div>
            ) : (
               <div className={styles.logInLinks}>
                  <Link to="new-article" className={styles.createArticle}>
                     Create articles
                  </Link>
                  <Link to="profile" className={styles.profile}>
                     <span>{userData.username}</span>
                     <div className={styles.imageWrapper}>
                        <img src={userData?.image || profileImage} alt="Profile" />
                     </div>
                  </Link>
                  <button
                     type="button"
                     className={styles.logOut}
                     onClick={() => {
                        dispatch(logout());
                        localStorage.removeItem('token');
                        navigate('/');
                     }}
                  >
                     Log Out
                  </button>
               </div>
            )}
         </div>
      </header>
   );
}
