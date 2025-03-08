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
import { AuthService } from '../../../services/auth.service';
import { EventsService } from '../../../services/events.service';
import { Subscription } from 'rxjs';
import { ZonesService } from '../../../services/zones.service';

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

  userName!: string;     //TODO: quitar abc
  pets: any[] = [];
  page = 1;
  communityGroups: any = [];

  selectedZone: string = "";
  private eventSubscription?: Subscription;
  
  constructor(
    private communitiesService: CommunitiesService,
    private _authService: AuthService,
    private eventsServices: EventsService,
    private zonesServices: ZonesService,

  ) { }

  ngOnInit(): void {
    this.selectedZone = this.zonesServices.getCurrentZone();
    this.userName = ""; // this._authService.getUserName();
    this.loadMyCommunities();
    this.eventSubscription = this.eventsServices.event$.subscribe(data => {
      this.selectedZone = data;
      this.loadMyCommunities();
      // const resetFilter: any = { filter: "community", value: null };
      // this.selectedValueChange.emit(resetFilter);
    });
  }

  onComboChange(event: Event): void {
    const communityFilter: any = { filter: "community", value: event }
    this.selectedValueChange.emit(communityFilter); 
  }

  async loadMyCommunities() {
    if (this.userName) {
      const communities: any = await this.communitiesService.getCommunitiesByUsernameAndZone(this.userName, this.selectedZone);
      const transformedArray = _.chain(communities.docs)
        .groupBy('type')
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
