import { Component, inject } from '@angular/core';
import { FirebaseService } from '../shared/service/firebase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {


  constructor(public firebaseService: FirebaseService) { }
}
