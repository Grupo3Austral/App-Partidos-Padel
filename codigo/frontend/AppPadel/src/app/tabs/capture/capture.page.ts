import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { supabase } from '../../supabase';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.page.html',
  styleUrls: ['./capture.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CapturePage implements OnInit {
  description = '';
  selectedFile: File | null = null;
  photos: any[] = [];

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    loop: true,
    autoplay: true
  };

  async ngOnInit() {
    await this.loadPhotos();
  }

  uploadImage(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async savePhoto() {
    if (!this.selectedFile) return alert('Selecciona una imagen primero');
    const fileName = `${Date.now()}_${this.selectedFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from('match_photos')
      .upload(fileName, this.selectedFile);

    if (uploadError) {
      console.error(uploadError);
      return alert('Error al subir imagen');
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('match_photos')
      .getPublicUrl(fileName);

    const photoUrl = publicUrlData.publicUrl;

    const { error: insertError } = await supabase.from('match_photos').insert({
      photo_url: photoUrl,
      description: this.description,
    });

    if (insertError) {
      console.error(insertError);
      return alert('Error al guardar registro');
    }

    this.description = '';
    this.selectedFile = null;
    await this.loadPhotos();
  }

  async loadPhotos() {
    const { data, error } = await supabase
      .from('match_photos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando fotos:', error);
      return;
    }

    this.photos = data || [];
    console.log('Fotos cargadas desde Supabase:', this.photos);
  }
}
