import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AuthServiceService } from '../autentificacion/autentificacion.service';

@Injectable({
  providedIn: 'root',
})
export class ImagenPerfilService {
  private region = 'sa-east-1';
  private endpoint = 'https://fsopvegvowmpvnmzemlc.supabase.co/storage/v1/s3';
  private endpointbase = 'https://fsopvegvowmpvnmzemlc.supabase.co/storage/v1';
  private bucketName = 'profile-images';
  private accessKeyId = 'eac4e17ec1d74c5eaf5fb67cee1d83be';
  private secretAccessKey = '824135620f9b3fe836612718c86903776d9ac6131ca95cc545ded4213a7a8f26';

  private s3Client: S3Client;

  constructor(private authService: AuthServiceService) {
    this.s3Client = new S3Client({
      forcePathStyle: true,
      region: this.region,
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async subirImagen(userId: string, userName: string, file: Blob): Promise<string> {
    const filePath = `${userName}/profile.jpg`; // Usar el nombre del usuario en la ruta
    try {
      // Leer el contenido del archivo como un Uint8Array
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);

      // Crear el comando para subir el archivo
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
        Body: uint8Array, // Cuerpo del archivo convertido a Uint8Array
        ContentType: file.type,
      });

      // Ejecutar el comando
      await this.s3Client.send(command);

      // Retornar la URL pública del archivo
      return `${this.endpoint}/${this.bucketName}/${filePath}`;
    } catch (error) {
      console.error('Error al subir la imagen a S3:', error);
      throw error;
    }
  }

  obtenerBaseUrl(): string {
    return this.endpointbase;
  }
  

  obtenerUrlImagen(userName: string): string {
    return `${this.endpoint}/public/${this.bucketName}/${userName}/profile.jpg`;
  }

}
