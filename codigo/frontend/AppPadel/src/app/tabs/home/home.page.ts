// src/app/pages/productos/productos.page.ts
import { Component } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  // Variables que usa el HTML
  padelList: any[] = [];
  nuevoPadel: any = {
    perfil_id: '',
    estadistica_id: '',
    cancha_id: '',
    ubicacion: '',
    horario_id: ''
  };

  editando = false;
  padelEditando: any = null;

  async ngOnInit() {
    await this.cargarPadel();
  }

  async cargarPadel() {
    const { data, error } = await supabase.from('padel').select('*').order('created_at', { ascending: false });
    if (!error) this.padelList = data || [];
  }

  async agregarPadel() {
    const { error } = await supabase.from('padel').insert([this.nuevoPadel]);
    if (error) {
      console.error(error.message);
      alert('❌ Error: ' + error.message);
    } else {
      alert('✅ Registro agregado');
      this.nuevoPadel = { perfil_id: '', estadistica_id: '', cancha_id: '', ubicacion: '', horario_id: '' };
      await this.cargarPadel();
    }
  }

  editarPadel(padel: any) {
    this.editando = true;
    this.padelEditando = { ...padel };
  }

  async guardarEdicion() {
    const { error } = await supabase.from('padel').update(this.padelEditando).eq('id', this.padelEditando.id);
    if (error) {
      alert('❌ Error al editar: ' + error.message);
    } else {
      alert('✅ Cambios guardados');
      this.editando = false;
      this.padelEditando = null;
      await this.cargarPadel();
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.padelEditando = null;
  }

  async eliminarPadel(id: string) {
    const ok = confirm('¿Eliminar este registro?');
    if (!ok) return;

    const { error } = await supabase.from('padel').delete().eq('id', id);
    if (error) {
      alert('❌ Error: ' + error.message);
    } else {
      alert('🗑️ Registro eliminado');
      await this.cargarPadel();
    }
  }
}
