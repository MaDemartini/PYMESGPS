import { Injectable } from '@angular/core'; // Permite que este servicio sea inyectado en otros componentes.
import { createClient, SupabaseClient } from '@supabase/supabase-js'; // Crea un cliente de Supabase para interactuar con la base de datos.
import * as bcrypt from 'bcryptjs'; // Importa bcrypt para encriptar y verificar contraseñas.

const supabaseUrl = 'https://fsopvegvowmpvnmzemlc.supabase.co'; // URL de la base de datos en Supabase.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3B2ZWd2b3dtcHZubXplbWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzOTk2MzcsImV4cCI6MjA0MDk3NTYzN30.32gXrl7hrfNXndiG4wru92fkVI-BJQirbYW5M17s1dY'; // Clave API de Supabase.
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey); // Crea una instancia del cliente Supabase.

@Injectable({
  providedIn: 'root'
}) // Define el servicio como disponible en todo el proyecto.
export class SupabaseService {

  constructor() {} // Constructor vacío.

  // Función para registrar un usuario con rol
  async registrarUsuario(usuario: any, rol: number): Promise<boolean> {
    const salt = bcrypt.genSaltSync(10); // Genera un salt para encriptar la contraseña.
    usuario.contrasena_us = bcrypt.hashSync(usuario.contrasena_us, salt); // Encripta la contraseña del usuario.
    usuario.rol = rol; // Asigna el rol al usuario.

    const { data, error } = await supabase.from('usuario').insert([usuario]); // Inserta el usuario en la tabla 'usuario'.
    if (error) {
      console.error('Error al registrar usuario:', error.message); // Imprime error si la inserción falla.
      return false;
    }
    console.log('Usuario registrado:', data); // Imprime el usuario registrado.
    return true; // Retorna true si el registro fue exitoso.
  }

  // Función para validar un usuario
  async validarUsuario(correo: string, contrasena: string): Promise<any> {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo_us', correo)
      .single(); // Busca el usuario por correo en la tabla 'usuario'.
    if (error) {
      console.error('Error al validar usuario:', error.message); // Imprime error si falla la validación.
      return null;
    }
    if (data && bcrypt.compareSync(contrasena, data.contrasena_us)) { // Compara la contraseña ingresada con la encriptada en la base de datos.
      return data; // Retorna los datos del usuario si la validación es correcta.
    }
    return null; // Retorna null si la validación falla.
  }

  // Función para obtener el usuario actual
  async obtenerUsuarioActual(): Promise<any> {
    const { data, error } = await supabase.auth.getUser(); // Obtiene el usuario autenticado.
    if (error) {
      throw new Error('Error al obtener el usuario: ' + error.message); // Lanza un error si falla la obtención.
    }

    const { data: usuario, error: usuarioError } = await supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', data?.user?.id)
      .single(); // Busca detalles del usuario por ID.
    if (usuarioError) {
      throw new Error('Error al obtener detalles del usuario: ' + usuarioError.message); // Lanza un error si falla la consulta.
    }
    return usuario; // Retorna los detalles del usuario.
  }

  // Función para cerrar sesión
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut(); // Cierra la sesión del usuario autenticado.
    if (error) {
      throw new Error('Error al cerrar sesión: ' + error.message); // Lanza un error si la salida falla.
    }
  }
}
