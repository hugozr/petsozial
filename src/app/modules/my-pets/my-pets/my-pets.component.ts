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

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    MyPetCardComponent,
    MatCardModule
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
  message = ""

  constructor(
    private petsService: PetsService,
    private humansService: HumansService,
    private communitiesService: CommunitiesService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
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
      if (params.scope == "community") this.loadPetsByCommunity(10, this.page, "");
    })
  }

  async loadPetsByCommunity(pageSize: number, page: number, filter: string) {
    const id = this.route.snapshot.params['id'];
    const community: any = await this.communitiesService.getCommunity(id);
    console.log(community);
    this.pets = this.pets.concat(community.petMembers);
    this.page++;
  }
  async loadPets(pageSize: number, page: number, filter: string) {
    const data: any = await this.petsService.getPets(pageSize, page, filter);
    this.pets = this.pets.concat(data.docs);
    this.page++;
  }
  async loadPetsByHumanId(pageSize: number, page: number, filter: string) {
    const userEmail = this._authService.getUserEmail();
    if (userEmail == undefined) return;
    const humans: any = await this.humansService.getHumansByEmail(userEmail);
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
}
