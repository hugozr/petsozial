import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PortalService } from '../../services/portal.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatToolbarModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  htmlText = '';

  constructor(
    private portalService: PortalService
    ) { }

  ngOnInit(): void {
    this.loadWelcome();
  }

  loadWelcome(){
    this.portalService.getWelcome().subscribe( (data: any) => {
      console.log(data);
      this.htmlText = data.html;
    })
  }
}
