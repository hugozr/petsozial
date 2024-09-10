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
import { MyPetsSelectorComponent } from "../my-pets-selector/my-pets-selector.component";
import { MyPetsGridComponent } from "../my-pets-grid/my-pets-grid.component";

@Component({
  selector: 'app-my-pets',
  standalone: true,
  imports: [
    CommonModule,
    MyPetsSelectorComponent,
    MyPetsComponent,
    MyPetsGridComponent
],
  templateUrl: './my-pets.component.html',
  styleUrl: './my-pets.component.css',
})

export class MyPetsComponent {
  filterSelector: any = null;
  filterOptions:  any = null;
  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(async (params: any) => {
      console.log(params, "ver los parametros para esconder community");
      this.filterOptions = params;
    })
  }

  onSelectedValueChange(value: any): void {
    this.filterSelector = value;
  }
}
