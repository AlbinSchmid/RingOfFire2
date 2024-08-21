import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { log } from 'console';
import { PlayerComponent } from './player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AddPlayerDialogComponent } from './add-player-dialog/add-player-dialog.component';
import { ToDoInfoComponent } from './to-do-info/to-do-info.component';
import { FirebaseService } from '../shared/service/firebase.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    AddPlayerDialogComponent,
    MatButtonModule,
    MatIconModule,
    ToDoInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  takeCardAnimation: boolean = false;
  currentCard: string = '';

  constructor(public dialog: MatDialog, public firebaseService: FirebaseService, private activeRoute: ActivatedRoute) {

  }


  ngOnInit() {
    this.putCardsInCardStack();
    this.shuffle(this.firebaseService.cardStack);
    this.activeRoute.params.subscribe((params) => {
      console.log(params['id']);
      this.firebaseService.gameId = params['id'];
    });

  }


  putCardsInCardStack() {
    for (let i = 1; i < 14; i++) {
      this.firebaseService.cardStack.push('ace_' + i)
      this.firebaseService.cardStack.push('hearts_' + i)
      this.firebaseService.cardStack.push('clubs_' + i)
      this.firebaseService.cardStack.push('diamonds_' + i)
    }
  }


  shuffle(array: any) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

  }


  takeCard() {
    if (!this.takeCardAnimation) {
      let card = this.firebaseService.cardStack.pop();
      if (card != undefined) { // Wir müssen eine zwischenabfrage machen da das Array auch ein undefined sein könnte, aber currentCard sollte nur in string sein. sonst ERROR
        this.currentCard = card;
      }
      this.firebaseService.currentPlayer++;
      this.firebaseService.currentPlayer = this.firebaseService.currentPlayer % this.firebaseService.players.length; // setzt current player zurück wenn es größer ist als das array


      this.takeCardAnimation = true;
      setTimeout(() => {
        this.firebaseService.playedCards.push(this.currentCard);
        this.takeCardAnimation = false;
        this.firebaseService.uptateGame();
      }, 1000)
    }
  }


  openDialog() {
    const dialogRef = this.dialog.open(AddPlayerDialogComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name.length > 0) {
        this.firebaseService.players.push(name);
      }
      setTimeout(() => {
        this.firebaseService.uptateGame();
      })
    });
  }
}
