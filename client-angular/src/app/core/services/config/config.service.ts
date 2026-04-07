import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get backendUrl(): string {
    return environment.backendUrl;
  }

  get firebaseConfig(): any {
    return environment.firebase;
  }

  get cloudinaryConfig(): any {
    return environment.cloudinary;
  }
}
