'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { FAQSchema } from './SchemaMarkup'
import { Card } from '@/components/ui/card'

interface FAQ {
  question: string
  answer: string
  category?: string
}

interface FAQSectionProps {
  title?: string
  description?: string
  faqs: FAQ[]
  showSchema?: boolean
  className?: string
}

export function FAQSection({ 
  title = "Häufig gestellte Fragen", 
  description = "Antworten auf die wichtigsten Fragen zur Vibe Coding Bibel",
  faqs, 
  showSchema = true, 
  className = "" 
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <section className={`py-16 px-6 ${className}`} aria-labelledby="faq-heading">
      {showSchema && <FAQSchema faqs={faqs} />}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-blue-600" />
            <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                aria-expanded={openItems.has(index)}
                aria-controls={`faq-answer-${index}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  {openItems.has(index) ? (
                    <ChevronUp className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              {openItems.has(index) && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-6 pb-4 pt-0"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                >
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            Weitere Fragen?
          </h3>
          <p className="text-gray-600 mb-4">
            Wir helfen Ihnen gerne weiter. Kontaktieren Sie unser Support-Team.
          </p>
          <a
            href="mailto:support@vibecodingbible.agentland.saarland"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Support kontaktieren
          </a>
        </div>
      </div>
    </section>
  )
}

// Predefined FAQ Data for different sections
export const generalFAQs: FAQ[] = [
  {
    question: "Was ist die Vibe Coding Bibel?",
    answer: "Die Vibe Coding Bibel ist ein interaktives Lernprogramm, das Ihnen die 10 heiligen Gebote der KI-unterstützten Programmierung beibringt. Mit praktischen Workshops, Live-Coding-Sessionen und KI-Mentoring lernen Sie, wie Sie moderne Tools wie Claude Code und GitHub Copilot effektiv einsetzen können."
  },
  {
    question: "Für wen ist das Programm geeignet?",
    answer: "Das Programm richtet sich an Entwickler aller Erfahrungsstufen - von Anfängern bis zu erfahrenen Profis. Ob Sie gerade erst mit der Programmierung beginnen oder Ihre KI-Skills erweitern möchten, unsere Workshops passen sich Ihrem Niveau an."
  },
  {
    question: "Welche Programmiersprachen werden behandelt?",
    answer: "Wir fokussieren uns hauptsächlich auf moderne Web-Technologien wie JavaScript, TypeScript, React und Next.js. Zusätzlich behandeln wir Python für KI-Anwendungen und gehen auf verschiedene Tools und Frameworks ein, die in der KI-unterstützten Entwicklung wichtig sind."
  },
  {
    question: "Wie funktioniert das KI-Mentoring?",
    answer: "Jeder Workshop enthält einen integrierten KI-Mentor, der Ihnen in Echtzeit hilft. Sie können Fragen stellen, Code-Reviews erhalten und personalisierte Lernempfehlungen bekommen. Der Mentor passt sich Ihrem Lernstil und Fortschritt an."
  },
  {
    question: "Gibt es eine Geld-zurück-Garantie?",
    answer: "Ja, wir bieten eine 30-Tage-Geld-zurück-Garantie. Wenn Sie nicht zufrieden sind, erhalten Sie Ihr Geld ohne Fragen zurück. Wir sind überzeugt von der Qualität unserer Inhalte."
  }
]

export const technicalFAQs: FAQ[] = [
  {
    question: "Welche technischen Voraussetzungen benötige ich?",
    answer: "Sie benötigen lediglich einen modernen Webbrowser und eine stabile Internetverbindung. Alle Code-Editoren und Tools sind direkt im Browser verfügbar. Optional können Sie lokale Entwicklungsumgebungen einrichten, dies wird aber in den Workshops erklärt."
  },
  {
    question: "Kann ich die Workshops offline absolvieren?",
    answer: "Die Workshops sind hauptsächlich online verfügbar, da sie interaktive Elemente und KI-Funktionen enthalten. Sie können jedoch das E-Book in PDF- oder EPUB-Format herunterladen und offline lesen."
  },
  {
    question: "Erhalte ich Zertifikate für abgeschlossene Workshops?",
    answer: "Ja, nach erfolgreichem Abschluss jedes Workshops erhalten Sie ein digitales Zertifikat. Diese können Sie in Ihrem LinkedIn-Profil hinzufügen oder bei Bewerbungen verwenden."
  },
  {
    question: "Wie aktuell sind die Inhalte?",
    answer: "Unsere Inhalte werden regelmäßig aktualisiert, um mit den neuesten Entwicklungen in der KI-Technologie Schritt zu halten. Neue Features und Tools werden kontinuierlich in die Workshops integriert."
  }
]

export const pricingFAQs: FAQ[] = [
  {
    question: "Welche Zahlungsmethoden werden akzeptiert?",
    answer: "Wir akzeptieren alle gängigen Kreditkarten, PayPal und SEPA-Lastschrift. Für Unternehmen bieten wir auch Rechnungskauf an."
  },
  {
    question: "Kann ich mein Abonnement jederzeit kündigen?",
    answer: "Ja, Sie können Ihr Abonnement jederzeit kündigen. Es läuft dann zum Ende der aktuellen Abrechnungsperiode aus, und Sie behalten bis dahin vollen Zugang zu allen Inhalten."
  },
  {
    question: "Gibt es Rabatte für Studenten oder Teams?",
    answer: "Ja, wir bieten 50% Rabatt für Studenten mit gültigem Studentenausweis. Für Teams ab 5 Personen gibt es gestaffelte Rabatte bis zu 30%. Kontaktieren Sie uns für ein individuelles Angebot."
  },
  {
    question: "Was passiert nach der kostenlosen Testphase?",
    answer: "Die kostenlose Testphase läuft automatisch aus. Sie erhalten rechtzeitig eine Erinnerung und können dann entscheiden, ob Sie ein kostenpflichtiges Abonnement abschließen möchten."
  }
]