import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PT } from '../../../../core/constants/i18n-pt';
import { IConveneEventPayload } from '../../../../core/models';
import { ConveneImage } from '../../../../core/models';
import { ConveneService } from '../../../../core/services/convene/convene.service';
import { ImagePicker } from '../image-picker/image-picker';

@Component({
  selector: 'app-event-form',
  imports: [FormsModule, ImagePicker],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
})
export class EventForm implements OnInit {
  private readonly conveneService = inject(ConveneService);
  readonly inputData = input<IConveneEventPayload | null>(null);
  readonly submitForm = output<IConveneEventPayload>();
  readonly t = PT.convene;

  images = signal<ConveneImage[]>([]);
  loadingImages = signal(true);
  imagesError = signal(false);
  selectedImage = signal('');

  form = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: ''
  };

  ngOnInit(): void {
    const data = this.inputData();
    if (data) {
      this.form = {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date).toISOString().slice(0, 10) : '',
        time: data.time || '',
        location: data.location,
      };
      this.selectedImage.set(data.image || '');
    }

    this.conveneService.getImages().subscribe({
      next: (imgs) => {
        this.images.set(imgs);
        this.loadingImages.set(false);
      },
      error: () => {
        this.imagesError.set(true);
        this.loadingImages.set(false);
      }
    })
  }

  submit(): void {
    this.submitForm.emit({
      ...this.form,
      image: this.selectedImage(),
    });
  }
}
