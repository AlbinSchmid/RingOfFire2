import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideAnimationsAsync(), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-b4e18","appId":"1:106070269632:web:e5c17c0d7b260dd1871725","storageBucket":"ring-of-fire-b4e18.appspot.com","apiKey":"AIzaSyBKYuVt6pyi4-DbyrqRNwdF0Aewt6k6zls","authDomain":"ring-of-fire-b4e18.firebaseapp.com","messagingSenderId":"106070269632"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
