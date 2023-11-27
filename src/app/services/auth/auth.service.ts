import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LocaleStorageManagerService } from '../local-storage-manager/locale-storage-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Subject c'est des flux que l'on peut observer et sur lesquels on peut subscribe (s'enregistrer / souscrire)

  // 3 types de subjects :
  // - Subject : pipe dans lequel transite l'info
  // - BehaviorSubject : subject + conserve la dernière valeur qui a été envoyée dans le pipe (getter pour récuo la dernière donnée)
  // - ReplaySubject : behaviorSubject avec un historique variable (entre 1 et X valeur dans l'historique)

  // Observable vs Subject
  // Subject => lecture + écriture
  // Observable => écriture

  // Permet la lecture ET l'écriture
  private internalToken$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);

  // Permet la lecture
  token$: Observable<string |undefined> = this.internalToken$.asObservable();

  private baseUrlApi: string = environment.API_URL;
  private resourceName: string = 'security';
  private fullBaseUrlApi: string;

  constructor(private http: HttpClient, private localStorageManagerService: LocaleStorageManagerService) {
    this.fullBaseUrlApi = this.baseUrlApi + this.resourceName;
    const token = this.localStorageManagerService.getData(environment.LOCAL_STORAGE.TOKEN);
    this.internalToken$.next(token);
  }

  // return la dernière value nexter dans le subject
  get token(): string |undefined {
    return this.internalToken$.value;
  }

  signIn(email: string, password: string, keepConnection: boolean): Promise<void | string> {
    const obsHttp$ = this.http.post<{token: string}>(`${this.fullBaseUrlApi}/auth`, { username: email, password });
    return firstValueFrom(obsHttp$) // renvoi une promesse. transforme observable en promesse.
      .then((res: {token: string}) => {
        this.internalToken$.next(res.token);
        if(keepConnection) {
          this.localStorageManagerService.saveData(environment.LOCAL_STORAGE.TOKEN, res.token);
        }
      });
  }

  signOut() {
    this.internalToken$.next(undefined);
    this.localStorageManagerService.removeData(environment.LOCAL_STORAGE.TOKEN);
  }
}
