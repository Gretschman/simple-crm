import { useState } from 'react';
import { Upload, X, File, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface FileAttachment {
  name: string;
  url: string;
  size: number;
  type: string;
  uploaded_at: string;
}

interface FileUploadProps {
  contactId: string;
  userId: string;
  attachments: FileAttachment[];
  onUploadComplete: (newAttachments: FileAttachment[]) => void;
}

export function FileUpload({ contactId, userId, attachments, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const newAttachments: FileAttachment[] = [];

      for (const file of Array.from(files)) {
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large. Max size is 5MB.`);
          continue;
        }

        // Generate unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${userId}/${contactId}/${fileName}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('contact-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data } = supabase.storage
          .from('contact-files')
          .getPublicUrl(filePath);

        newAttachments.push({
          name: file.name,
          url: data.publicUrl,
          size: file.size,
          type: file.type,
          uploaded_at: new Date().toISOString(),
        });
      }

      // Combine with existing attachments
      const updatedAttachments = [...attachments, ...newAttachments];
      onUploadComplete(updatedAttachments);

      toast.success(`${newAttachments.length} file(s) uploaded successfully`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (fileUrl: string) => {
    try {
      // Extract file path from URL
      const url = new URL(fileUrl);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/contact-files\/(.+)/);

      if (!pathMatch) {
        throw new Error('Invalid file URL');
      }

      const filePath = pathMatch[1];

      // Delete from storage
      const { error } = await supabase.storage
        .from('contact-files')
        .remove([filePath]);

      if (error) throw error;

      // Remove from attachments array
      const updatedAttachments = attachments.filter(a => a.url !== fileUrl);
      onUploadComplete(updatedAttachments);

      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span className="text-sm">
                {uploading ? 'Uploading...' : 'Upload files'}
              </span>
            </div>
          </label>
          <span className="text-xs text-gray-500">Max 5MB per file</span>
        </div>
      </div>

      {attachments.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded files ({attachments.length})
          </p>
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate block"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => handleDeleteFile(file.url)}
                  className="flex-shrink-0 p-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
