import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Email } from '@/types/email';
import { Trash2 } from 'lucide-react';

interface DeleteEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  email: Email | null;
  isLoading: boolean;
}

export const DeleteEmailModal = ({
  isOpen,
  onClose,
  onConfirm,
  email,
  isLoading
}: DeleteEmailModalProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Delete Email
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this email? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {email && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm font-medium text-gray-700">Title:</span>
              <p className="text-sm text-gray-900">{email.title || 'Untitled'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <p className="text-sm text-gray-900">{email.email}</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};