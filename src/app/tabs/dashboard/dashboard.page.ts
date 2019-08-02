import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from './../../auth/auth.service';
import { DBService } from 'src/app/shared/database.service';
import { Unit } from 'src/app/shared/models/unit.model';
import { UnitModalComponent } from './unit-modal/unit-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  units$: Observable<Unit[]>;
  unitsAmount: number;
  isNewUnitFormDisplayable = false;

  constructor(
    private dbService: DBService,
    private modalCtrl: ModalController,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user: firebase.User) => {
      this.dbService.setCurrentUserCollection(user.uid);
      this.units$ = this.dbService.getUnits();
      this.units$.subscribe((resp: Unit[]) => {
        this.unitsAmount = resp.length;
      });
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
