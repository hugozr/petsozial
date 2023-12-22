import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../interfaces/user';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HumanCardComponent } from '../../../master/humans/human-card/human-card.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    HumanCardComponent

  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 6;
  form!: FormGroup;
  userToEdit!: User;
  humanImage: string = "";
  backendURL = environment.backendPetZocialURL;
  roles!: any;
  insert = true;
  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
  ) {
  }

  noWhitespaceValidator(control: any) {
    const value = control.value || '';
    const hasWhitespace = /\s/.test(value); // Verificar si hay espacios en blanco
    const isValid = !hasWhitespace;
    return isValid ? null : { 'containsWhitespace': true };
  }

  ngOnInit(): void {
    this.roles = this.usersService.getRoles();
    this.form = this.formBuilder.group({
      username: ["", [Validators.required, this.noWhitespaceValidator]],
      email: ["", [Validators.required, Validators.email]],
      roles: [[]],
      humanId: [""],
    });
    this.route.params.subscribe(async (params: any) => {
      if (params.id) {
        this.insert = false;
        this.userToEdit = await this.usersService.getUser(params.id);

        const urlImage = this.userToEdit?.human?.humanImage?.sizes?.tablet?.url
        this.humanImage = urlImage ? this.backendURL + urlImage : "/assets/load-my-user-picture.png"

        this.form.get('username')!.disable();
        this.form.get('email')!.disable();

        this.form.setValue({
          username: this.userToEdit.username,
          email: this.userToEdit.email,
          roles: this.userToEdit.roles,
          humanId: this.userToEdit.humanId || "",
        });
      }
    });
  }
  async saveUser() {
    try{
      const user: User = {
        "username": this.form.value.username,
        "email": this.form.value.email,
        "roles": this.form.value.roles,
        "human": null
      }
      if (this.insert) user.password = environment.genericPassword;   //HZUMAETA Payload pide password
      const userResult = this.insert ? await this.usersService.insertUser(user) : await this.usersService.updateUser(this.userToEdit.id, user);
      if (userResult) {
        this._utilsService.showMessage("User's data was successfully updated", 2000, true);
        if (this.insert) {
          this.router.navigate(["/security"]);
        }
      }
    } catch (error: any) {
      const e:any = error.error.errors;
      console.log(e)
      if (e[0].name === 'ValidationError') {
        const errorMessage = e[0].data[0].message ;
        this._utilsService.showMessage(errorMessage, 5000, false);
      } else {
        console.error('Error:', error);
      }
    }
  }
  async associateHuman(event: Event) {
    event.preventDefault();
    const userId: string = this.userToEdit.id ?? "";
    const associatedUser = await this.usersService.associateUserToHuman(userId);
    if(associatedUser){
      this._utilsService.showMessage("usuario asociado a humano", 2000, false);
      this.userToEdit = await this.usersService.getUser(userId);
      console.log(this.userToEdit, "saco la imagen")
    } else {
      this._utilsService.showMessage("NO se ha podido asociar", 2000, false);
    }
  }
  loadImage() {
    this.fileInput.nativeElement.click();
  }
}


