import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PetsService } from '../../../services/pets.service';
import { MyPetCardComponent } from '../my-pet-card/my-pet-card.component';
import { MatCardModule } from '@angular/material/card';


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

  constructor(private petsService: PetsService) {}

  ngOnInit(): void {
    this.loadPets(10,this.page,"");
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

    // Only completely visible elements return true:
    return elemTop >= 0 && elemBottom <= window.innerHeight;
  }
}
