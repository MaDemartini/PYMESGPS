import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';

const supabaseUrl = 'https://fsopvegvowmpvnmzemlc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzb3B2ZWd2b3dtcHZubXplbWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzOTk2MzcsImV4cCI6MjA0MDk3NTYzN30.32gXrl7hrfNXndiG4wru92fkVI-BJQirbYW5M17s1dY';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  constructor() {}

  // Función para registrar un usuario con rol
  async registrarUsuario(usuario: any, rol: number): Promise<boolean> {
    // Encriptar la contraseña antes de enviarla a la base de datos
    const salt = bcrypt.genSaltSync(10);
    usuario.contrasena_us = bcrypt.hashSync(usuario.contrasena_us, salt);
    usuario.rol = rol; // Asignar el ID del rol

    const { data, error } = await supabase.from('usuario').insert([usuario]);
    if (error) {
      console.error('Error al registrar usuario:', error.message);
      return false;
    }
    console.log('Usuario registrado:', data);
    return true;
  }

  // Función para validar un usuario
  async validarUsuario(correo: string, contrasena: string): Promise<any> {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('correo_us', correo)
      .single();

    if (error) {
      console.error('Error al validar usuario:', error.message);
      return null;
    }

    // Comparar la contraseña ingresada con la almacenada en la base de datos
    if (data && bcrypt.compareSync(contrasena, data.contrasena_us)) {
      return data;
    }
    return null;
  }

  // Función para obtener el usuario actual
  async obtenerUsuarioActual(): Promise<any> {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      throw new Error('Error al obtener el usuario: ' + error.message);
    }

    // Aquí deberías obtener más detalles del usuario desde la base de datos si es necesario
    const { data: usuario, error: usuarioError } = await supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', data?.user?.id)
      .single();

    if (usuarioError) {
      throw new Error('Error al obtener detalles del usuario: ' + usuarioError.message);
    }

    return usuario;
  }

  // Función para cerrar sesión
  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error('Error al cerrar sesión: ' + error.message);
    }
  }
}
