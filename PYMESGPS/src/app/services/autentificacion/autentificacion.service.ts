import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  // Verificar si la sesión ha expirado
  async isDateExpired(): Promise<boolean> {
    const userData = await this.getDecryptedUserData();
    if (userData && userData.expiration && Date.now() < userData.expiration) {
      return false; // Sesión válida
    } else {
      await this.logout(); // Sesión expirada o sin datos, cerrar sesión
      return true;
    }
  }

  // Obtener y desencriptar la información del usuario
  async getDecryptedUserData() {
    const { value } = await Preferences.get({ key: 'userData' });
    if (value) {
      try {
        const bytes = CryptoJS.AES.decrypt(value, environment.secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData;
      } catch (e) {
        console.error("Error al desencriptar los datos:", e);
        await this.logout();
        return null;
      }
    }
    return null;
  }

  // Guardar datos encriptados del usuario
  async setEncryptedUserData(userData: any) {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(userData), environment.secretKey).toString();
    await Preferences.set({ key: 'userData', value: encryptedData });
  }

  // Cerrar sesión eliminando los datos almacenados
  async logout() {
    await Preferences.remove({ key: 'userData' });
  }
}
