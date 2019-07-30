import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Unit } from './models/unit.model';
import { Card } from './models/card.model';

@Injectable({ providedIn: 'root' })
export class DBService {
  private userId: string;

  constructor(private authService: AuthService, private afs: AngularFirestore) {
    this.userId = this.authService.getUserId();
  }

  getUnits(): Observable<Unit[]> {
    return this.afs
      .collection(`users/${this.userId}/units`)
      .snapshotChanges()
      .pipe(
        map((snapshot: any) => {
          return snapshot.map((unitFirebaseResp: { payload: any }) => {
            const data = unitFirebaseResp.payload.doc.data();
            const id = unitFirebaseResp.payload.doc.id;
            return { id, ...data };
          });
        }),
      );
  }

  getUnitCards(unitId: string): Observable<Card[]> {
    return this.afs
      .collection(`users/${this.userId}/units/${unitId}/cards`)
      .snapshotChanges()
      .pipe(
        map((snapshot: any) => {
          return snapshot.map((cardFirebaseResp: { payload: any }) => {
            const data = cardFirebaseResp.payload.doc.data();
            const id = cardFirebaseResp.payload.doc.id;
            return { id, ...data };
          });
        }),
      );
  }

  addUnit(unitTitle: string): Promise<firebase.firestore.DocumentReference> {
    return this.afs.collection(`users/${this.userId}/units`).add({
      title: unitTitle,
    });
  }

  editUnit(unitId: string, newTitle: string): Promise<void> {
    return this.afs.doc(`users/${this.userId}/units/${unitId}`).update({
      title: newTitle,
    });
  }

  removeUnit(unitId: string): Promise<void> {
    return this.afs.doc(`users/${this.userId}/units/${unitId}`).delete();
  }

  addCardToUnit(
    unitId: string,
    word: string,
    translation: string,
  ): Promise<firebase.firestore.DocumentReference> {
    return this.afs.collection(`users/${this.userId}/units/${unitId}/cards`).add({
      wordText: word,
      wordTranslation: translation,
    });
  }

  editCardInUnit(
    unitId: string,
    cardId: string,
    newWord: string,
    newTranslation: string,
  ): Promise<void> {
    return this.afs.doc(`users/${this.userId}/units/${unitId}/cards/${cardId}`).update({
      wordText: newWord,
      wordTranslation: newTranslation,
    });
  }

  removeCardFromUnit(unitId: string, cardId: string): Promise<void> {
    return this.afs.doc(`users/${this.userId}/units/${unitId}/cards/${cardId}`).delete();
  }
}
