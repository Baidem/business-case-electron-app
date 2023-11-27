import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User, UserForm } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';
import Country = User.Country;
import { BehaviorSubject, Observable, combineLatest, debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit{
  // PROP
  countries = Country;

  users$?: Observable<User[]>

  // For delete action
  selectedUserDeleteConfirmation?: User;
  showDeleteSuccessToast: boolean = false;

  // For edit user
  selectedUserForEdition?: User;
  userForm?: FormGroup;

  // For search
  private searchFilterText$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined)

  constructor (private userService: UserService, private modalService: NgbModal, private fb: FormBuilder) {}

  // ON INIT
  ngOnInit(): void {
    this.users$ = this.getUsersFiltered()
  }
  // ON INPUT SEARCH FILTER
  onInputSearchFilter(evt: any): void {
    const searchText = evt.target.value;
    this.searchFilterText$.next(searchText);

  }
  // ON CLICK DELETE USER
  onClickDeleteUser(modalDeleteUser: any, user: User): void {
    this.selectedUserDeleteConfirmation = user;

    const modal = this.modalService.open(modalDeleteUser);

    modal.result
      .then(() => {
        this.userService
        .deleteById(user.id)
        .then(() => {
          this.showDeleteSuccessToast = true;
          this.users$ = this.getUsersFiltered()
        })
      })
      .catch(() => {})
    }
    // ON CLICK ADD USER
    onClickAddUser(modalUserForm: any): void{

      this.initUserForm();

      const modal = this.modalService.open(modalUserForm);

      modal.result
        .then(() => {
          const userForm: UserForm ={
            /*
            Technique 1 fastidieuse
            const userForm: UserForm = {
              email: this.userForm?.value.email,
              firstname: this.userForm?.value.firstname,
              lastname: this.userForm?.value.lastname,
              password: this.userForm?.value.password,
              residenceCountry: 'France',
              roles: [{ id: 1}]
            }
            */

            // Technique 2 avec destructuration
            ...this.userForm?.value,
            roles: [{ id: 1 }],
            familyLink: {
              id: 7
            },
            currentFidelityRank: {
              id: 1
            }
          }
          console.log(userForm);

          this.userService
          .add(userForm)
          .then(() => {
            this.users$ = this.getUsersFiltered()
          })

        })
        .catch(() => {})
    }
    // ON CLICK EDIT USER
    onClickEditUser(modalUserForm: any, userToEdit: User): void{

      this.initUserForm(userToEdit);

      this.selectedUserForEdition = userToEdit;

      const modal = this.modalService.open(modalUserForm);

      modal.result
        .then(() => {

          const userForm: UserForm ={
            familyLink: {
              id: 7
            },
            currentFidelityRank: {
              id: 1
            },
            roles: userToEdit.roles,
            ...this.userForm?.value
          };
          console.log(userForm);

          this.userService
          .edit(userToEdit.id, userForm)
          .then(() => {
            this.users$ = this.getUsersFiltered()
            this.selectedUserForEdition = undefined;
          })

        })
        .catch(() => {
          this.selectedUserForEdition = undefined;
        })
    }
    //ON SUBMIT USER FORM
    onSubmitUserForm(modal: any){
      // On check si le formulaire est invalide
      // si oui on fait rien
      // si non on soumet le formulaire
      if(this.userForm?.valid){
        console.log("onSubmitUserForm");

        modal.close();
      }
    }
    // INIT USER FORM
    private initUserForm(userToEdit?: User): void {
        // Un group c'est un ensemble de control
        // Un control est lié à un champ HTML (input par exemple)
        // Un control possède un tableau de deux index
        // index 0 la valeur par défaut
        // index 1 les validators (array)
        this.userForm = this.fb.group({
        email: [userToEdit ? userToEdit.email : undefined, [Validators.required, Validators.email, Validators.minLength(6)]],
        firstname: [userToEdit ? userToEdit.firstname : undefined, [Validators.required]],
        lastname: [userToEdit ? userToEdit.lastname : undefined, [Validators.required]],
        password: [undefined, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':",.<>\/?]).{8,}$/)]],
        residenceCountry: [userToEdit ? userToEdit.residenceCountry : Country.FRANCE, [Validators.required],]
      })
    }
    // GET USER FILTERED
    private getUsersFiltered(): Observable<User[]> {
      return combineLatest([
        this.userService.getAll(),
        this.searchFilterText$
      ])
        .pipe(
          debounceTime(500),
          map(([users, searchText]) => {
            if(searchText) {
              return users.filter(u => u.firstname.toLowerCase().includes(searchText.toLowerCase()) || u.lastname.toLowerCase().includes(searchText.toLowerCase()))
            }
            return users
          })
        )
    }
}
