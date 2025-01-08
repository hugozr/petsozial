import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HumansService } from '../../../../../services/humans.service';
import { AuthService } from '../../../../../services/auth.service';
import { UtilsService } from '../../../../../services/utils.service';

@Component({
  selector: 'app-pet-to-human',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pet-to-human.component.html',
  styleUrl: './pet-to-human.component.css'
})
export class PetToHumanComponent {
  email: string = '';
  founded: any = null;
  form!: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<PetToHumanComponent>,
    private formBuilder: FormBuilder,
    private humansService: HumansService,
    private _authService: AuthService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any     //Recibe la mascota que se esta editabdo
  ) { 
    const email = this._authService.getUserEmail() || "";
    this.form = this.formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    console.log(this.data, "evaluar el actual")    
  }

  async findData() {
    const email = this.form.get("email")?.value;
    console.log(this.data, "nulo?")
    if(email == this.data?.human.email){    //Puede ser nulo porque puede ser insercion
      this.utilsService.showMessage("Choose another email. It's the same");
      return;
    }
    const humans: any = await this.humansService.getHumansByEmail(email);
    if (humans.length == 0) {
      this.utilsService.showMessage("No human found with this email.");
      return
    }
    this.founded = humans[0]; 
  }

  close(value?: any) {
    if (value) this.dialogRef.close(value);
    else this.dialogRef.close();
  }
}
