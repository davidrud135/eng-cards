import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentChangeAction,
  AngularFirestoreCollection,
  DocumentData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Unit } from './models/unit.model';
import { Card } from './models/card.model';

@Injectable({ providedIn: 'root' })
export class DBService {
  private userUnitsCollection: AngularFirestoreCollection<DocumentData>;

  constructor(private afs: AngularFirestore) {}

  public setCurrentUserCollection(userId: string): void {
    this.userUnitsCollection = this.afs.collection(`users/${userId}/units`);
  }

  public getUnits(): Observable<Unit[]> {
    return this.userUnitsCollection.snapshotChanges().pipe(map(this.getDocsDataWithId));
  }

  public getUnitCards(unitId: string): Observable<Card[]> {
    return this.userUnitsCollection
      .doc(unitId)
      .collection('cards')
      .snapshotChanges()
      .pipe(map(this.getDocsDataWithId));
  }

  private getDocsDataWithId(collectionActions: DocumentChangeAction<any>[]): any[] {
    return collectionActions.map((docAction: DocumentChangeAction<any>) => {
      const doc = docAction.payload.doc;
      const id = doc.id;
      const data = doc.data();
      return { id, ...data };
    });
  }

  public addUnit(unitTitle: string): Promise<firebase.firestore.DocumentReference> {
    return this.userUnitsCollection.add({
      title: unitTitle,
    });
  }

  public editUnit(unitId: string, newTitle: string): Promise<void> {
    return this.userUnitsCollection.doc(unitId).update({
      title: newTitle,
    });
  }

  public removeUnit(unitId: string): Promise<void> {
    return this.userUnitsCollection.doc(unitId).delete();
  }

  public addCardToUnit(
    unitId: string,
    word: string,
    translation: string,
  ): Promise<firebase.firestore.DocumentReference> {
    return this.userUnitsCollection
      .doc(unitId)
      .collection('cards')
      .add({
        wordText: word,
        wordTranslation: translation,
      });
  }

  public editCardInUnit(
    unitId: string,
    cardId: string,
    newWord: string,
    newTranslation: string,
  ): Promise<void> {
    return this.userUnitsCollection
      .doc(unitId)
      .collection('cards')
      .doc(cardId)
      .update({
        wordText: newWord,
        wordTranslation: newTranslation,
      });
  }

  public removeCardFromUnit(unitId: string, cardId: string): Promise<void> {
    return this.userUnitsCollection
      .doc(unitId)
      .collection('cards')
      .doc(cardId)
      .delete();
  }
}
