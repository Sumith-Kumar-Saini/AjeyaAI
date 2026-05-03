import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { processDocument } from '@/lib/api-endpoints';
import { toast } from 'sonner';

export function DocumentTable({ documents, onProcessSuccess }: { documents: any[], onProcessSuccess: () => void }) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcess = async (docId: string) => {
    try {
      setProcessingId(docId);
      await processDocument(docId);
      toast.success('Document processing triggered successfully');
      onProcessSuccess();
    } catch (err) {
      toast.error('Failed to process document');
    } finally {
      setProcessingId(null);
    }
  };

  if (!documents || documents.length === 0) {
    return (
      <div className="p-8 text-center border rounded-md text-muted-foreground bg-muted/20">
        No documents uploaded yet. Upload a document to start processing.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>
                <Badge 
                  variant={doc.status === 'processed' ? 'default' : doc.status === 'processing' ? 'secondary' : 'outline'}
                >
                  {doc.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleProcess(doc.id)}
                  disabled={doc.status === 'processing' || doc.status === 'processed' || processingId === doc.id}
                >
                  {processingId === doc.id ? 'Processing...' : 'Process'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
