import { Component, Input } from '@angular/core';
import { Card } from 'src/app/_objects/expansion';

@Component({
  selector: 'app-card-preview',
  templateUrl: './card-preview.component.html',
  styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent {

  @Input() activeCard: Card;

}
