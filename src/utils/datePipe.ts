export const datePipe = (input: string): string => {
  if (!input) return 'Fecha inválida';

  const dateObj = new Date(input);
  if (isNaN(dateObj.getTime())) return 'Fecha inválida';

  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const dd = dateObj.getDate();
  const mm = months[dateObj.getMonth()];
  const yyyy = dateObj.getFullYear();

  return `${dd} de ${mm} de ${yyyy}`;
};
