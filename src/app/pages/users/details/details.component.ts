import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{

  user$?: Promise<User>

  constructor (private userService: UserService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Correspond au :id que k'on a mis dans le app-routing.module.ts
    const id= this.route.snapshot.paramMap.get('id');

    if (id) {
      this.user$ = this.userService.getById(parseInt(id));
    }
    else {
      this.router.navigateByUrl('/not-found');
    }
  }
}
