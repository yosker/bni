import { Injectable } from '@nestjs/common';

@Injectable()
export class SharedService {
  /**
   * @description Genera un password aleatorio
   * @param longitude tamaño de password
   * @returns password generado
   */
  async passwordGenerator(longitude: Number) {
    let result = '';
    const abc = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(
      ' ',
    ); // Espacios para convertir cara letra a un elemento de un array

    for (let i = 0; i < longitude; i++) {
      const abc = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(
        ' ',
      ); // Espacios para convertir cara letra a un elemento de un array

      if (abc[i]) {
        // Condicional para prevenir errores en caso de que longitud sea mayor a 26
        const random = Math.floor(Math.random() * 4); // Generaremos el número
        const random2 = Math.floor(Math.random() * abc.length); // Generaremos el número
        const random3 = Math.floor(Math.random() * abc.length + 3); // Generaremos el número
        if (random == 1) {
          result += abc[random2];
        } else if (random == 2) {
          result += random3 + abc[random2];
        } else {
          result += abc[random2].toUpperCase();
        }
      }
    }
    return result;
  }
}
