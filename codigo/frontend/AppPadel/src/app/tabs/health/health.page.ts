import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { supabase } from '../../supabase';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss']
})
export class HealthPage implements OnInit {
  userId: string | null = null;

  entry = {
    fecha: new Date().toISOString().slice(0, 10),
    nivel_energia: '',
    intensidad: '',
    duracion: null as number | null,
    sueno: null as number | null,
    agua: null as number | null,
    estado_fisico: '',
    notas: ''
  };

  constructor(private toast: ToastController) {}

  async ngOnInit() {
    const { data } = await supabase.auth.getUser();
    this.userId = data.user?.id ?? null;
    await this.cargarRegistro();
  }

  async onDateChange() {
    await this.cargarRegistro();
  }

  // 🔹 Cargar registro existente
  private async cargarRegistro() {
    if (!this.userId) {
      this.notify('Inicia sesión para guardar en la nube', 'warning');
      return;
    }

    const { data, error } = await supabase
      .from('health')
      .select('fecha, nivel_energia, intensidad, duracion, sueno, agua, estado_fisico, notas')
      .eq('user_id', this.userId)
      .eq('fecha', this.entry.fecha)
      .maybeSingle();

    if (error) {
      console.error('Error al leer registro:', error);
      return this.notify('No se pudo leer el registro', 'danger');
    }

    if (data) this.entry = { ...data };
    else this.resetExceptDate();
  }

  // 🔹 Reinicia los campos si no hay registro
  private resetExceptDate() {
    const fecha = this.entry.fecha;
    this.entry = {
      fecha,
      nivel_energia: '',
      intensidad: '',
      duracion: null,
      sueno: null,
      agua: null,
      estado_fisico: '',
      notas: ''
    };
  }

  private num(v: any) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  // 🔹 Guardar en Supabase
  async guardar() {
    if (!this.userId) return this.notify('Necesitás iniciar sesión', 'warning');

    const row = {
      user_id: this.userId,
      fecha: this.entry.fecha,
      nivel_energia: this.entry.nivel_energia,
      intensidad: this.entry.intensidad,
      duracion: this.num(this.entry.duracion),
      sueno: this.num(this.entry.sueno),
      agua: this.num(this.entry.agua),
      estado_fisico: this.entry.estado_fisico,
      notas: this.entry.notas
    };

    const { error } = await supabase
      .from('health')
      .upsert(row, { onConflict: 'user_id,fecha' });

    if (error) {
      console.error('Error al guardar:', error);
      return this.notify('No se pudo guardar ❌', 'danger');
    }

    this.notify('Guardado correctamente ✅');
  }

  // 🔹 Mostrar notificación
  private async notify(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const t = await this.toast.create({ message, duration: 1500, color, position: 'bottom' });
    t.present();
  }
}
