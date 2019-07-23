import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, IonContent, NavParams, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { DBService } from './../../shared/database.service';
import { Card } from 'src/app/shared/models/card.model';

@Component({
  selector: 'app-unit-modal',
  templateUrl: './unit-modal.component.html',
  styleUrls: ['./unit-modal.component.scss'],
})
export class UnitModalComponent implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  isEditMode: boolean = false;
  unitId: string;
  unitTitle: string;
  cards$: Observable<Card[]>;
  cardsAmount: number;
  isNewCardFormDisplayable: boolean = false;
  expandedCardId: string = null;
  unitTitleForm: FormGroup;
  newCardForm: FormGroup;
  editCardForm: FormGroup;

  constructor(
    private navParams: NavParams,
    private dbService: DBService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    this.unitId = this.navParams.get('unit').id;
    this.unitTitle = this.navParams.get('unit').title;
    this.cards$ = this.dbService.getUnitCards(this.unitId);
    this.cards$.subscribe(resp => {
      this.cardsAmount = resp.length;
    });
    this.unitTitleForm = new FormGroup({
      title: new FormControl(this.unitTitle, Validators.required)
    });
    this.newCardForm = new FormGroup({
      word: new FormControl(null, Validators.required),
      translation: new FormControl(null, Validators.required)
    });
  }

  onUnitLearn() {
    let unitData: NavigationExtras = {
      queryParams: {
        unitId: this.unitId,
        unitTitle: this.unitTitle
      }
    }
    this.modalCtrl.dismiss().then(() => {
      this.router.navigate(['learn'], unitData);
    });
  }

  onUnitDone() {
    const {title: newTitle} = this.unitTitleForm.value;
    if (this.unitTitleForm.invalid || (this.unitTitle === newTitle)) {
      this.modalCtrl.dismiss();
      return;
    }
    this.dbService.editUnit(this.unitId, newTitle).then(() => {
      this.modalCtrl.dismiss();
    });
  }

  displayNewCardForm() {
    this.expandedCardId = null;
    this.content.scrollToTop(100);
    this.isNewCardFormDisplayable = true;
  }

  hideNewCardForm() {
    this.isNewCardFormDisplayable = false;
    this.newCardForm.reset();
  }

  expandCard(card: Card) {
    this.hideNewCardForm();
    this.expandedCardId = card.id;
    this.editCardForm = new FormGroup({
      word: new FormControl(card.wordText, Validators.required),
      translation: new FormControl(card.wordTranslation, Validators.required)
    });
  }

  collapseCard() {
    this.expandedCardId = null;
    this.editCardForm = null;
  }

  onCreateCard() {
    const {word, translation} = this.newCardForm.value;
    this.dbService.addCardToUnit(this.unitId, word, translation).then(resp => {
      this.hideNewCardForm();
    });
  }

  onCardEdit(card: Card) {
    const {wordText: oldWord, wordTranslation: oldTranslation} = card;
    const {word: newWord, translation: newTranslation} = this.editCardForm.value;
    if (oldWord === newWord && oldTranslation === newTranslation) {
      this.collapseCard();
      return;
    }
    this.dbService.editCardInUnit(this.unitId, card.id, newWord, newTranslation).then(() => {
      this.collapseCard();
    });
  }

  onCardRemove(card: Card) {
    this.dbService.removeCardFromUnit(this.unitId, card.id);
  }

  onUnitRemove() {
    this.presentAlertConfirm();
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Remove',
          handler: () => {
            this.dbService.removeUnit(this.unitId).then(() => {
              this.modalCtrl.dismiss();
            });
          }
        }
      ]
    });

    await alert.present();
  }

}