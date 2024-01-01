import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map, marker, tileLayer } from 'leaflet';
import { ActivatedRoute } from '@angular/router';
import { CommunitiesService } from '../../../services/communities.service';

// https://www.youtube.com/watch?v=LBbGFnZwRXs

@Component({
  selector: 'app-streets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './streets.component.html',
  styleUrl: './streets.component.css'
})
export class StreetsComponent {


  // https://leaflet-extras.github.io/leaflet-providers/preview/
  coordinates: any = [-12.12178065, -77.0304221110424];
  constructor(
    private route: ActivatedRoute,
    private communitiesService: CommunitiesService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const communityId = params['community'];
      const community = await this.communitiesService.getCommunity(communityId);
      if (community) {
        this.coordinates = [community.coordinates.x, community.coordinates.y];
        this.viewMap(community);
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
}
