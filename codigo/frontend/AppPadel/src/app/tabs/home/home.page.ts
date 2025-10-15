import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { createClient } from '@supabase/supabase-js';

// 🔹 Inicializa Supabase
const supabaseUrl = 'https://kpagqfrrcleqtkatmtda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwYWdxZnJyY2xlcXRrYXRtdGRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjExMzMsImV4cCI6MjA3MTg5NzEzM30.tbNWaV5oTEWC1Cub-4q-0Rxv1c9g46b9YZ3cvu6r28Q';
const supabase = createClient(supabaseUrl, supabaseKey);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  padelList: any[] = [];
  nuevoPadel = {
    perfil_id: '',
    estadistica_id: '',
    cancha_id: '',
    ubicacion: '',
    horario_id: ''
  };
  editando = false;
  padelEditando: any = null;

  async ngOnInit() {
    await this.obtenerPadel();
  }

  // 🔹 Leer registros
  async obtenerPadel() {
    const { data, error } = await supabase.from('padel').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error al obtener padel:', error);
    else this.padelList = data || [];
  }

  // 🔹 Crear registro
  async agregarPadel() {
    const { error } = await supabase.from('padel').insert([this.nuevoPadel]);
    if (error) alert('❌ Error al agregar: ' + error.message);
    else {
      alert('✅ Registro agregado');
      this.nuevoPadel = { perfil_id: '', estadistica_id: '', cancha_id: '', ubicacion: '', horario_id: '' };
      await this.obtenerPadel();
    }
  }

  // 🔹 Editar
  editarPadel(padel: any) {
    this.editando = true;
    this.padelEditando = { ...padel };
  }

  async guardarEdicion() {
    const { error } = await supabase
      .from('padel')
      .update(this.padelEditando)
      .eq('id', this.padelEditando.id);
    if (error) alert('❌ Error al editar: ' + error.message);
    else {
      alert('✅ Cambios guardados');
      this.editando = false;
      this.padelEditando = null;
      await this.obtenerPadel();
    }
  }

  cancelarEdicion() {
    this.editando = false;
    this.padelEditando = null;
  }

  async eliminarPadel(id: string) {
    const confirmar = confirm('¿Eliminar este registro?');
    if (!confirmar) return;
    const { error } = await supabase.from('padel').delete().eq('id', id);
    if (error) alert('❌ Error al eliminar: ' + error.message);
    else await this.obtenerPadel();
  }
}