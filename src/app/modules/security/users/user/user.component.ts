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
import { SettingsService } from '../../../../services/settings.service';

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
  rowspan = 8;
  form!: FormGroup;
  userToEdit!: User;
  humanImage: string = "";
  backendURL = environment.backendPetZocialURL;
  roles!: any;
  insert = true;
  private timeoutId: any;
  constructor(
    private usersService: UsersService,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _utilsService: UtilsService,
  ) {
    this.form = this.formBuilder.group({
      username: ["",
        [Validators.required, this.noWhitespaceValidator],
        [this.validateIfUserExists.bind(this)]
      ],
      email: ["", [Validators.required, Validators.email],
        [this.validateIfEmailExists.bind(this)]],
      roles: [[]],
      password: ["", [Validators.minLength(3)]],
      humanId: [""],
    });
  }

  async ngOnInit(): Promise<void> {
    // this.roles = this.usersService.getRoles();
    const settings: any = await this.settingsService.getSettings();
    this.roles = settings.roles;

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
          password: ""
        });
      }
    });
  }
  async saveUser() {
    try {
      const user: User = {
        "username": this.form.value.username,
        "email": this.form.value.email,
        "roles": this.form.value.roles,
        "human": this.insert ? null : this.userToEdit.humanId,
      }
      if (this.insert) {
        user.password = environment.genericPassword;   //HZUMAETA Payload pide password
        const usrKeycloak: any = await this.createUserInKeycloak(this.form.value.username, this.form.value.email, this.form.value.password);
        user.keycloakUserId = usrKeycloak.id;
      };
      const userResult: any = this.insert ? await this.usersService.insertUser(user) : await this.usersService.updateUser(this.userToEdit.id, user);
      const userkcGroups = this.roles
        .filter((role: any) => this.form.value.roles.includes(role.value))
        .map((role: any) => role.keycloakGroup);

      // console.log("actualizar gripos en Keyloak busco el id de kc", userResult);
      if (userResult) {
        const kcUsrId = userResult.doc.keycloakUserId;
        const auth  = await this.usersService.assignGroupsToKeycloakUser(kcUsrId, {groups: userkcGroups});
        if(auth){
          this._utilsService.showMessage("User's data was successfully updated", 2000, true);
          if (this.insert) {
            this.router.navigate(["/security"]);
          }
        }
      }
    } catch (error: any) {
      const e: any = error.error.errors;
      console.log(e)
      if (e[0].name === 'ValidationError') {
        const errorMessage = e[0].data[0].message;
        this._utilsService.showMessage(errorMessage, 5000, false);
      } else {
        console.error('Error:', error);
      }
    }
  }

  async createUserInKeycloak(username: string, email: string, password: string) {
    const tokens: any = await this.usersService.getAccessTokens();
    const response = await this.usersService.insertKeycloakUser(tokens.access_token, username, email, password);
    if (response == "Created") {
      const user = await this.usersService.queryKeycloakUser(tokens.access_token, "username=" + username);
      return user;
    }
    return null;
  }

  async associateHuman(event: Event) {
    event.preventDefault();
    const userId: string = this.userToEdit.id ?? "";
    const associatedUser = await this.usersService.associateUserToHuman(userId);
    if (associatedUser) {
      this._utilsService.showMessage("usuario asociado a humano", 2000, false);
      this.userToEdit = await this.usersService.getUser(userId);
      console.log(this.userToEdit, "saco la imagen")
    } else {
      this._utilsService.showMessage("NO se ha podido asociar", 2000, false);
    }
  }

  noWhitespaceValidator(control: any) {
    const value = control.value || '';
    const hasWhitespace = /\s/.test(value); // Verificar si hay espacios en blanco
    const isValid = !hasWhitespace;
    return isValid ? null : { 'containsWhitespace': true };
  }

  async validateIfUserExists(control: any) {
    const username = control.value;
    if (!username) {
      return null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    return new Promise(resolve => {
      this.timeoutId = setTimeout(async () => {
        const response: any = await this.usersService.getUsersByName(username);
        resolve(response.totalDocs === 0 ? null : { 'usernameExists': true });
      }, 500);
    });
  }

  async validateIfEmailExists(control: any) {
    const email = control.value;
    if (!email) {
      return null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    return new Promise(resolve => {
      this.timeoutId = setTimeout(async () => {
        const response: any = await this.usersService.getUsersByEmail(email);
        console.log(response);
        resolve(response.totalDocs === 0 ? null : { 'emailExists': true });
      }, 500);
    });
  }

  loadImage() {
    this.fileInput.nativeElement.click();
  }
}
