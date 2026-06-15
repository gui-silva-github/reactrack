export class ConveneImage {
  path = '';
  caption = '';
}

export interface IConveneImage {
  id: string;
  url: string;
  path?: string;
  caption?: string;
}
