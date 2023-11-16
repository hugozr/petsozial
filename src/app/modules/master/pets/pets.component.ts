import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { PetsService } from '../../../services/pets.service';
import { Pet } from '../../../interfaces/pet';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatTableModule],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export class PetsComponent implements OnInit{
  // displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = ['name'];
  dataSource: Pet[] = [];
  pets: Pet[] = [];

  constructor(private petsService: PetsService) { }

  ngOnInit(): void {
    this.loadPets();
  }

  async loadPets(){
    const data: any= await lastValueFrom(this.petsService.getPets());
    data.docs.map((elem: any) => {
      this.pets.push({
        name: elem.name,
        sex: elem.sex,
        specie: elem.specie,
        birthday: elem.birthday,
        breed: elem.breed,
        comment: elem.comment
      });
    });
    this.dataSource = this.pets;
  }


  loadPetsx(){
    this.petsService.getPets().subscribe((data: any) => {
      const ps: Pet[] = [];
      console.log(ps, "antes", this.pets)
      data.docs.map((elem: any) => {
        // this.pets.push({
        ps.push({
          name: elem.name,
          sex: elem.sex,
          specie: elem.specie,
          birthday: elem.birthday,
          breed: elem.breed,
          comment: elem.comment
        });
      });
      this.pets = ps;
      console.log(ps, "despues", this.pets)
    })
    console.log("...aaaaaaa",this.pets, this.pets.length);


  }


}
