import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText } from 'lucide-react';

interface FileUploadProps {
  register: any;
  error?: string;
}

export const FileUpload = ({ register, error }: FileUploadProps) => {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="cv"
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <FileText className="w-4 h-4" />
        Upload CV
      </Label>
      <div className="relative">
        <Input
          id="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          className={`file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'focus:border-blue-500 focus:ring-blue-200'
          }`}
          {...register('cv', {
            required: 'Please upload your CV',
            validate: {
              fileType: (files: FileList) => {
                if (!files || files.length === 0) return 'Please select a file';
                const file = files[0];
                const allowedTypes = [
                  'application/pdf',
                  'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ];
                return (
                  allowedTypes.includes(file.type) ||
                  'Please upload a PDF or Word document'
                );
              },
              fileSize: (files: FileList) => {
                if (!files || files.length === 0) return true;
                const file = files[0];
                return (
                  file.size <= 10 * 1024 * 1024 ||
                  'File size should be less than 10MB'
                );
              },
            },
          })}
        />
        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
      <p className="text-xs text-gray-500">
        Supported formats: PDF, DOC, DOCX (max 10MB)
      </p>
    </div>
  );
};
