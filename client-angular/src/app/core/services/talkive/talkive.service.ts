import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ITalkiveUser {
  uid: string;
  name: string;
  email: string;
  avatar?: string;
  [key: string]: any;
}

export interface ITalkiveMessage {
  id?: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: any;
  imageUrl?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class TalkiveService {
  constructor(private http: HttpClient) {}

  // Este serviço será integrado com Firebase Firestore
  // Por enquanto, apenas a estrutura base
}
