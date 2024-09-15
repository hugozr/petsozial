import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HumansService } from '../../../services/humans.service';
import { HumanRolesService } from '../../../services/humanRoles.service';
import { MatSelectModule } from '@angular/material/select';
import { UtilsService } from '../../../services/utils.service';

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
    MatSelectModule
  ],
  templateUrl: './pet-contact-human.component.html',
  styleUrl: './pet-contact-human.component.css'
})
export class PetContactHumanComponent {
  email: string = '';
  founded: any = null;
  form!: FormGroup;
  rolesForm!: FormGroup;
  // roles: any [] = [{"id": "1", "name": "aaaa"}];
  roles: any [] = [];
  constructor(
    private dialogRef: MatDialogRef<PetContactHumanComponent>,
    private formBuilder: FormBuilder,
    private humansService: HumansService,
    private humanRolesService: HumanRolesService,
    private _utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    this.form = this.formBuilder.group({
      // email: ["", [Validators.required, Validators.email]],
      email: ["abc@a.com", [Validators.required, Validators.email]],
    });
    this.rolesForm = this.formBuilder.group({
      roles: [[]],
    });
  }

  async ngOnInit(): Promise<void> {
    // console.log("de aca debo sacar el id de pet", this.data)
  }

  async findData() {
    const email = this.form.get("email")?.value;
    const humans: any = await this.humansService.getHumansByEmail(email);
    if (humans.length != 0) {
      this.founded = humans[0];
      const contacts: any = await this.humanRolesService.getPetContactHuman(this.founded.id, this.data.id);
      if(contacts[0]){
        const contact = contacts[0];
        this._utilsService.showMessage("This human and I are already in contact.");
        //HZUMAETA: Muestra los datos en el combo
        this.rolesForm.setValue({
          roles: contact.roles,
        });
      }

      this.roles = await this.humanRolesService.getHumanRoles();
    }
  }

  close() {
    const value = this.founded; //con los roles
    const devolution: any = {
      roles:  this.rolesForm.value,
      humanData: this.founded,
    }
    // console.log(this.rolesForm.value, "ver valores de los roles");
    if (value) this.dialogRef.close(devolution);
    else this.dialogRef.close();
  }
}
