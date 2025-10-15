import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.page.html',
  styleUrls: ['./estadistica.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class EstadisticaPage implements OnInit {
  ranking: any[] = [];

  async ngOnInit() {
    await this.obtenerRanking();
  }

  async obtenerRanking() {
    const { data, error } = await supabase.from('ranking_top10').select('*');
    if (error) console.error('Error cargando ranking:', error);
    else this.ranking = data;
  }
}
