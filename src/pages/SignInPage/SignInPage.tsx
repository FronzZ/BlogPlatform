import AuthForm from 'components/AuthForm/AutthForm';

import styles from './SignInPage.module.scss';

export default function SignInPage() {
   return (
      <div className={styles.signInPage}>
         <AuthForm isRegistration={false} />
      </div>
   );
}
