import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../../services/pets.service';
import { MyPetCardComponent } from '../my-pet-card/my-pet-card.component';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';
import { HumansService } from '../../../services/humans.service';
import { CommunitiesService } from '../../../services/communities.service';
import { UsersService } from '../../../services/users.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import _ from 'lodash';

@Component({
  selector: 'app-my-pets',
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
    MatInputModule
  ],
  templateUrl: './my-pets.component.html',
  styleUrl: './my-pets.component.css',
  host: {
    '(window:scroll)': 'onScroll()'
  }
})

export class MyPetsComponent {
  @ViewChild('invisibleCard') card: any | undefined;
  pets: any[] = [];
  page = 1;
  message = "";
  userName = "claudio"
  showCommunitySelector = false;
  communityGroups: any = [];

  constructor(
    private petsService: PetsService,
    private humansService: HumansService,
    private usersServices: UsersService,
    private communitiesService: CommunitiesService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.loadMyCommunities();
    this.route.data.subscribe(async (params: any) => {
      console.log(params, "delicatesen")
      let requireVerifyUserRole = false;
      if (params.rqUserLoggedIn == false) {
      } else {
        requireVerifyUserRole = true;
      }
      if (requireVerifyUserRole) {
        const username = this._authService.getUserName();
        if (!this.utilsService.canAccessThisPage("only-with-username", username)) this.router.navigate(['/alerts']);
      }
      if (params.scope == "all") this.loadPets(10, this.page, "");
      if (params.scope == "favorite") this.loadPetsByHumanId(10, this.page, "");
      if (params.scope == "community") {
        this.showCommunitySelector = true;
        // this.loadPetsByCommunity(10, this.page, "");
      }
    })
  }

  // async loadPetsByCommunity(pageSize: number, page: number, filter: string) {
  async loadPetsByCommunity(id: string) {
    console.log("Trae las mascotas de una comunidad");
    // const id = this.route.snapshot.params['id'];
    if(id == undefined) return;
    const community: any = await this.communitiesService.getCommunity(id);
    console.log(community.petMembers);
    // this.pets = this.pets.concat(community.petMembers);
    this.pets = community.petMembers;
    this.page++;
  }

  async loadPets(pageSize: number, page: number, filter: string) {
    console.log("llamando a todas las mascotas");
    const data: any = await this.petsService.getPets(pageSize, page, filter);
    this.pets = this.pets.concat(data.docs);
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
      this.loadPets(10, this.page, "");
    }
  }

  private isScrolledIntoView(el: any): boolean {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    return elemTop >= 0 && elemBottom <= window.innerHeight;
  }
  async loadMyCommunities(){
    console.log(this.userName,"mmma");
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

  showPetsByCommunity(elem: any) {
    console.log(elem,"kkkkkKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");
    this.loadPetsByCommunity(elem.value);
    // this.router.navigate(['/my-pets/community', elem.value]);
    // this.router.navigate(['/my-pets/community', elem.value], 
    //   { 
    //     queryParams: {rqUserLoggedIn: true, scope: 'community', communityId: elem.value},
    //     skipLocationChange: true
    //    });
  }
}
