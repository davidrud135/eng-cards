import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Unit } from './models/unit.model';
import { Card } from './models/card.model';

@Injectable({providedIn: 'root'})
export class DBService {
  private unitsCollectionRef: AngularFirestoreCollection<Unit>;
  private userId: string;

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore
  ) {
    this.userId = this.authService.user.value.id;
    this.unitsCollectionRef = afs.collection(`users/${this.userId}/units`);
  }

  getUnits(): Observable<Unit[]> {
    return this.unitsCollectionRef.snapshotChanges()
      .pipe(
        map(snapshot => {
          return snapshot.map((unitFirebaseResp: {payload: any}) => {
            const data = unitFirebaseResp.payload.doc.data();
            const id = unitFirebaseResp.payload.doc.id;
            return {id, ...data};
          });
        })
      );
  }

  getUnitCards(unitId: string): Observable<Card[]> {
    return this.unitsCollectionRef.doc(unitId).collection('cards').snapshotChanges()
      .pipe(
        map(snapshot => {
          return snapshot.map((cardFirebaseResp: {payload: any}) => {
            const data = cardFirebaseResp.payload.doc.data();
            const id = cardFirebaseResp.payload.doc.id;
            return {id, ...data};
          });
        })
      );
  }

  addUnit(unitTitle: string): Promise<any> {
    return this.unitsCollectionRef.add({
      title: unitTitle
    });
  }

  editUnit(unitId: string, newTitle: string): Promise<any> {
    return this.unitsCollectionRef.doc(unitId).update({
      title: newTitle
    });
  }

  removeUnit(unitId: string): Promise<any> {
    return this.unitsCollectionRef.doc(unitId).delete();
  }

  addCardToUnit(unitId: string, word: string, translation: string): Promise<any> {
    const cardsCollectionRef = this.afs.collection(`users/${this.userId}/units/${unitId}/cards`);
    return cardsCollectionRef.add({
      wordText: word,
      wordTranslation: translation
    });
  }

  editCardInUnit(unitId: string, cardId: string, newWord: string, newTranslation: string): Promise<any> {
    const cardDocRef = this.afs.doc(`users/${this.userId}/units/${unitId}/cards/${cardId}`);
    return cardDocRef.update({
      wordText: newWord,
      wordTranslation: newTranslation
    });
  }

  removeCardFromUnit(unitId: string, cardId: string): Promise<any> {
    const cardDocRef = this.afs.doc(`users/${this.userId}/units/${unitId}/cards/${cardId}`);
    return cardDocRef.delete();
  }

}