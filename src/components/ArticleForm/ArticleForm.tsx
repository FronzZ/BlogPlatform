import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';

import { articleApi } from '../../redux/apis/articles/ArticlesApi';

import { NewArticleFormValues, IArticleFormProps } from './ArticleFormInterfaces';
import styles from './ArticleForm.module.scss';

export default function ArticleForm({ onSubmitFn, formTitle, slug = '' }: IArticleFormProps) {
   const { data: userData } = articleApi.endpoints.getArticle.useQueryState(slug);

   const {
      register,
      control,
      handleSubmit,
      formState: { errors, isValid },
      setFocus,
      getValues,
   } = useForm<NewArticleFormValues>({
      mode: 'onBlur',
      defaultValues: {
         title: userData?.article?.title || '',
         description: userData?.article?.description || '',
         body: userData?.article?.body || '',
         tagList: userData?.article?.tagList?.map((tag) => ({ tagName: tag })) || [{ tagName: '' }],
      },
   });

   const { fields, append, remove } = useFieldArray({
      name: 'tagList',
      control,
   });

   const onSubmit: SubmitHandler<NewArticleFormValues> = async (data) => {
      onSubmitFn(data);
   };

   const handleAppend = (index: number) => {
      const targetCurrentTag = getValues(`tagList.${index}.tagName`).trim();
      if (targetCurrentTag.length > 0) {
         append({ tagName: '' });
         setTimeout(() => setFocus(`tagList.${fields.length}.tagName`), 0);
      }
   };

   return (
      <div className={styles.formWrapper}>
         <h2 className={styles.articleFormTitle}>{formTitle}</h2>
         <form className={styles.articleForm} onSubmit={handleSubmit(onSubmit)}>
            <label className={styles.articleFormLabel}>
               Title
               <input
                  className={`${styles.articleFormInput} ${errors?.title ? styles.invalidInput : ''}`}
                  type="text"
                  placeholder="Title"
                  {...register('title', {
                     required: 'Это поле обязательно к заполнению!',
                     pattern: { value: /\S/, message: 'Поле не должно быть пустым! Пробел не считается =)' },
                  })}
               />
               <div className={styles.inputError}>{errors?.title && <p>{errors?.title.message}</p>}</div>
            </label>
            <label className={styles.articleFormLabel}>
               Shot description
               <input
                  className={`${styles.articleFormInput} ${errors?.description ? styles.invalidInput : ''}`}
                  type="text"
                  placeholder="Shot description"
                  {...register('description', {
                     required: 'Это поле обзязательно к заполнению!',
                     pattern: { value: /\S/, message: 'Поле не должно быть пустым! Пробел не считается =)' },
                  })}
               />
               <div className={styles.inputError}>{errors?.description && <p>{errors?.description.message}</p>}</div>
            </label>
            <label className={styles.articleFormLabel}>
               Text
               <textarea
                  className={`${styles.articleFormTextArea} ${errors?.body ? styles.invalidInput : ''}`}
                  placeholder="Text"
                  rows={8}
                  {...register('body', {
                     required: 'Это поле обзязательно к заполнению!',
                     pattern: { value: /\S/, message: 'Поле не должно быть пустым! Пробел не считается =)' },
                  })}
               />
               <div className={styles.inputError}>{errors?.body && <p>{errors?.body.message}</p>}</div>
            </label>
            {fields.map((tag, index) => (
               <label key={tag.id} className={styles.articleFormLabelTag}>
                  Tags
                  <div className={styles.articleFormTagWrapper}>
                     <input
                        className={`${styles.articleFormInputTag} ${errors?.tagList?.[index]?.tagName ? styles.invalidInput : ''}`}
                        type="text"
                        placeholder="Tag"
                        {...register(`tagList.${index}.tagName`, {
                           validate: (value) => value.length >= 1,
                           pattern: /\S/,
                        })}
                     />
                     <button
                        className={styles.articleFormDeleteTag}
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                     >
                        Delete
                     </button>
                     {index === fields.length - 1 && (
                        <button className={styles.articleFormAddTag} type="button" onClick={() => handleAppend(index)}>
                           Add tag
                        </button>
                     )}
                  </div>
               </label>
            ))}

            <input className={styles.articleFormSubmit} type="submit" disabled={!isValid} />
         </form>
      </div>
   );
}
