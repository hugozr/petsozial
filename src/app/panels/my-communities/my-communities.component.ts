import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Component({
  selector: 'app-my-communities',
  standalone: true,
  imports: [
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [

  ],
  templateUrl: './my-communities.component.html',
  styleUrl: './my-communities.component.css'
})
export class MyCommunitiesComponent {
  @Input() userName: string | undefined;

  zociedadGroups: any = [];

  constructor(
    private usersServices: UsersService,
    private router: Router,
  ) { }

  async ngOnInit() {
    if (this.userName) {
      const users: any = await this.usersServices.getUsersByName(this.userName);
      if (users.docs[0]) {
        const communities = users.docs[0].communities;
        const transformedArray = _.chain(communities)
          .groupBy('type.id')
          .map((items: any, typeId: any) => ({
            id: typeId,
            name: _.get(items[0], 'type.name', ''),
            disabled: _.get(items[0], 'type.disable', false),
            zociedad: _.map(items, (item: any) => ({
              value: item.id,
              viewValue: item.name,
            })),
          }))
          .value();
        this.zociedadGroups = transformedArray;
      }
    }
  }
  showPetsByCommunity(elem: any) {
    console.log(elem, "debo pasar el id de la comunidad");
    this.router.navigate(['/my-pets/community', elem.value], 
      { queryParams: {rqUserLoggedIn: false, scope: 'community', communityId: elem.value} });
  }
}
