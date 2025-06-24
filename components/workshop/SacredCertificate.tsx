'use client'

import React, { useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Share2, 
  Trophy, 
  Crown, 
  Star,
  Sparkles,
  Award,
  Calendar,
  User
} from 'lucide-react'

interface SacredCertificateProps {
  workshop: any
  completionDate: Date
  userInfo?: {
    name?: string
    email?: string
  }
  xpEarned: number
  onDownload?: () => void
  onShare?: () => void
}

const SacredCertificate: React.FC<SacredCertificateProps> = ({
  workshop,
  completionDate,
  userInfo,
  xpEarned,
  onDownload,
  onShare
}) => {
  const certificateRef = useRef<HTMLDivElement>(null)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const generateCertificateId = () => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `VCB-${workshop.commandmentNumber}-${timestamp}-${random}`.toUpperCase()
  }

  const certificateId = generateCertificateId()

  const downloadCertificate = async () => {
    if (!certificateRef.current) return

    try {
      // First, try to generate a high-quality image certificate
      const html2canvas = (await import('html2canvas')).default
      
      const canvas = await html2canvas(certificateRef.current, {
        backgroundColor: '#0f172a',
        scale: 3, // Higher resolution
        logging: false,
        useCORS: true,
        width: 1200,
        height: 850,
        allowTaint: true
      })

      // Create download link for image
      const link = document.createElement('a')
      link.download = `vibe-coding-certificate-${workshop.id}-${certificateId}.png`
      link.href = canvas.toDataURL('image/png', 1.0) // Maximum quality
      link.click()

      // Also generate a PDF version
      await generatePDFCertificate(canvas)

      onDownload?.()
    } catch (error) {
      console.error('Failed to generate certificate:', error)
      // Enhanced fallback: Create both text and JSON certificate
      await generateFallbackCertificate()
    }
  }

  const generatePDFCertificate = async (canvas: HTMLCanvasElement) => {
    try {
      // Dynamically import jsPDF to avoid SSR issues
      const { jsPDF } = await import('jspdf')
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      // Add the certificate image to PDF
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 10, 10, 277, 190)

      // Add verification footer
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Certificate ID: ${certificateId}`, 15, 205)
      pdf.text(`Verify at: vibecodingbible.agentland.saarland/verify/${certificateId}`, 15, 210)
      pdf.text(`Generated: ${new Date().toISOString()}`, 15, 215)

      // Save the PDF
      pdf.save(`vibe-coding-certificate-${workshop.id}-${certificateId}.pdf`)
    } catch (error) {
      console.error('Failed to generate PDF:', error)
    }
  }

  const generateFallbackCertificate = async () => {
    const certificateData = {
      id: certificateId,
      workshop: {
        id: workshop.id,
        title: workshop.title,
        commandmentNumber: workshop.commandmentNumber,
        difficulty: workshop.difficulty
      },
      user: {
        name: userInfo?.name || 'Sacred Developer',
        email: userInfo?.email
      },
      completion: {
        date: completionDate.toISOString(),
        xpEarned,
        achievements: ['Workshop Completed', 'Certificate Earned']
      },
      issuer: {
        organization: 'AgentLand Saarland GmbH',
        location: 'Made in Germany',
        website: 'vibecodingbible.agentland.saarland'
      },
      verification: {
        url: `https://vibecodingbible.agentland.saarland/verify/${certificateId}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://vibecodingbible.agentland.saarland/verify/${certificateId}`)}`
      }
    }

    // Create JSON certificate
    const jsonBlob = new Blob([JSON.stringify(certificateData, null, 2)], { type: 'application/json' })
    const jsonUrl = URL.createObjectURL(jsonBlob)
    const jsonLink = document.createElement('a')
    jsonLink.download = `vibe-coding-certificate-${workshop.id}-${certificateId}.json`
    jsonLink.href = jsonUrl
    jsonLink.click()
    URL.revokeObjectURL(jsonUrl)

    // Create enhanced text certificate
    const certificateText = `
🏆 VIBE CODING BIBEL™ CERTIFICATE 🏆

Certificate of Sacred Mastery

═══════════════════════════════════════════════════════════

This certifies that ${userInfo?.name || 'Sacred Developer'} has successfully completed:

${workshop.title}
Commandment ${workshop.commandmentNumber} (${workshop.difficulty})

═══════════════════════════════════════════════════════════

Completion Date: ${formatDate(completionDate)}
XP Earned: ${xpEarned}
Certificate ID: ${certificateId}

═══════════════════════════════════════════════════════════

"Du sollst die heiligen Gebote der KI-unterstützten Entwicklung befolgen"

This certificate represents mastery of:
- Advanced AI-assisted development techniques
- Sacred coding principles and best practices
- Practical implementation of Vibe Coding methodologies

═══════════════════════════════════════════════════════════

Issued by: AgentLand Saarland GmbH
Made in Germany 🇩🇪

Verification: https://vibecodingbible.agentland.saarland/verify/${certificateId}
Generated: ${new Date().toISOString()}

═══════════════════════════════════════════════════════════
    `.trim()

    const textBlob = new Blob([certificateText], { type: 'text/plain' })
    const textUrl = URL.createObjectURL(textBlob)
    const textLink = document.createElement('a')
    textLink.download = `vibe-coding-certificate-${workshop.id}-${certificateId}.txt`
    textLink.href = textUrl
    textLink.click()
    URL.revokeObjectURL(textUrl)

    // Store certificate data for verification
    localStorage.setItem(`certificate-${certificateId}`, JSON.stringify(certificateData))
  }

  const shareCertificate = () => {
    const shareText = `🎉 I just completed "${workshop.title}" in the Vibe Coding Bible! 🏆\n\n${xpEarned} XP earned mastering the sacred art of AI-assisted development.\n\n#VibeCoding #AI #Programming #AgentLand`
    
    if (navigator.share) {
      navigator.share({
        title: `Vibe Coding Certificate - ${workshop.title}`,
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Certificate text copied to clipboard!')
      })
    }
    
    onShare?.()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-emerald-600'
      case 'Intermediate': return 'from-yellow-500 to-orange-600'
      case 'Advanced': return 'from-orange-500 to-red-600'
      case 'Expert': return 'from-red-500 to-purple-600'
      default: return 'from-blue-500 to-purple-600'
    }
  }

  const verificationUrl = `https://vibecodingbible.agentland.saarland/verify/${certificateId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verificationUrl)}&bgcolor=0f172a&color=FFCE00`

  return (
    <div className="space-y-6">
      {/* Certificate Actions */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={downloadCertificate}
          className="flex items-center gap-2"
          style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
        >
          <Download className="w-4 h-4" />
          Download Certificate (PNG + PDF)
        </Button>
        <Button 
          onClick={shareCertificate}
          variant="outline"
          className="flex items-center gap-2"
          style={{ borderColor: '#FFCE00', color: '#FFCE00' }}
        >
          <Share2 className="w-4 h-4" />
          Share Achievement
        </Button>
      </div>

      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="relative overflow-hidden rounded-2xl border-2 border-gradient-to-r"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #581c87 100%)',
          borderImage: 'linear-gradient(90deg, #FFCE00, #009EE0, #FFCE00) 1'
        }}
      >
        {/* Sacred Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🔮</div>
          <div className="absolute top-20 right-20 text-4xl">✨</div>
          <div className="absolute bottom-20 left-20 text-5xl">📜</div>
          <div className="absolute bottom-10 right-10 text-6xl">🏛️</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-30">👑</div>
        </div>

        <div className="relative z-10 p-12 text-center space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center">
              <Crown className="w-16 h-16" style={{ color: '#FFCE00' }} />
            </div>
            <h1 className="text-4xl font-bold" style={{
              background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 50%, #FFCE00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              VIBE CODING BIBEL™
            </h1>
            <p className="text-xl" style={{ color: '#cbd5e1' }}>
              Certificate of Sacred Mastery
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6 py-8">
            <p className="text-lg" style={{ color: '#94a3b8' }}>
              This certifies that
            </p>
            
            <div className="text-3xl font-bold" style={{ color: '#FFCE00' }}>
              {userInfo?.name || 'Sacred Developer'}
            </div>
            
            <p className="text-lg" style={{ color: '#94a3b8' }}>
              has successfully completed
            </p>
            
            <div className="space-y-2">
              <div className="text-4xl mb-2">{workshop.sacredSymbol}</div>
              <h2 className="text-2xl font-bold" style={{ color: '#009EE0' }}>
                {workshop.title}
              </h2>
              <p className="text-lg" style={{ color: '#cbd5e1' }}>
                Commandment {workshop.commandmentNumber}
              </p>
            </div>

            {/* Badges and Stats */}
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge className={`px-4 py-2 text-sm bg-gradient-to-r ${getDifficultyColor(workshop.difficulty)} text-white border-0`}>
                <Star className="w-4 h-4 mr-2" />
                {workshop.difficulty}
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
                <Award className="w-4 h-4 mr-2" />
                {xpEarned} XP
              </Badge>
              <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0">
                <Trophy className="w-4 h-4 mr-2" />
                Mastery
              </Badge>
            </div>

            {/* Sacred Wisdom */}
            <div className="py-4 px-6 rounded-lg border" style={{
              background: 'rgba(15, 23, 42, 0.5)',
              borderColor: 'rgba(255, 206, 0, 0.3)'
            }}>
              <p className="text-sm italic" style={{ color: '#FFCE00' }}>
                "{workshop.sacredWisdom}"
              </p>
            </div>
          </div>

          {/* Footer with Verification */}
          <div className="border-t pt-6 space-y-4" style={{ borderColor: '#475569' }}>
            <div className="grid md:grid-cols-4 gap-4 text-sm items-center">
              <div className="flex items-center justify-center gap-2" style={{ color: '#94a3b8' }}>
                <Calendar className="w-4 h-4" />
                {formatDate(completionDate)}
              </div>
              <div className="flex items-center justify-center gap-2" style={{ color: '#94a3b8' }}>
                <Sparkles className="w-4 h-4" />
                ID: {certificateId.substring(0, 12)}...
              </div>
              <div className="flex items-center justify-center gap-2" style={{ color: '#94a3b8' }}>
                <User className="w-4 h-4" />
                AgentLand GmbH
              </div>
              {/* QR Code for Verification */}
              <div className="flex justify-center">
                <div className="text-center">
                  <img
                    src={qrCodeUrl}
                    alt="Certificate Verification QR Code"
                    className="w-16 h-16 mx-auto mb-1 border border-gray-600 rounded"
                    style={{ backgroundColor: '#0f172a' }}
                  />
                  <p className="text-xs" style={{ color: '#64748b' }}>
                    Verify Certificate
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-xs" style={{ color: '#64748b' }}>
                "Du sollst die heiligen Gebote der KI-unterstützten Entwicklung befolgen"
              </p>
              <p className="text-xs" style={{ color: '#64748b' }}>
                Made in Germany 🇩🇪 • vibecodingbible.agentland.saarland
              </p>
              <p className="text-xs" style={{ color: '#475569' }}>
                Verification: {verificationUrl}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={downloadCertificate}
          className="flex items-center gap-2 px-6 py-3 text-lg font-semibold"
          style={{
            background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)',
            color: '#000'
          }}
        >
          <Download className="w-5 h-5" />
          Certificate herunterladen
        </Button>
        
        <Button
          variant="outline"
          onClick={shareCertificate}
          className="flex items-center gap-2 px-6 py-3 text-lg font-semibold"
          style={{
            borderColor: '#FFCE00',
            color: '#FFCE00'
          }}
        >
          <Share2 className="w-5 h-5" />
          Teilen
        </Button>
      </div>

      {/* Certificate Instructions */}
      <Card style={{ background: 'rgba(30, 41, 59, 0.8)', borderColor: '#475569' }}>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#FFCE00' }}>
            🎉 Glückwunsch zur Vollendung!
          </h3>
          <div className="space-y-2 text-sm" style={{ color: '#cbd5e1' }}>
            <p>• Dein Certificate wird automatisch als PNG-Bild heruntergeladen</p>
            <p>• Teile deine Erfolge in sozialen Medien oder deinem beruflichen Netzwerk</p>
            <p>• Füge das Certificate zu deinem LinkedIn-Profil hinzu</p>
            <p>• Sammle alle 10 Commandment-Certificates für den Divine Prophet Status</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SacredCertificate