import { Link, useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useAppDispatch } from '../../hooks/hooks';
import { useRegisteringNewUserMutation, useExistingMutation } from '../../redux/apis/user/UserApi';
import { login } from '../../redux/slices/userDataSlice';
import formErrorHandling from '../../helpers/formHelpers';

import { FormValues } from './AuthFormInterfaces';
import styles from './AuthForm.module.scss';

export default function AuthForm({ isRegistration }: { isRegistration: boolean }) {
   const [registeringNewUser] = useRegisteringNewUserMutation();
   const [userLogin] = useExistingMutation();

   const navigate = useNavigate();
   const dispatch = useAppDispatch();

   const {
      register,
      formState: { errors, isValid },
      handleSubmit,
      reset,
      setError,
      clearErrors,
      setValue,
   } = useForm<FormValues>({ mode: 'onBlur', defaultValues: { isAgree: true } });

   const handlerForSubmit: SubmitHandler<FormValues> = async (data) => {
      try {
         let res;
         if (isRegistration) {
            const requestData = {
               user: {
                  username: data.username,
                  email: data.email,
                  password: data.password,
               },
            };
            res = await registeringNewUser(requestData).unwrap();
         } else {
            const requestData = {
               user: {
                  email: data.email,
                  password: data.password,
               },
            };
            res = await userLogin(requestData).unwrap();
         }
         dispatch(login());
         localStorage.setItem('token', res.user.token);
         reset();
         navigate('/', { replace: true });
      } catch (error) {
         formErrorHandling(setError, error);
      }
   };

   return (
      <div className={styles.authWrapper}>
         <h2 className={styles.authTitle}>{isRegistration ? 'Create new account' : 'Sign In'}</h2>
         <form className={styles.form} onSubmit={handleSubmit(handlerForSubmit)}>
            {isRegistration ? (
               <>
                  <label className={styles.formLabel}>
                     Username
                     <input
                        className={`${styles.formInput} ${errors?.username ? styles.invalidInput : ''}`}
                        placeholder="some-username"
                        type="text"
                        {...register('username', {
                           required: 'Это поле обязательно к заполнению!',
                           minLength: {
                              value: 3,
                              message: 'User Name не должен быть меньше 3 символов!',
                           },
                           maxLength: {
                              value: 20,
                              message: 'User Name не должен быть больше 40 символов!',
                           },
                           pattern: { value: /\S/, message: 'Поле не должно быть пустым! Пробел не считается =)' },
                        })}
                     />
                  </label>
                  <div className={styles.inpurError}>{errors?.username && <p>{errors?.username.message}</p>}</div>

                  <label className={styles.formLabel}>
                     Email adress
                     <input
                        className={`${styles.formInput} ${errors?.email ? styles.invalidInput : ''}`}
                        placeholder="alex@example.com"
                        type="email"
                        {...register('email', {
                           required: 'Это поле обязательно к заполнению!',
                           pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'email должен быть корректным адресом!',
                           },
                           onChange: (e) => setValue('email', e.target.value.toLowerCase()),
                        })}
                     />
                  </label>
                  <div className={styles.inpurError}>{errors?.email && <p>{errors?.email.message}</p>}</div>

                  <label className={styles.formLabel}>
                     Password
                     <input
                        className={`${styles.formInput} ${errors?.password ? styles.invalidInput : ''}`}
                        placeholder="******"
                        type="password"
                        {...register('password', {
                           required: 'Это поле обязательно к заполнению!',
                           minLength: {
                              value: 6,
                              message: 'Пароль должен быть не меньше 6 символов!',
                           },
                           maxLength: {
                              value: 40,
                              message: 'Пароль должен быть не больше 40 символов!',
                           },
                        })}
                     />
                  </label>
                  <div className={styles.inpurError}>{errors?.password && <p>{errors?.password.message}</p>}</div>

                  <label className={styles.formLabel}>
                     Repeat password
                     <input
                        className={`${styles.formInput} ${errors?.repeatPassword ? styles.invalidInput : ''}`}
                        placeholder="******"
                        type="password"
                        {...register('repeatPassword', {
                           required: 'Это поле обязательно к заполнению!',
                           minLength: {
                              value: 6,
                              message: 'Пароль должен быть не менее 6 символов!',
                           },
                           maxLength: {
                              value: 40,
                              message: 'Пароль должен быть не более 40 символов!',
                           },
                           validate: (value, formValues) => value === formValues.password || 'Пароли должны совпадать!',
                        })}
                     />
                  </label>
                  <div className={styles.inpurError}>
                     {errors?.repeatPassword && <p>{errors?.repeatPassword.message}</p>}
                  </div>

                  <label className={styles.personalInformationLabel}>
                     <input
                        className={styles.personalInformationInput}
                        type="checkbox"
                        {...register('isAgree', {
                           required: 'Вы должны согласиться, чтобы продолжить регистрацию!',
                        })}
                     />
                     I agree to the processing of my personal information
                  </label>
                  <div className={styles.inpurError}>{errors?.isAgree && <p>{errors?.isAgree.message}</p>}</div>
               </>
            ) : (
               <>
                  <label className={styles.formLabel}>
                     Email adress
                     <input
                        className={`${styles.formInput} ${errors?.['email or password'] ? styles.invalidInput : ''}`}
                        placeholder="alex@example.com"
                        type="email"
                        {...register('email', {
                           required: 'Это поле обязательно к заполнению!',
                           pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'email должен быть корректным адресом!',
                           },
                           onChange: (e) => {
                              setValue('email', e.target.value.toLowerCase());
                              if (errors['email or password']) {
                                 clearErrors('email or password');
                              }
                           },
                        })}
                     />
                  </label>
                  <div className={styles.inpurError}>
                     {errors?.['email or password'] && <p>Проверьте ваш логин еще раз!</p>}
                  </div>

                  <label className={styles.formLabel}>
                     Password
                     <input
                        className={`${styles.formInput} ${errors?.['email or password'] ? styles.invalidInput : ''}`}
                        placeholder="******"
                        type="password"
                        {...register('password', {
                           required: 'Это поле обязательно к заполнению!',
                           minLength: {
                              value: 6,
                              message: 'Пароль должен быть не менее 6 символов!',
                           },
                           maxLength: {
                              value: 40,
                              message: 'Пароль должен быть не более 40 символов!',
                           },
                           onChange: () => {
                              if (errors['email or password']) {
                                 clearErrors('email or password');
                              }
                           },
                        })}
                     />
                  </label>
                  <div className={styles.inpurError}>
                     {errors?.['email or password'] && <p>Проверьте ваш пароль еще раз!</p>}
                  </div>
               </>
            )}
            <button className={styles.formSubmit} type="submit" disabled={!isValid}>
               {isRegistration ? 'Create' : 'Login'}
            </button>

            <div className={styles.authSwitch}>
               {isRegistration ? (
                  <p>
                     Already have an account?{' '}
                     <span>
                        <Link to="/sign-in">Sign In</Link>
                     </span>
                     .
                  </p>
               ) : (
                  <p>
                     Don’t have an account?{' '}
                     <span>
                        <Link to="/sign-up">Sign Up</Link>
                     </span>
                     .
                  </p>
               )}
            </div>
         </form>
      </div>
   );
}
