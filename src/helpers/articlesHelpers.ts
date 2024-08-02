export const shortenText = (text: string | undefined, maxLength: number): string => {
   if (!text) {
      return '';
   }

   if (text.length > maxLength && !text.includes(' ')) {
      return `${text.slice(0, maxLength)}...`;
   }
   return text.length > maxLength ? `${text.slice(0, text.lastIndexOf(' ', maxLength))}...` : text;
};

export const shortenAndLimitTags = (arr: string[], maxLength: number = 25, tagsQuantity: number = Infinity) => {
   if (arr.length === 0 || arr === null) {
      return [];
   }

   // const filteredArr = arr.filter((el) => typeof el === 'string' && el !== null);  // Потом убрать
   const shortenTag = arr.map((el) => (el?.length > maxLength ? `${el.slice(0, maxLength)}...` : el));
   const maxTags = shortenTag.length > tagsQuantity ? shortenTag.filter((_, i) => i < tagsQuantity) : shortenTag;
   return maxTags;
};
