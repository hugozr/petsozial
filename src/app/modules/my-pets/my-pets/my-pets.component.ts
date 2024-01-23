import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../../services/pets.service';
import { MyPetCardComponent } from '../my-pet-card/my-pet-card.component';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private petsService: PetsService,
    private router: Router,
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe(async (params: any) => {
    this.route.data.subscribe(async (params: any) => {

      let requireVerifyUserRole = false;
      if (params.rqUserLoggedIn == false){
      } else { 
        requireVerifyUserRole = true;
      }

      if(requireVerifyUserRole){
        const username = this._authService.getUserName();
        if (!this.utilsService.canAccessThisPage("only-with-username", username)) this.router.navigate(['/alerts']);
      }
      
      this.loadPets(10,this.page,"");
    })
  }
  
  async loadPets(pageSize: number, page: number, filter: string ) {
    const data: any = await this.petsService.getPets(pageSize, page, filter);
    this.pets = this.pets.concat(data.docs);
    this.page++;
  }

  onScroll(): void {
    if (this.card && this.isScrolledIntoView(this.card._elementRef.nativeElement)) {
    this.loadPets(10,this.page,"");
    }
  }

  private isScrolledIntoView(el: any): boolean {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;
    return elemTop >= 0 && elemBottom <= window.innerHeight;
  }
}
