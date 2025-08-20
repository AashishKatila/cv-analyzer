'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { JobDescriptionInput } from './job-description-input';
import { FileUpload } from './file-upload';
import {
  FileText,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiHandler } from '@/utils/api-handler';

export const CVAnalyzerForm = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('cv', data.cv[0]);
    formData.append('jobDescription', data.jobDescription);

    try {
      const res = await apiHandler.postWithFile('/api/cv-upload', formData);

      setAnalysisText(res.suggestion || 'No analysis available');
      setSuccess(true);
      reset();
      setDialogOpen(true);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong during analysis. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSuccess(false);
    setError('');
  };

  return (
    <>
      <div className="max-w-2xl mx-auto  bg-white h-screen flex flex-col justify-center items-center">
        <div className="rounded-xl shadow p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              CV Analyzer
            </h2>
            <p className="text-gray-600">
              Upload your CV and job description to get personalized improvement
              suggestions
            </p>
          </div>

          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Analysis completed successfully! Check the results below.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <JobDescriptionInput
              register={register}
              error={errors.jobDescription?.message as string}
            />
            <FileUpload
              register={register}
              error={errors.cv?.message as string}
            />

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing CV...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Analyze CV
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-[95vw] w-[1000px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  CV Analysis Results
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Here are your personalized improvement suggestions
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-6">
            <div className="">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                {analysisText}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-gray-200 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(analysisText);
              }}
              className="flex-1"
            >
              Copy Results
            </Button>
            <Button
              onClick={handleDialogClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
