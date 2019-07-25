import { DBService } from './../shared/database.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Card } from '../shared/models/card.model';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.page.html',
  styleUrls: ['./learn.page.scss'],
})
export class LearnPage implements OnInit {
  unitTitle = '';
  cards$: Observable<Card[]>;

  constructor(private route: ActivatedRoute, private dbService: DBService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.unitTitle = params['unitTitle'];
      this.cards$ = this.dbService.getUnitCards(params['unitId']);
    });
  }
}
