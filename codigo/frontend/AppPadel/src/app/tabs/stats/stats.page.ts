import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class StatsPage implements OnInit {
  jugadores: any[] = [];

  async ngOnInit() {
    await this.cargarRanking();
  }

  async cargarRanking() {
    const { data, error } = await supabase
      .from('jugadores') // nombre de la tabla (asegurate que sea correcto)
      .select('nombre, puntos')
      .order('puntos', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error al cargar el ranking:', error);
    } else {
      this.jugadores = data || [];
    }
  }
}
