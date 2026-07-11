import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

interface CloudinaryUploadResponse {
  secure_url?: string;
  url?: string;
  error?: { message: string };
}

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(ConfigService);

  upload(file: File): Observable<string> {
    const cloudinary = this.config.cloudinaryConfig;
    if (!cloudinary.cloudName || !cloudinary.uploadPreset) {
      throw new Error('Configuração do Cloudinary não encontrada.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinary.uploadPreset);
    formData.append('folder', 'talkive/images');
    formData.append('timestamp', Date.now().toString());

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudinary.cloudName}/image/upload`;

    return new Observable<string>((observer) => {
      this.http.post<CloudinaryUploadResponse>(uploadUrl, formData).subscribe({
        next: (response) => {
          const url = response.secure_url || response.url;
          if (!url) {
            observer.error(new Error('URL da imagem não retornada pelo Cloudinary.'));
            return;
          }
          observer.next(url);
          observer.complete();
        },
        error: (error) => observer.error(error),
      });
    });
  }
}
