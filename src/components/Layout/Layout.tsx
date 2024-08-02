import { Outlet } from 'react-router-dom';

import Header from 'components/Header/Header';
import styles from 'components/Layout/Layout.module.scss';

export default function Layout() {
   return (
      <div className={styles.layout}>
         <Header />
         <main className={styles.main}>
            <Outlet />
         </main>
      </div>
   );
}
