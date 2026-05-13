import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';
 
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Error desconocido';
 
      switch (error.status) {
        case 400:
          message = 'Parámetro inválido o ciudad no encontrada (400).';
          break;
        case 401:
          message = 'API Key inválida o no proporcionada (401).';
          break;
        case 403:
          message = 'La API Key no tiene acceso a este endpoint (403).';
          break;
        case 404:
          message = 'Recurso no encontrado (404).';
          break;
        case 500:
          message = 'Error interno del servidor (500).';
          break;
        default:
          message = `Error HTTP ${error.status}: ${error.message}`;
      }
 
      console.error('[HttpErrorInterceptor]', message, error);
      return throwError(() => new Error(message));
    })
  );
};
