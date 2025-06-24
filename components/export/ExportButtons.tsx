'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, BookOpen, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonsProps {
  type: 'complete' | 'workshop';
  workshopId?: string;
  title?: string;
  variant?: 'default' | 'compact';
}

type ExportFormat = 'pdf' | 'epub';

export function ExportButtons({ 
  type, 
  workshopId, 
  title,
  variant = 'default' 
}: ExportButtonsProps) {
  const [isExporting, setIsExporting] = useState<{
    pdf: boolean;
    epub: boolean;
  }>({
    pdf: false,
    epub: false,
  });

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(prev => ({ ...prev, [format]: true }));
    
    try {
      const endpoint = `/api/export/${format}`;
      const params = new URLSearchParams({
        type,
        ...(workshopId && { workshopId }),
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
        : generateFilename(format, type, workshopId);

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

  if (variant === 'compact') {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => handleExport('pdf')}
          disabled={isExporting.pdf}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          {isExporting.pdf ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <FileText className="h-3 w-3" />
          )}
          PDF
        </Button>
        
        <Button
          onClick={() => handleExport('epub')}
          disabled={isExporting.epub}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
        >
          {isExporting.epub ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <BookOpen className="h-3 w-3" />
          )}
          ePub
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FileDown className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Als eBook exportieren</h3>
        <Badge variant="secondary">KOSTENLOS</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Lade {type === 'complete' ? 'die vollständige VibeCodingBibel™' : 'diesen Workshop'} 
        in professioneller Buchqualität herunter - optimiert für Print und digitales Lesen.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PDF Export */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-600" />
            <h4 className="font-medium">PDF Export</h4>
          </div>
          
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Professionelles Layout mit AgentLand Branding</li>
            <li>• Optimiert für Print und Bildschirm</li>
            <li>• Inhaltsverzeichnis und Seitenzahlen</li>
            <li>• Deutsche Typographie-Standards</li>
          </ul>
          
          <Button
            onClick={() => handleExport('pdf')}
            disabled={isExporting.pdf}
            className="w-full"
            variant="outline"
          >
            {isExporting.pdf ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                PDF wird erstellt...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                PDF herunterladen
              </>
            )}
          </Button>
        </div>

        {/* ePub Export */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <h4 className="font-medium">ePub Export</h4>
          </div>
          
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Kompatibel mit allen eBook-Readern</li>
            <li>• Responsive Layout für alle Bildschirmgrößen</li>
            <li>• Anpassbare Schriftgröße</li>
            <li>• Offline-Lesen möglich</li>
          </ul>
          
          <Button
            onClick={() => handleExport('epub')}
            disabled={isExporting.epub}
            className="w-full"
            variant="outline"
          >
            {isExporting.epub ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ePub wird erstellt...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                ePub herunterladen
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-bold">!</span>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              AgentLand Qualitätsgarantie
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              Alle Exports enthalten die neuesten Inhalte und wurden mit deutschen 
              Qualitätsstandards erstellt. DSGVO-konform ohne Tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateFilename(format: ExportFormat, type: string, workshopId?: string): string {
  const date = new Date().toISOString().slice(0, 10);
  
  if (type === 'workshop' && workshopId) {
    return `vibe-coding-bibel-workshop-${workshopId}-${date}.${format}`;
  }
  
  return `vibe-coding-bibel-complete-${date}.${format}`;
}