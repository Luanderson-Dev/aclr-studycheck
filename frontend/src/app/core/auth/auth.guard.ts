import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

async function aguardarInicializacao(auth: AuthService): Promise<void> {
  if (!auth.inicializado) await auth.inicializar();
}

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await aguardarInicializacao(auth);
  return auth.estaAutenticado() ? true : router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await aguardarInicializacao(auth);
  return auth.eAdmin() ? true : router.createUrlTree(['/']);
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await aguardarInicializacao(auth);
  return !auth.estaAutenticado() ? true : router.createUrlTree(['/']);
};
