import { CanActivateFn } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import * as bcrypt from "bcryptjs";

export const isadminGuard: CanActivateFn = async (route, state) => {
  try {
    // Obtener la información del usuario desde el almacenamiento
    const { value } = await Preferences.get({ key: 'user-info' });

    if (!value) {
      console.warn("No se encontró la información del usuario");
      return false;
    }

    const userInfo = JSON.parse(value);

    // Verificar si el usuario tiene el rol de administrador
    if (userInfo && userInfo.rol && userInfo.rol.nombre_rol === 'admin') {
      console.log("Acceso permitido: usuario administrador");
      return true;
    } else {
      console.warn("Acceso denegado: el usuario no es administrador");
      return false;
    }
  } catch (error) {
    console.error("Error al verificar el rol del usuario:", error);
    return false;
  }
};
