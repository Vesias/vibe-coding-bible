'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { FileDown, FileText, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface FloatingExportButtonProps {
  className?: string;
}

export function FloatingExportButton({ className = '' }: FloatingExportButtonProps) {
  const [isExporting, setIsExporting] = useState<{
    pdf: boolean;
    epub: boolean;
  }>({
    pdf: false,
    epub: false,
  });

  const handleExport = async (format: 'pdf' | 'epub') => {
    setIsExporting(prev => ({ ...prev, [format]: true }));
    
    try {
      const endpoint = `/api/export/${format}`;
      const params = new URLSearchParams({
        type: 'complete',
      });

      const response = await fetch(`${endpoint}?${params}`, {
        method: 'GET',
        headers: {
          'Accept': format === 'pdf' ? 'application/pdf' : 'application/epub+zip',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to generate ${format.toUpperCase()}`);
      }

      // Get the blob and create download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      // Extract filename from response headers or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : generateFilename(format);

      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast.success(`${format.toUpperCase()} erfolgreich erstellt!`, {
        description: `Die Datei "${filename}" wurde heruntergeladen.`,
      });

    } catch (error) {
      console.error(`${format.toUpperCase()} export error:`, error);
      toast.error(`${format.toUpperCase()}-Export fehlgeschlagen`, {
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
      });
    } finally {
      setIsExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            aria-label="VibeCodingBibel als eBook exportieren"
          >
            <FileDown className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          side="top"
          className="w-80 p-4"
        >
          <DropdownMenuLabel className="text-lg font-semibold flex items-center gap-2">
            <FileDown className="h-5 w-5" />
            VibeCodingBibel™ Export
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          <div className="space-y-3 py-2">
            <DropdownMenuItem 
              onClick={() => handleExport('pdf')}
              disabled={isExporting.pdf}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg">
                {isExporting.pdf ? (
                  <Loader2 className="h-5 w-5 animate-spin text-red-600" />
                ) : (
                  <FileText className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">PDF Export</div>
                <div className="text-sm text-muted-foreground">
                  Professionelles Layout, druckoptimiert
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => handleExport('epub')}
              disabled={isExporting.epub}
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                {isExporting.epub ? (
                  <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                ) : (
                  <BookOpen className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-medium">ePub Export</div>
                <div className="text-sm text-muted-foreground">
                  Für alle eBook-Reader, responsive
                </div>
              </div>
            </DropdownMenuItem>
          </div>
          
          <DropdownMenuSeparator />
          
          <div className="text-xs text-muted-foreground p-2 text-center">
            Kostenlos • DSGVO-konform • Ohne Tracking
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function generateFilename(format: 'pdf' | 'epub'): string {
  const date = new Date().toISOString().slice(0, 10);
  return `vibe-coding-bibel-complete-${date}.${format}`;
}