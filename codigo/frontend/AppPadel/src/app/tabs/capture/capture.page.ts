import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.page.html',
  styleUrls: ['./capture.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CapturePage {

  images = [
    { src: 'assets/img/padelfondo.png', alt: 'Partido de pádel' },
    { src: 'assets/img/login.png', alt: 'Pelotas de pádel' },
    { src: 'assets/img/snack.png', alt: 'Jugador en acción' },
    { src: 'assets/img/dinner.png', alt: 'Jugadores en partido' },
    { src: 'assets/img/coffee.png', alt: 'Raqueta y pelota' }
  ];

  constructor() {}
}
