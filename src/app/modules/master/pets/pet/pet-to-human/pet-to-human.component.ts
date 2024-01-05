import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HumansService } from '../../../../../services/humans.service';

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
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
    });
  }

  async buscarDatos() {
    const email = this.form.get("email")?.value;
    const humans: any = await this.humansService.getHumansByEmail(email);
    console.log(humans)
    if(humans.length != 0){
      this.founded = humans[0]; //{ "name": "pepito" };
    }
  }

  close(value?: any) {
    if (value) this.dialogRef.close(value);
    else this.dialogRef.close();
  }
}
