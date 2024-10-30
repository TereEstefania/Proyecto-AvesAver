/**
 * @description Valida el formato del email.
 * @param email El email a validar.
 * @returns true si el email es válido, false si no lo es.
 */
  export function validarEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  
  /**
   * @description Valida si una contraseña cumple con los requisitos de seguridad. Debe tener al menos 8 caracteres, una mayúscula, un número y un signo especial.
   * @param password La contraseña a validar.
   * @returns true si la contraseña es válida, false si no lo es.
   */
  export function validarPassword(password: string): boolean {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/;
    return passwordPattern.test(password);
  }