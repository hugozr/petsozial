import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../services/users.service';
import { CommunitiesService } from '../../../services/communities.service';
import { MyPetCardComponent } from '../my-pet-card/my-pet-card.component';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import _ from 'lodash';

@Component({
  selector: 'app-my-pets-selector',
  standalone: true,
  imports: [
    CommonModule,
    MyPetCardComponent,
    MatCardModule,
    CommonModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './my-pets-selector.component.html',
  styleUrl: './my-pets-selector.component.css'
})
export class MyPetsSelectorComponent {
  @Output() selectedValueChange = new EventEmitter<string>(); // Emite el valor seleccionado

  userName = "abc";
  pets: any[] = [];
  page = 1;
  communityGroups: any = [];

  constructor(
    private usersServices: UsersService,
  ){}

  ngOnInit(): void {
    this.loadMyCommunities();
  }

  onComboChange(event: Event): void {
    const communityFilter: any = {filter: "community", value: event}
    this.selectedValueChange.emit(communityFilter); // Emitir el valor seleccionado
  }

  selectCommunity(elem: any) {
    this.selectedValueChange.emit(elem); // Emitir el valor seleccionado
  }
    
  async loadMyCommunities(){
    if (this.userName) {
      const users: any = await this.usersServices.getUsersByName(this.userName);
      //TODO: Pasarlo al backend
      if (users.docs[0]) {
        const communities = users.docs[0].communities;
        const transformedArray = _.chain(communities)
          .groupBy('type.id')
          .map((items: any, typeId: any) => ({
            id: typeId,
            name: _.get(items[0], 'type.name', ''),
            disabled: _.get(items[0], 'type.disable', false),
            community: _.map(items, (item: any) => ({
              value: item.id,
              viewValue: item.name,
            })),
          }))
          .value();
        this.communityGroups = transformedArray;
      }
    }
  }

}
