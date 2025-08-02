import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const deleteEmail = async (id: number): Promise<void> => {
  const response = await fetch(`/api/emails/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete email');
  }
};

export const useDeleteEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEmail,
    onSuccess: () => {
      toast.success('Email deleted successfully!');
      // Refetch the emails list in the background
      queryClient.invalidateQueries({ queryKey: ['emails'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete email');
    },
  });
};