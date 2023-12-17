import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-human-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './human-card.component.html',
  styleUrl: './human-card.component.css'
})
export class HumanCardComponent implements OnInit {
  @Input() human: any = null;
  @Input() imageUrl: string = '';

  
  ngOnInit(): void {
    console.log(this.imageUrl, this.human)
  }
}
