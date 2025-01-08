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
import { HumansService } from '../../../../services/humans.service';
import { UtilsService } from '../../../../services/utils.service';

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
  private timeoutId: any;

  constructor(
    private communitiesService: CommunitiesService,
    public dialog: MatDialog,
    private _authService: AuthService,
    private formBuilder: FormBuilder,
    private humansService: HumansService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    const email = this._authService.getUserEmail() || "";
    this.form = this.formBuilder.group({
      email: [email, [Validators.required, Validators.email],[
        this.validateIfHumanExists.bind(this), 
      ]],
      positionName: [],
      positionDescription: []
    });
  }

  async ngOnInit(): Promise<void> {
    this.communityId = this.data.community.id;
    const community: any = await this.communitiesService.getCommunityById(this.communityId);
    if(community){
      this.positions = community.type.positions
    }
  }

  async addHumanToCommunity(){
    const email = this.form.get("email")?.value;
    const humans: any = await this.humansService.getHumansByEmail(email);
    if (humans.length == 0) {
      this.utilsService.showMessage("The email address do not exists")
      return;
    }

    const response: any = await this.communitiesService.existsHumanByEmail(email, this.communityId);
    if(response.exists){
      this.utilsService.showMessage("The email already exists in this community");
      return;
    }

    const data: any =  {
      community: this.communityId, 
      human: humans[0].id,
      position: {
        name: (this.form.get("positionName")?.value).name,
        description: this.form.get("positionDescription")?.value,
      }
    };
    const humanCommunity: any = await this.communitiesService.insertHuman(data);
    console.log(humanCommunity, "ddddddddddddddd")
    if(humanCommunity){
      this.utilsService.showMessage("Human inserted");
    }
  }

  onPositionChange(selectedPosition: any): void {
    this.form.patchValue({
      positionDescription: selectedPosition ? selectedPosition.description : ''
    });
  }

  close() {
    // this.dialogRef.close(this.refreshMembers);
  }
  async validateIfHumanExists(control: any) {
    const email = control.value;
    if (!email) {
      return null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    return new Promise(resolve => {
      this.timeoutId = setTimeout(async () => {
        const response: any = await this.humansService.getHumansByEmail(email);
        resolve(response.length != 0 ? null : { 'humanNotExists': true });
      }, 500);
    });
  }


}
