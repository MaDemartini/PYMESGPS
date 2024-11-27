const dotenv = require('dotenv');
const fs = require('fs');

// Cargar variables del archivo .env
dotenv.config();

// Crear contenido para el archivo local.properties
const localPropertiesContent = `
ANDROID_API_KEY=${process.env.ANDROID_API_KEY || ''}
HTTP_API_KEY=${process.env.HTTP_API_KEY || ''}
API_KEY_3=${process.env.API_KEY_3 || ''}
`.trim();

// Crear o sobrescribir el archivo local.properties en la carpeta Android
const filePath = './android/local.properties';
try {
  fs.writeFileSync(filePath, localPropertiesContent, { encoding: 'utf-8' });
  console.log(`Archivo local.properties generado con éxito en: ${filePath}`);
} catch (error) {
  console.error('Error al generar local.properties:', error);
}
