import { inject, Injectable, Output } from '@angular/core';
import { addDoc, collection, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { doc } from "firebase/firestore";
import { ActivatedRoute, Route, Router } from '@angular/router';
import { log } from 'node:console';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  playedCards: string[] = [];
  currentPlayer: any = 0;
  players: any[] = [];
  cardStack: string[] = [];
  rules = [
    { title: 'Waterfall', description: 'Everyone has to start drinking at the same time. As soon as player 1 stops drinking, player 2 may stop drinking. Player 3 may stop as soon as player 2 stops drinking, and so on.' },
    { title: 'You', description: 'You decide who drinks' },
    { title: 'Me', description: 'Congrats! Drink a shot!' },
    { title: 'Category', description: 'Come up with a category (e.g. Colors). Each player must enumerate one item from the category.' },
    { title: 'Bust a jive', description: 'Player 1 makes a dance move. Player 2 repeats the dance move and adds a second one. ' },
    { title: 'Chicks', description: 'All girls drink.' },
    { title: 'Heaven', description: 'Put your hands up! The last player drinks!' },
    { title: 'Mate', description: 'Pick a mate. Your mate must always drink when you drink and the other way around.' },
    { title: 'Thumbmaster', description: '' },
    { title: 'Men', description: 'All men drink.' },
    { title: 'Quizmaster', description: '' },
    { title: 'Never have i ever...', description: 'Say something you nnever did. Everyone who did it has to drink.' },
    { title: 'Rule', description: 'Make a rule. Everyone needs to drink when he breaks the rule.' },
  ];
  gameId = 'a';
  takeCardAnimation: boolean = false;
  currentCard: string = '';


  constructor(private router: Router) { }


  subGamesList() {
    return onSnapshot(this.getSingleDocRef('games', this.gameId), (element) => {
      const data = element.data();

      // Überprüfen, ob das Feld 'players' existiert
      if (data) {
        this.pushFirebaseDataToArrays(data);
      }
    })
  }


  /**
 * Kommen auf ein einzelnes collection in Firebase
 * @param colId - Id wo wir zugreifen in dem Dokument.
 * @param docId - Das Dokumenat wo unser collection liegt.
 * @returns - bekommen genau das object zurück.
*/
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }


  /**
   * Daten werden von der Firebase in unsere Arrays gespeichert.
   * @param data - Alle objekte die wir in unser Firebase haben unter dieser ID
   */
  pushFirebaseDataToArrays(data: any) {
    this.playedCards = [];
    this.players = [];
    this.cardStack = [];
    this.currentPlayer = data['currentPlayer'];
    this.currentCard = data['currentCard'];
    this.takeCardAnimation = data['takeCardAnimation'];
    this.getFirebaseData(data['players'], this.players);
    this.getFirebaseData(data['playedCards'], this.playedCards);
    this.getFirebaseData(data['cardStack'], this.cardStack);
  }


  /**
   * 
   * @param data - Das Array aus der Firebase wo wir die daten uns holen wollen.
   * @param arr - Das Array wo wir es gespeichert haben wollen.
   */
  getFirebaseData(data: any, arr: any) {
    data.forEach((player: any) => {
      arr.push(player);
    });
  }


  /**
   * Start button drücken dan wird dies aufgerufen.
   * Erstellt ein neues Spiel, alle arrays werden gelärt und in der Firebase gespeichert.
   */
  generateGame() {
    this.resetArrays();
    let firebaseData = {
      playedCards: this.playedCards,
      cardStack: this.cardStack,
      currentPlayer: this.currentPlayer,
      players: this.players,
      takeCardAnimation: this.takeCardAnimation,
      currentCard: this.currentCard,
    }
    this.addGame(firebaseData);
  }


  resetArrays() {
    this.playedCards = [];
    this.cardStack = [];
    this.players = [];
    this.currentPlayer = 0;
    this.takeCardAnimation = false;
    this.currentCard = '';
  }


  // ADD GAMES

  /**
   * Fügen das erstellte Spiel in die Firebase hinzu.
   * @param game - Array wo alles lokalen arrays gespeichert wurden.
  */
  async addGame(firebaseData: {}) {
    await addDoc(this.getGameRef(), firebaseData).catch(
      (err) => { console.error(err) }
    ).then(
      (docRef) => {
        this.router.navigate(['game/' + docRef?.id]);
        setTimeout(() => {
          this.putCardsInCardStack()
        });
      }
    );
  }


  putCardsInCardStack() {
    for (let i = 1; i < 14; i++) {
      this.cardStack.push('ace_' + i)
      this.cardStack.push('hearts_' + i)
      this.cardStack.push('clubs_' + i)
      this.cardStack.push('diamonds_' + i)
    }
    this.shuffle(this.cardStack);
  }


  shuffle(array: any) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    this.uptateGame();
  }


  /**
   * 
   * @returns - kommen auf das Dokument games in der Firebase
   */
  getGameRef() {
    return collection(this.firestore, 'games');
  }


  // UPTATE GAME

  async uptateGame() {
    const singeDocRef = this.getSingleDocRef('games', this.gameId)
    await updateDoc(singeDocRef, this.getSimpleJson())
  }


  getSimpleJson() {
    return {
      playedCards: this.playedCards,
      cardStack: this.cardStack,
      players: this.players,
      currentPlayer: this.currentPlayer,
      takeCardAnimation: this.takeCardAnimation,
      currentCard: this.currentCard,
    }
  }
}
