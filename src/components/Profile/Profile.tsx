import { useEffect, useRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import { useUpdateUserMutation, userApi } from '../../redux/apis/user/UserApi';
import formErrorHandling from '../../helpers/formHelpers';

import IEditProfileFormValues from './ProfileInterfaces';
import styles from './Profile.module.scss';

export default function Profile() {
   const { data: currentUser, isSuccess } = userApi.endpoints.getCurrentUser.useQueryState();
   const [updateUser] = useUpdateUserMutation();

   const timeoutRef = useRef<number | undefined>();
   const navigate = useNavigate();

   const [messageApi, contextHolder] = message.useMessage();

   useEffect(() => {
      return () => clearInterval(timeoutRef.current);
   }, []);

   const {
      register,
      setValue,
      setError,
      reset,
      handleSubmit,
      formState: { errors, isDirty, dirtyFields },
   } = useForm<IEditProfileFormValues>({
      mode: 'onBlur',
      defaultValues: {
         username: '',
         password: '',
         email: currentUser?.email || '',
         image: currentUser?.image || '',
      },
   });

   useEffect(() => {
      if (isSuccess) {
         reset(currentUser);
      }
   }, [reset, currentUser, isSuccess]);

   const onSubmit: SubmitHandler<IEditProfileFormValues> = async (data) => {
      try {
         const changedFields = Object.keys(dirtyFields).reduce((acum, field) => {
            const typedField = field as keyof IEditProfileFormValues;
            if (typeof data[typedField] === 'string') {
               acum[typedField] = data[typedField];
            }
            return acum;
         }, {} as IEditProfileFormValues);
         await updateUser({ user: changedFields }).unwrap();
         messageApi.success('Данные  успешно обновлены! =)', 1);
         timeoutRef.current = setTimeout(() => {
            navigate('/');
         }, 1000);
      } catch (error) {
         formErrorHandling(setError, error);
      }
   };

   return (
      <>
         {contextHolder}
         <form className={styles.profileForm} onSubmit={handleSubmit(onSubmit)}>
            <h2 className={styles.profileTitle}>Edit Profile</h2>
            <label className={styles.profileLabel}>
               Username
               <input
                  className={`${styles.profileInput} ${errors?.username ? styles.invalidInput : ''}`}
                  placeholder="New username"
                  {...register('username', {
                     minLength: { value: 3, message: 'Username не должен быть меньше 3 символов!' },
                     maxLength: { value: 20, message: 'Username не должен быть больше 20 симоволов!' },
                     onChange: (e) => setValue('username', e.target.value.trim()),
                  })}
               />
            </label>
            <div className={styles.inpurError}>{errors?.username && <p>{errors?.username.message}</p>}</div>

            <label className={styles.profileLabel}>
               Email adress
               <input
                  type="email"
                  className={`${styles.profileInput} ${errors?.email ? styles.invalidInput : ''}`}
                  placeholder="New email"
                  {...register('email', {
                     pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Email должен быть корректным адресом!',
                     },
                     onChange: (e) => setValue('email', e.target.value.toLowerCase()),
                  })}
               />
            </label>
            <div className={styles.inpurError}>{errors?.email && <p>{errors?.email.message}</p>}</div>

            <label className={styles.profileLabel}>
               New password
               <input
                  type="password"
                  className={`${styles.profileInput} ${errors?.password ? styles.invalidInput : ''}`}
                  placeholder="New password"
                  {...register('password', {
                     minLength: { value: 6, message: 'Пароль не должен быть меньше 6 симовлов!' },
                     maxLength: { value: 40, message: 'Пароль не должен быть больше 40 симовлов!' },
                     onChange: (e) => setValue('password', e.target.value.trim()),
                  })}
               />
            </label>
            <div className={styles.inpurError}>{errors?.password && <p>{errors?.password.message}</p>}</div>

            <label className={styles.profileLabel}>
               Avatar image (url)
               <input
                  className={`${styles.profileInput} ${errors?.image ? styles.invalidInput : ''}`}
                  placeholder="Avatar image"
                  {...register('image', {
                     pattern: {
                        value: /^https?:\/\/[^?]*\.(jpg|jpeg|gif|png|tiff|bmp|webp)(\?(.*))?$/i,
                        message: 'Аватарка должна иметь корректный url!',
                     },
                  })}
               />
            </label>
            <div className={styles.inpurError}>{errors?.image && <p>{errors?.image.message}</p>}</div>

            <button className={styles.profileSubmitBtn} type="submit" disabled={!isDirty}>
               Save
            </button>
         </form>
      </>
   );
}
