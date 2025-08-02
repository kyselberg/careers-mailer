import type { Email } from '@/types/email';
import { useQuery } from '@tanstack/react-query';

const fetchEmails = async (): Promise<Email[]> => {
  const response = await fetch('/api/emails');
  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }
  return response.json();
};

export const useEmails = () => {
  return useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  });
};