import { Card } from './../../shared/models/card.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-flip-card',
  templateUrl: './flip-card.component.html',
  styleUrls: ['./flip-card.component.scss']
})
export class FlipCardComponent implements OnInit {
  @Input() card: Card;
  isFlipped: boolean = false;

  constructor() { }

  ngOnInit() {}

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

}
