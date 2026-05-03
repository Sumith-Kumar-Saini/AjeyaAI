import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { uploadDocument } from '@/lib/api-endpoints';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';

export function UploadButton({ projectId, onUploadSuccess }: { projectId: string, onUploadSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await uploadDocument(projectId, file);
      toast.success('Document uploaded successfully');
      onUploadSuccess();
    } catch (err) {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={uploading}
        className="gap-2"
      >
        <UploadCloud className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </>
  );
}
