import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../../services/pets.service';
import { MyPetCardComponent } from '../my-pet-card/my-pet-card.component';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/auth.service';
import { HumansService } from '../../../services/humans.service';
import { CommunitiesService } from '../../../services/communities.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import _ from 'lodash';

@Component({
  selector: 'app-my-pets-grid',
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
  templateUrl: './my-pets-grid.component.html',
  styleUrl: './my-pets-grid.component.css',
  host: {
    '(window:scroll)': 'onScroll()'
  }
})

export class MyPetsGridComponent {
  @ViewChild('invisibleCard') card: any | undefined;
  @Input() filterData: any = null;
  @Input() filterOptions: any = null;
  @Input() zoneId: string = "";
  pets: any[] = [];
  page = 1;
  message = "";
  userName = "abc"    //TODO: sacar abc
  showCommunitySelector = false;
  flagFilterByCommunity = false;

  constructor(
    private petsService: PetsService,
    private humansService: HumansService,
    private communitiesService: CommunitiesService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    console.log(this.zoneId, "atento con la zona");
    // this.loadData();
  }

  loadData(perPage: number, pageNumber: number) {
    // if (this.filterOptions.scope == "all") this.loadPetsByZone(this.zoneId, 10, this.page, "");
    // if (this.filterOptions.scope == "favorite") this.loadPetsByHumanId(10, this.page, "");
    // if (this.filterOptions.scope == "community") this.flagFilterByCommunity = true;
  
    if (this.filterOptions.scope == "all") this.loadPetsByZone(this.zoneId, perPage, pageNumber, "");
    if (this.filterOptions.scope == "favorite") this.loadPetsByHumanId(perPage, pageNumber, "");
    if (this.filterOptions.scope == "community") this.flagFilterByCommunity = true;
  
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterData']) {
      this.onFilterDataChange(changes['filterData'].currentValue);
    };
    if (changes['zoneId']) {
      this.zoneId = changes['zoneId'].currentValue;
      this.loadData(10, 0);
    }
  }

  async onFilterDataChange(newValue: any) {
    if (this.flagFilterByCommunity) {
      await this.loadPetsByCommunity(newValue);
    }
  }

  // async loadPets(pageSize: number, page: number, filter: string) {
  //   const data: any = await this.petsService.getPets(pageSize, page, filter);
  //   this.pets = this.pets.concat(data.docs);
  //   this.page++;
  // }

  async loadPetsByZone(zoneId: string, pageSize: number, page: number, filter: string) {
    console.log("trae las mascotas de la zona", zoneId)
    const data: any = await this.petsService.getPetsByZone(zoneId, pageSize, page, filter);
    this.pets = page == 0 ?  data.docs : this.pets.concat(data.docs);
    this.page++;
  }

  async loadPetsByHumanId(pageSize: number, page: number, filter: string) {
    const userEmail = this._authService.getUserEmail();
    if (userEmail == undefined) return;
    const humans: any = await this.humansService.getHumansByEmail(userEmail);
    if (humans.length == 0) return;
    const humanId = humans[0].id
    const pets: any = await this.petsService.filterPetsByHumanId(pageSize, page, filter, humanId);
    if (pets === null) {
      this.message = "Without favorite pets";
      return;
    }
    this.pets = this.pets.concat(pets);
    this.page++;
  }

  onScroll(): void {
    if (this.card && this.isScrolledIntoView(this.card._elementRef.nativeElement)) {
      this.loadPetsByZone(this.zoneId, 10, this.page, "");
    }
  }

  private isScrolledIntoView(el: any): boolean {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    return elemTop >= 0 && elemBottom <= window.innerHeight;
  }

  async loadPetsByCommunity(filter: any) {
    if (filter.value == undefined) return;
    const community: any = await this.communitiesService.getCommunity(filter.value);
    this.pets = community.petMembers;
    this.page++;
  }
}
