import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private sessionKey = 'auth_session';
  private userDataKey = 'userData';

  constructor() {}

  // Verificar si la sesión ha expirado
  async isDateExpired(): Promise<boolean> {
    try {
      const userData = await this.getDecryptedUserData();
      if (userData && userData.expiration && Date.now() < userData.expiration) {
        return false;
      }
      await this.logout();
      return true;
    } catch (error) {
      console.error('Error al verificar expiración:', error);
      await this.logout();
      return true;
    }
  }

  // Obtener datos desencriptados del usuario
  async getDecryptedUserData(): Promise<any | null> {
    const { value } = await Preferences.get({ key: this.userDataKey });
    if (value) {
      try {
        const bytes = CryptoJS.AES.decrypt(value, environment.secretKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (error) {
        console.error('Error al desencriptar datos:', error);
        await this.logout();
        return null;
      }
    }
    return null;
  }

  // Guardar datos encriptados del usuario con expiración
  async setEncryptedUserData(userData: any): Promise<void> {
    try {
      userData.expiration = Date.now() + 10 * 60 * 1000;
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        environment.secretKey
      ).toString();
      await Preferences.set({ key: this.userDataKey, value: encryptedData });
    } catch (error) {
      console.error('Error al guardar datos encriptados:', error);
      throw new Error('No se pudieron guardar los datos.');
    }
  }

  // Obtener el token de sesión
  async getSessionToken(): Promise<{ session_token: string }> {
    const { value } = await Preferences.get({ key: this.sessionKey });
    if (!value) {
      throw new Error('No se encontró un token de sesión válido.');
    }
    const tokenData = JSON.parse(value);
    if (!tokenData.access_token) {
      throw new Error('El token de sesión no es válido.');
    }
    return { session_token: tokenData.access_token };
  }

  // Guardar el token de sesión
  async setSessionToken(token: { access_token: string }): Promise<void> {
    await Preferences.set({
      key: this.sessionKey,
      value: JSON.stringify(token),
    });
  }

  // Cerrar sesión eliminando datos
  async logout(): Promise<void> {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
