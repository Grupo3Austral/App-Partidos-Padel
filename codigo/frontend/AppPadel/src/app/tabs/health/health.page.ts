import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { supabase } from '../../supabase';

type Energy = 'bajo' | 'medio' | 'alto';
type Intensity = 'ligero' | 'moderado' | 'intenso';
type Injury = 'ok' | 'leve' | 'moderada' | 'grave';

interface HealthEntry {
  entry_date: string;
  energy_level: Energy | null;
  intensity: Intensity | null;
  session_minutes: number | null;
  sleep_hours: number | null;
  hydration_liters: number | null;
  injury_status: Injury | null;
  notes: string | null;
}

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss']
})
export class HealthPage implements OnInit {
  userId: string | null = null;

  entry: HealthEntry = {
    entry_date: new Date().toISOString().slice(0,10),
    energy_level: null,
    intensity: null,
    session_minutes: null,
    sleep_hours: null,
    hydration_liters: null,
    injury_status: 'ok',
    notes: null
  };

  constructor(private toast: ToastController) {}

  async ngOnInit() {
    const { data } = await supabase.auth.getUser();
    this.userId = data.user?.id ?? null;
    await this.loadForDate();
  }

  async onDateChange() {
    await this.loadForDate();
  }

  private async loadForDate() {
    if (!this.userId) {
      this.notify('Inicia sesión para guardar en la nube', 'warning');
      return;
    }
    const { data, error } = await supabase
      .from('health_entries')
      .select('entry_date, energy_level, intensity, session_minutes, sleep_hours, hydration_liters, injury_status, notes')
      .eq('user_id', this.userId)
      .eq('entry_date', this.entry.entry_date)
      .maybeSingle();

    if (error) return this.notify('No se pudo leer el registro', 'danger');

    if (data) this.entry = { ...data } as HealthEntry;
    else this.resetExceptDate();
  }

  private resetExceptDate() {
    const d = this.entry.entry_date;
    this.entry = {
      entry_date: d, energy_level: null, intensity: null,
      session_minutes: null, sleep_hours: null, hydration_liters: null,
      injury_status: 'ok', notes: null
    };
  }

  private num(v: any) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  async save() {
    if (!this.userId) return this.notify('Necesitás iniciar sesión', 'warning');

    const row = {
      user_id: this.userId,
      entry_date: this.entry.entry_date,
      energy_level: this.entry.energy_level,
      intensity: this.entry.intensity,
      session_minutes: this.num(this.entry.session_minutes),
      sleep_hours: this.num(this.entry.sleep_hours),
      hydration_liters: this.num(this.entry.hydration_liters),
      injury_status: this.entry.injury_status,
      notes: this.entry.notes
    };

    const { error } = await supabase
      .from('health_entries')
      .upsert(row, { onConflict: 'user_id,entry_date' });

    if (error) return this.notify('No se pudo guardar', 'danger');

    this.notify('Guardado ✅');
  }

  private async notify(message: string, color: 'success'|'warning'|'danger'='success') {
    const t = await this.toast.create({ message, duration: 1500, color, position: 'bottom' });
    t.present();
  }
}