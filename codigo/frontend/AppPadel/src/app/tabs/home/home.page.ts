// src/app/pages/productos/productos.page.ts
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [FormsModule,CommonModule, IonicModule]
})

export class HomePage implements OnInit {
  padelList: any[] = [];
  nuevoPadel: any = { perfil_id: '', estadistica_id: '', cancha_id: '', ubicacion: '', horario_id: '' };

  editando = false;
  padelEditando: any = null;

  constructor(private db: DatabaseService) {}

  async ngOnInit() {
    await this.cargarPadel();
  }

  async cargarPadel() {
    this.padelList = await this.db.getAll('padel');
  }

  async agregarPadel() {
    if (!this.nuevoPadel.ubicacion) return;
    await this.db.insert('padel', this.nuevoPadel);
    this.nuevoPadel = { perfil_id: '', estadistica_id: '', cancha_id: '', ubicacion: '', horario_id: '' };
    await this.cargarPadel();
  }

  editarPadel(padel: any) {
    this.editando = true;
    this.padelEditando = { ...padel };
  }

  async guardarEdicion() {
    if (!this.padelEditando?.id) return;
    await this.db.update('padel', this.padelEditando.id, this.padelEditando);
    this.editando = false;
    this.padelEditando = null;
    await this.cargarPadel();
  }

  cancelarEdicion() {
    this.editando = false;
    this.padelEditando = null;
  }

  async eliminarPadel(id: string) {
    if (!id) return;
    const ok = confirm('¿Eliminar este registro de padel?');
    if (!ok) return;
    await this.db.delete('padel', Number(id));
    await this.cargarPadel();
  }
}