import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { supabase } from '../../supabase';

Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatsPage implements OnInit {
  chart: any;
  stats = { puntos: 0, errores: 0, saques: 0 };

  async ngOnInit() {
    await this.loadStats();
    this.createChart();
  }

  async loadStats() {
    const { data, error } = await supabase.from('player_stats').select('*').single();
    if (!error && data) this.stats = data;
  }

  async saveStats() {
    await supabase.from('player_stats').upsert(this.stats);
  }

  async updateStat(type: 'puntos' | 'errores' | 'saques') {
    this.stats[type]++;
    this.updateChart();
    await this.saveStats();
  }

  createChart() {
    const ctx = document.getElementById('statsChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Puntos', 'Errores', 'Saques Ganados'],
        datasets: [{
          label: 'Rendimiento del Jugador',
          data: [this.stats.puntos, this.stats.errores, this.stats.saques],
          backgroundColor: ['#2dd36f', '#eb445a', '#3dc2ff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [
        this.stats.puntos,
        this.stats.errores,
        this.stats.saques
      ];
      this.chart.update();
    }
  }
}
