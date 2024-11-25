import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunitiesService } from '../../../../services/communities.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../../../services/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-human-to-community',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatToolbarModule,
  ],
  templateUrl: './human-to-community.component.html',
  styleUrl: './human-to-community.component.css'
})
export class HumanToCommunityComponent {
  communityId = "";
  form!: FormGroup;
  email: string = '';
  positions: any = [];

  constructor(
    private communitiesService: CommunitiesService,
    public dialog: MatDialog,
    private _authService: AuthService,
    private formBuilder: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    const email = this._authService.getUserEmail() || "";
    this.form = this.formBuilder.group({
      email: [email, [Validators.required, Validators.email]],
      position: [],
      description: []
    });
  }

  async ngOnInit(): Promise<void> {
    console.log(this.data);
    this.communityId = this.data.community.id;
    const community: any = await this.communitiesService.getCommunityById(this.communityId);
    if(community){

      this.positions = community.type.positions
      console.log(this.positions,"asasasa")
    }
  }

  addHumanToCommunity(){}


 
  onPositionChange(selectedPosition: any): void {
    console.log(selectedPosition, "nadaaaaaaaaaa")
    
    // Actualiza la descripción en el formulario
    this.form.patchValue({
      description: selectedPosition ? selectedPosition.description : ''
    });
  }

  close() {
    // this.dialogRef.close(this.refreshMembers);
  }
}
