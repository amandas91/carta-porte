import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SessionStorageService } from 'ngx-webstorage';
import { Observable, ReplaySubject, of } from 'rxjs';
import { shareReplay, tap, catchError } from 'rxjs/operators';
import { StateStorageService } from './state-storage.service';

import { environment } from 'app/../environments/environment';
import { Account } from 'app/shared/models/account.model';
import { Authorities } from 'app/shared/models/authorities.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private userIdentity: Account | null = null;
  private authenticationState = new ReplaySubject<Account | null>(1);
  private accountCache$?: Observable<Account | null>;

  constructor(
    private sessionStorage: SessionStorageService,
    private http: HttpClient,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  save(account: Account): Observable<{}> {
    return this.http.post(`${environment.apiUrl}/api/authenticate`, account);
  }

  authenticate(identity: Account | null): void {
    // console.log(" #### authenticate:  " ,identity);
    this.userIdentity = identity;
    this.authenticationState.next(this.userIdentity);
  }

  
  hasAnyAuthority(authorities: string[] | string): boolean {
    // console.log('##### hasAnyAuthority #####');
    if (!this.userIdentity || !this.userIdentity.rol) {
      // console.log('Not have auth: ' + authorities);
      return false;
    }

    // console.log('Auth: ' + authorities);
    if (!Array.isArray(authorities)) {
      authorities = [authorities];
      // console.log('New auth: ' + authorities);
    }
    // console.log('User: ' + JSON.stringify(this.userIdentity));
    // console.log('User Auth: ' + JSON.stringify(this.userIdentity.roles));

    // return this.userIdentity.rol.some((rol: any) => {
      // console.log('Rol: ' + rol + ', has autorization?: ' + authorities.includes(rol));
    //   return authorities.includes(rol);
    // });
    return authorities.includes(this.userIdentity.rol);

  }

  // getSpecialty(): CatEspecialidad[] {
  //   return this.userIdentity.especialidades;
  // }

  identity(force?: boolean): Observable<Account | null> {
    if (!this.accountCache$ || force || !this.isAuthenticated()) {
      this.accountCache$ = this.fetch().pipe(
        catchError(() => {
          return of(null);
        }),
        tap((account: Account | null) => {
          this.authenticate(account);

          if (account) {
            this.navigateToStoredUrl();
          }
        }),
        shareReplay()
      );
    }
    return this.accountCache$;
  }

  isAuthenticated(): boolean {
    return this.userIdentity !== null;
  }

  getAuthenticationState(): Observable<Account | null> {
    return this.authenticationState.asObservable();
  }

  getImageUrl(): string {
    return this.userIdentity ? this.userIdentity.picture : '';
  }

  private fetch(): Observable<Account> {
    return this.http.get<Account>(`${environment.apiUrl}/api/profile`);
    // return this.getStudents();
  }

//   public getStudents(): Observable<Account> {
//     console.log('###### PRUEBAS DE INVOCACIÓN ########');
//     console.log('########## TEMPORAL PARA OBTENER LOS DETALLES DE LA SESSIÓN ###');

//     let aux: Account = {
//       login: true,
//       email: "amanda.sabino@nuba.com",
//       picture: "",
//       name: "AMANDA",
//       admin: "SABINO",
//       rol: 'ROLE_SUPERVIOR',
//       id: 1,
//       verified: ""
//     }
//     const studentsObservable = new Observable<Account>(observer => {
//            setTimeout(() => {
//                observer.next(aux);
//            }, 1000);
//     });

//     return studentsObservable;
// }

  private navigateToStoredUrl(): void {
    // previousState can be set in the authExpiredInterceptor and in the userRouteAccessService
    // if login is successful, go to stored previousState and clear previousState
    const previousUrl = this.stateStorageService.getUrl();
    if (previousUrl) {
      this.stateStorageService.clearUrl();
      this.router.navigateByUrl(previousUrl);
    }
  }

  getLogin(): any {
    return this.userIdentity ? this.userIdentity.login : null;
  }

  getText(text: string): string {
    return text ? text : '';
  }

  getFullName(): any {
    // console.log('User>>: ' + this.userIdentity.rol);
    return this.userIdentity
      ? this.getText(this.userIdentity.name) +
          // ' ' +
          // this.getText(this.userIdentity.primerApellido) +
          // ' ' +
          // this.getText(this.userIdentity.segundoApellido) +
          // ' ' +
          this.getText(' [' + this.userIdentity.rol + ']')
      : null;
  }

  getEmail(): any {
    // tslint:disable-next-line: no-string-literal
    // console.log('Email>>: ' + this.userIdentity.rol);
    return this.userIdentity
      ? this.getText(this.userIdentity.email) 
      : null;
  }
}
