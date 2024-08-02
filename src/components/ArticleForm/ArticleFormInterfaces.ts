export type NewArticleFormValues = {
   title: string;
   description: string;
   body: string;
   tagList: {
      tagName: string;
   }[];
};

export interface IArticleFormProps {
   onSubmitFn: (data: NewArticleFormValues) => void;
   formTitle: string;
   slug?: string;
}
