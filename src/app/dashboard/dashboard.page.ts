import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

import { DBService } from './../shared/database.service';
import { UnitModalComponent } from './unit-modal/unit-modal.component';
import { Unit } from '../shared/models/unit.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  units$: Observable<Unit[]>;
  unitsAmount: number;
  isNewUnitFormDisplayable = false;

  constructor(private dbService: DBService, private modalCtrl: ModalController) {}

  ngOnInit() {
    this.units$ = this.dbService.getUnits();
    this.units$.subscribe((resp: Unit[]) => {
      this.unitsAmount = resp.length;
    });
  }

  displayNewUnitForm() {
    this.isNewUnitFormDisplayable = true;
  }

  hideNewUnitForm() {
    this.isNewUnitFormDisplayable = false;
  }

  async openUnitModal(unit: Unit) {
    const modal = await this.modalCtrl.create({
      component: UnitModalComponent,
      componentProps: { unit },
    });
    return await modal.present();
  }

  onUnitCreate(newUnitForm: NgForm) {
    const { title } = newUnitForm.value;
    this.dbService.addUnit(title).then(() => {
      this.hideNewUnitForm();
    });
  }
}
