import { UseFormSetError, Path, FieldValues } from 'react-hook-form';

import { RegistrErrorResponse } from '../interfaces/user/userApi';

function formErrorHandling<T extends FieldValues>(setError: UseFormSetError<T>, error: RegistrErrorResponse | unknown) {
   if (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'data' in error &&
      error.data != null &&
      error.status === 422
   ) {
      Object.keys((error as RegistrErrorResponse).data.errors).forEach((field) => {
         setError(field as Path<T>, {
            type: 'server',
            message: `Поле ${field} уже используется!`,
         });
      });
   }
}

export default formErrorHandling;
