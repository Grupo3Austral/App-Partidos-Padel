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
  imports: [CommonModule, IonicModule]
})
export class StatsPage implements OnInit {
  ranking: any[] = [];

  async ngOnInit() {
    await this.obtenerRanking();
  }

  async obtenerRanking() {
    const { data, error } = await supabase
      .from('ranking_top10')
      .select('*')
      .order('puntos', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error al obtener el ranking:', error);
    } else {
      this.ranking = data || [];
    }
  }
}
