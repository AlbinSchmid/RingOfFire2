import { Component, inject, Input, OnChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../shared/service/firebase.service';

@Component({
  selector: 'app-to-do-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  templateUrl: './to-do-info.component.html',
  styleUrl: './to-do-info.component.scss'
})
export class ToDoInfoComponent implements OnChanges {
  @Input() card = '';
  title = 'Pick Card';
  description = 'Please pick a card from the cardstack';

  constructor(public firebaseService: FirebaseService) {}

  ngOnChanges(): void {
    if (this.card) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.firebaseService.rules[cardNumber - 1].title;
      this.description = this.firebaseService.rules[cardNumber - 1].description;
    }
  }
}
