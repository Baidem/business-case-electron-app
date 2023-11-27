import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition, faHouse, faUmbrellaBeach, faUser } from '@fortawesome/free-solid-svg-icons';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isConnected$?: Observable<boolean>;

  iconHome: IconDefinition = faHouse
  iconLogout: IconDefinition = faUser
  iconUmbrellaBeach: IconDefinition = faUmbrellaBeach
  iconSignOut: IconDefinition = faUser

  // constructeur executé une seule fois à la création du composant
  constructor (private authService: AuthService, private router: Router) {}

  // ngOnInit est executé à chaque fois que le composant est affiché
  ngOnInit(): void {
    // solution 1
    // const cbExecuteEachTimeNewTokenNexted = (token: string | undefined) => {
    //   this.isConnected = Boolean(token)
    // }

    // this.authService
    // .token$
    // .subscribe(cbExecuteEachTimeNewTokenNexted);

    // solution 3
    // Opérer une transformation d'une string vers un booléen
    this.isConnected$ = this.authService
      .token$
      .pipe(
        map((token:string | undefined) => Boolean(token))
      )
  }

  onClickSignOut() {
    this.authService.signOut()
    this.router.navigateByUrl('/auth/signin')
  }
}
