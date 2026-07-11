import { Component, inject, input, output } from '@angular/core';
import { CONVENE_URL } from '../../../../core/constants/api-urls';
import { ConveneI18n } from '../../convene-i18n';
import { ConveneImage } from '../../../../core/models';

@Component({
  selector: 'app-image-picker',
  imports: [],
  templateUrl: './image-picker.html',
  styleUrl: './image-picker.css',
})
export class ImagePicker {
  readonly images = input.required<ConveneImage[]>();
  readonly selectedImage = input('');
  readonly select = output<string>();
  readonly t = inject(ConveneI18n);
  readonly imagesEndpoint = `${CONVENE_URL}/`;
}
