import { Component, ElementRef, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { UsersService } from '../../../../services/users.service';
import { User } from '../../../../interfaces/user';

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
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @ViewChild('fileInput') fileInput: any;
  rowspan = 6;
  form!: FormGroup;
  userToEdit!: User;
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

  ngOnInit(): void {
    this.roles = this.usersService.getRoles();
    console.log(this.roles,"ssssssssssssssss");
    this.form = this.formBuilder.group({
      username: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      roles: [[]],
      humanId: [""],
    });
    this.route.params.subscribe(async (params: any) => {
      if(params.id){
        this.insert = false;
        this.userToEdit = await this.usersService.getUser(params.id);
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
    const user: User = {
      "username": this.form.value.username,
      "email": this.form.value.email,
      "roles": this.form.value.roles,
    }
    const userResult = this.insert ? await this.usersService.insertUser(user) : await this.usersService.updateUser(this.userToEdit.id, user);
    if (userResult){
      this._utilsService.showMessage("User's data was successfully updated");
      if(this.insert){
        this.router.navigate(["/security"]);
      }
    }
  }
  loadImage() {
    this.fileInput.nativeElement.click();
  }

  
}
