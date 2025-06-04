export const timePipe = (hours: number, minutes: number): string => {
  // Convertir a formato 12h
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // 0 se convierte en 12

  // Formatear minutos con 2 dígitos
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${hours12}:${paddedMinutes} ${period}`;
};
