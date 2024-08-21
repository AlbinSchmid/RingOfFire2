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
  unsubGame;


  constructor(public dialog: MatDialog, public firebaseService: FirebaseService, private activeRoute: ActivatedRoute) {
    this.activeRoute.params.subscribe((params) => {
      this.firebaseService.gameId = params['id'];
    });
    this.unsubGame = this.firebaseService.subGamesList();
  }


  /**
   * Wir unsubscriben es wieder damit wir nicht dauerhaft von server daten laden.
   */
  ngOnDestroy() {
    this.unsubGame();
  }



  /**
   * Diese funktion wird auferufen wenn wir eine karte ziehen.
   */
  takeCard() {
    if (!this.firebaseService.takeCardAnimation) {
      let card = this.firebaseService.cardStack.pop(); // entfernt die letze karte im array
      if (card != undefined) { // Wir müssen eine zwischenabfrage machen da das Array auch ein undefined sein könnte, aber currentCard sollte nur in string sein. sonst ERROR
        this.firebaseService.currentCard = card;
      }
      this.firebaseService.currentPlayer++;
      this.firebaseService.currentPlayer = this.firebaseService.currentPlayer % this.firebaseService.players.length; // setzt current player zurück wenn es größer ist als das array
      this.forTheCardAnimation();
    }
  }


  /**
   * Hier wird cardAnimation verwaltet und die gespielten karten werden in das Array gepackt.
   */
  forTheCardAnimation() {
    this.firebaseService.takeCardAnimation = true;
    this.firebaseService.uptateGame();
    setTimeout(() => {
      this.firebaseService.playedCards.push(this.firebaseService.currentCard);
      this.firebaseService.takeCardAnimation = false;
      this.firebaseService.uptateGame();
    }, 1000)
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
