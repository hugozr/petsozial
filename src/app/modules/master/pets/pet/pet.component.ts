import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpeciesService } from '../../../../services/species.service';
import { Specie } from '../../../../interfaces/specie';
import { Breed } from '../../../../interfaces/breed';
import { Pet } from '../../../../interfaces/pet';
import { PetsService } from '../../../../services/pets.service';
import { ActivatedRoute } from '@angular/router';


interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-pet',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css'
})
export class PetComponent {
  rowspan = 9;
  species: Specie[] = [];
  breeds: Breed[] = [];
  form!: FormGroup;
  petToEdit!: Pet;
  insert = true;

  constructor(
    private speciesService: SpeciesService,
    private petsService: PetsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { 
  }

  ngOnInit(): void {
    this.loadSpecies();
    this.form = this.formBuilder.group({
      name: ["", Validators.required],
      human: ["", Validators.required],
      specie: ["", Validators.required],
      breed: [""],
      comment: [""],
      address: [""],
    });
    this.route.params.subscribe(async (params: any) => {
      if(params.id){
        this.insert = false;
        this.petToEdit = await this.petsService.getPet(params.id);
        this.selectedSpecieChanged(this.petToEdit.specie.specieId);   //HZUMAETA es importante para cargar un combo dependiente
        console.log(this.petToEdit, "edicion", this.form, this.breeds,"bredddds");
        this.form.setValue({
          name: this.petToEdit.name,
          human: this.petToEdit.human,
          comment: this.petToEdit.comment,
          address: this.petToEdit.address,
          specie: this.petToEdit.specie.specieId,
          breed: this.petToEdit.breed.breedId,
        });
      }
    });
  }

  async loadSpecies() {
    this.species = await this.speciesService.getSpecies();
  }

  selectedSpecieChanged(specieId: string) {
    const result = this.species.find(item => item.id === specieId);
    if (result) {
      this.breeds = result.breeds;
    } else {
      console.log("Elemento no encontrado");
    }
  }

  async savePet() {
    const specieName = this.search(this.species, "id", "name", this.form.value.specie);
    const breedName = this.search(this.breeds, "id", "name", this.form.value.breed);
    const pet: Pet = {
      "name": this.form.value.name,
      "human": this.form.value.human,
      "comment": this.form.value.comment,
      "address": this.form.value.address,
      "specie": {specieId: this.form.value.specie, name: specieName},
      "breed":  {breedId: this.form.value.breed, name: breedName},
    }
    console.log(pet, this.form);
    const petResult = this.insert ? await this.petsService.insertPet(pet) : await this.petsService.updatePet(this.petToEdit.id, pet);
  }
  
  search(array: any, searchKey: string, returnKey: string, identifier: string) {
    const result = array.find((item: any) => item[searchKey] === identifier);
    return result ? result[returnKey] || '' : '';
  }
}

