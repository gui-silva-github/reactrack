import { Component, input, output } from '@angular/core';
import { CONVENE_URL } from '../../../../core/constants/api-urls';
import { PT } from '../../../../core/constants/i18n-pt';
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
  readonly t = PT.convene;
  readonly imagesEndpoint = `${CONVENE_URL}/`;
}
