import AuthForm from 'components/AuthForm/AutthForm';

import styles from './SignUpPage.module.scss';

export default function SignUpPage() {
   return (
      <div className={styles.signUpPage}>
         <AuthForm isRegistration />
      </div>
   );
}
