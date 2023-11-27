import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { AuthService } from '../auth/auth.service';
import { User, UserForm, UserHttp } from 'src/app/models/user.model';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // 'http://localhost:8033/api/users/
  private baseUrlApi: string = environment.API_URL;
  // Important modifier selon requête http
  private resourceName: string = 'users';
  private fullBaseUrlApi: string;

  constructor(private http: HttpClient) {
    this.fullBaseUrlApi = this.baseUrlApi + this.resourceName;
  }
  // GET ALL
  getAll(): Promise<User[]> {
    const obsHttp$ = this.http
    .get<UserHttp[]>(`${this.fullBaseUrlApi}/`)
    .pipe(
      map((usersHttp: UserHttp[]) => usersHttp.map((userHttp: UserHttp) => User.mapperUserHttpToUser(userHttp)))
    );

    return firstValueFrom(obsHttp$);
  }
  // GET BY ID
  getById(id: number): Promise<User> {
    const obsHttp$ = this.http
      .get<UserHttp>(`${this.fullBaseUrlApi}/${id}`)
      .pipe(
        map((userHttp: UserHttp) => User.mapperUserHttpToUser(userHttp))
    );

    return firstValueFrom(obsHttp$);
  }
  // ADD USER
  add(userToAdd: UserForm): Promise<any> {
    const obsHttp$ = this.http
      .post(`${this.fullBaseUrlApi}/`, userToAdd);

    return firstValueFrom(obsHttp$); // toPromise

  }
  // EDIT USER
  edit(id: number, userEdited: UserForm): Promise<any> {
    const obsHttp$ = this.http
      .put(`${this.fullBaseUrlApi}/${id}`, userEdited);

    return firstValueFrom(obsHttp$); // toPromise
  }
  // DELETE BY ID
  deleteById(id: number): Promise<any> {
    const obsHttp$ = this.http
      .delete(`${this.fullBaseUrlApi}/${id}`);

    return firstValueFrom(obsHttp$);
  }
}
