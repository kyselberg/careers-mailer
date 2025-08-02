import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface CreateEmailData {
  title: string;
  email: string;
}

const createEmail = async (data: CreateEmailData): Promise<unknown> => {
  const response = await fetch('/api/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create email');
  }

  return response.json();
};

export const useCreateEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmail,
    onSuccess: () => {
      toast.success('Email created successfully!');
      // Refetch the emails list in the background
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create email');
    },
  });
};