import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCpf(cpf: string): string {
  const d = cpf.replace(/\D/g, '');
  if (d.length !== 11) {return cpf;}
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length === 11) {return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;}
  if (d.length === 10) {return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;}
  return phone;
}

export function formatDateBR(date: Date): string {
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function isoToBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
