import { Component, OnInit } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  ranking: any[] = [];

  async ngOnInit() {
    await this.cargarRanking();
  }

  async cargarRanking() {
    const { data, error } = await supabase
      .from('ranking_top10') // 👈 nombre correcto de tu tabla
      .select('nombre, puntos')
      .order('puntos', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error cargando ranking:', error);
    } else {
      this.ranking = data || [];
      console.log('Ranking cargado:', this.ranking);
    }
  }
}
