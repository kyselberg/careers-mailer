import { AddEmailModal } from "@/components/AddEmailModal";
import { DeleteEmailModal } from "@/components/DeleteEmailModal";
import { EmailCard } from "@/components/EmailCard";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useCreateEmail } from "@/hooks/useCreateEmail";
import { useDeleteEmail } from "@/hooks/useDeleteEmail";
import { useEmails } from "@/hooks/useEmails";
import type { Email } from "@/types/email";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Loader2, Plus } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: emails, isLoading, error } = useEmails();
  const createEmailMutation = useCreateEmail();
  const deleteEmailMutation = useDeleteEmail();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<Email | null>(null);

  const handleCreateEmail = async (data: { title: string; email: string }) => {
    await createEmailMutation.mutateAsync(data);
  };

  const handleDeleteEmail = (email: Email) => {
    setEmailToDelete(email);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (emailToDelete) {
      await deleteEmailMutation.mutateAsync(emailToDelete.id);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEmailToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading emails...</span>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="h-6 w-6" />
              <span className="text-lg">Failed to load emails</span>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Submissions</h1>
            <p className="text-gray-600">
              {emails?.length || 0} email{emails?.length !== 1 ? 's' : ''} submitted
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Email
          </Button>
        </div>

        {/* Email Cards Grid */}
        {emails && emails.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {emails.map((email) => (
              <EmailCard key={email.id} email={email} onDelete={handleDeleteEmail} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No emails yet</h3>
              <p className="text-gray-500">Email submissions will appear here once they're received.</p>
            </div>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster />

      {/* Add Email Modal */}
      <AddEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEmail}
        isLoading={createEmailMutation.isPending}
      />

      {/* Delete Email Modal */}
      <DeleteEmailModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        email={emailToDelete}
        isLoading={deleteEmailMutation.isPending}
      />
    </div>
  );
}
