import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { copyToClipboard } from '@/lib/copy';
import type { Email } from '@/types/email';
import { Copy, FileText, Hash, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface EmailCardProps {
  email: Email;
}

export const EmailCard = ({ email }: EmailCardProps) => {
  const handleCopy = async (text: string, type: 'email' | 'hash') => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`${type === 'email' ? 'Email' : 'Hash'} copied to clipboard!`);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5 text-blue-600" />
          {email.title || 'Untitled'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Mail className="h-4 w-4" />
            Email
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-800 truncate flex-1 mr-2">
              {email.email}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(email.email, 'email')}
              className="h-8 w-8 p-0 hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hash Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Hash className="h-4 w-4" />
            Hash
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-800 truncate flex-1 mr-2 font-mono">
              {email.hash}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(email.hash, 'hash')}
              className="h-8 w-8 p-0 hover:bg-gray-200"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};