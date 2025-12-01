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

  // estadísticas actuales
  stats = { puntos: 0, errores: 0, saques: 0 };

  // 👇 NUEVO: historial de movimientos para poder deshacer
  history: ('puntos' | 'errores' | 'saques')[] = [];

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

  // ⬆ SUMAR punto / error / saque
  async updateStat(type: 'puntos' | 'errores' | 'saques') {
    this.stats[type]++;

    // guardo qué hiciste para poder deshacer
    this.history.push(type);

    this.updateChart();
    await this.saveStats();
  }

  // ⬅ DESHACER último movimiento
  async undoLast() {
    const last = this.history.pop();
    if (!last) {
      return; // no hay nada que deshacer
    }

    if (this.stats[last] > 0) {
      this.stats[last]--;
    }

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
