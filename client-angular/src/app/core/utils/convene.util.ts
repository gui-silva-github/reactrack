export function addDay(valueDate: Date | string): string {
  const date = new Date(valueDate);
  date.setDate(date.getDate() + 1);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
