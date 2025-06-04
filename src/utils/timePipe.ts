export const timePipe = (hour: number, min: number): string => {
  // Convertir a formato 12h
  const period = hour >= 12 ? 'PM' : 'AM';
  const hours12 = hour % 12 || 12; // 0 se convierte en 12

  // Formatear minutos con 2 dígitos
  const paddedMinutes = min.toString().padStart(2, '0');

  return `${hours12}:${paddedMinutes} ${period}`;
};
