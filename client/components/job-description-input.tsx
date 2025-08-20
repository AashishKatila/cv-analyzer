import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

interface JobDescriptionInputProps {
  register: any;
  error?: string;
}

export const JobDescriptionInput = ({
  register,
  error,
}: JobDescriptionInputProps) => {
  return (
    <div className="space-y-3">
      <Label
        htmlFor="jobDescription"
        className="flex items-center gap-2 text-sm font-medium text-gray-700"
      >
        <Briefcase className="w-4 h-4" />
        Job Description
      </Label>
      <Textarea
        id="jobDescription"
        placeholder="Paste the job description here to get tailored suggestions for your CV..."
        className={`min-h-32 resize-none transition-colors duration-200 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'focus:border-blue-500 focus:ring-blue-200'
        }`}
        {...register('jobDescription', {
          required: 'Job description is required',
          minLength: {
            value: 50,
            message: 'Job description should be at least 50 characters long',
          },
        })}
      />
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
};
