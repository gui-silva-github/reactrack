export class ConveneEvent {
  id = '';
  title = '';
  image = '';
  date = new Date();
  time = '';
  description = '';
  location = '';
}

export interface IConveneEventPayload {
  id?: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  image?: string;
}
