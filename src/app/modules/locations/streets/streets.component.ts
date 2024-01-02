import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map, marker, tileLayer } from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { CommunitiesService } from '../../../services/communities.service';
import { GeoserverService } from '../../../services/geoserver.service';
import { VetsService } from '../../../services/vets.service';
import { PetshopsService } from '../../../services/petshops.service';

// https://www.youtube.com/watch?v=LBbGFnZwRXs

@Component({
  selector: 'app-streets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streets.component.html',
  styleUrl: './streets.component.css'
})
export class StreetsComponent {
  coordinates: any = [-12.12178065, -77.0304221110424];
  locationToShow = "";
  constructor(
    private route: ActivatedRoute,
    private communitiesService: CommunitiesService,
    private vetsService: VetsService,
    private petshopsService: PetshopsService,
    private geoserverService: GeoserverService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const communityId = params['community'];
      const vetId = params['vet'];
      const petshopId = params['petshop'];
      let location: any;
      this.locationToShow = communityId ? "Communities" : (vetId ? "Vets" : ( petshopId ? "Petshops" : "")) 
      if(communityId) location = await this.communitiesService.getCommunity(communityId);
      if(vetId) location = await this.vetsService.getVet(vetId);
      if(petshopId) location = await this.petshopsService.getPetshop(petshopId);
      if (location) {
        this.coordinates = [location.coordinates.x, location.coordinates.y];
        this.viewMap(location);
        // this.getData(community);
      }
    });
  }

  ngAfterViewInit(): void {
  }

  viewMap(community: any) {
    const map = new Map('map').setView(this.coordinates, 19);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    marker(this.coordinates).addTo(map).bindPopup(community.name);
  }

  getData(community: any){
    console.log(community)
    const data = this.geoserverService.getGeoData(this.coordinates[0], this.coordinates[1]).subscribe((data) => {
      console.log('GeoServer Response:', data);
    });;
  }
}
