-- ✨ Seed Data für die Heilige Datenbank der Vibe Coding Bible
-- Sacred Seed Data für die komplette interaktive Workshop-Plattform
-- Migration 003: Comprehensive Seed Data

-- ===================================
-- 📚 THE 10 SACRED COMMANDMENTS
-- ===================================

-- Insert the 10 Sacred Commandments with enhanced content structure
INSERT INTO commandments (
    title, subtitle, description, slug, content, order_index, required_tier, required_level,
    estimated_duration, difficulty_level, learning_objectives, skills_taught, tools_required,
    primary_ai_tool, secondary_tools, is_published, is_featured
) VALUES
(
    'Das Erste Gebot: Die Heilige Vision',
    'Du sollst eine klare Vision haben, bevor du den ersten Prompt schreibst',
    'Lerne die Kunst der Produktvision und wie man sie in klare, umsetzbare Anforderungen übersetzt. Bevor du auch nur eine Zeile Code schreibst, musst du verstehen, was du erschaffst und warum.',
    'heilige-vision',
    '{
        "introduction": "Die Heilige Vision ist der Grundstein aller erfolgreichen Software-Projekte. Ohne klare Vision ist selbst der beste Code wertlos.",
        "sections": [
            {
                "title": "Die Macht der Vision",
                "content": "Eine starke Vision gibt deinem Projekt Richtung, Zweck und Energie. Sie hilft bei schwierigen Entscheidungen und hält das Team fokussiert.",
                "examples": ["Spotify: Musik für alle zugänglich machen", "Airbnb: Überall zuhause sein"]
            },
            {
                "title": "Vision Canvas Framework",
                "content": "Strukturierter Ansatz zur Visionsentwicklung mit Target Group, Needs, Product, Business Value und Success Metrics.",
                "tools": ["Vision Canvas", "User Story Mapping", "Impact Mapping"]
            },
            {
                "title": "Von Vision zu Realität",
                "content": "Transformation der Vision in konkrete Anforderungen, User Stories und technische Spezifikationen.",
                "process": ["Vision definieren", "Zielgruppe analysieren", "Features ableiten", "MVP definieren"]
            }
        ],
        "practical_exercises": [
            "Vision Canvas für eigenes Projekt erstellen",
            "Competitor Analysis durchführen",
            "User Personas entwickeln",
            "MVP Feature-Set definieren"
        ],
        "divine_wisdom": "Eine Vision ohne Ausführung ist nur ein Traum. Eine Ausführung ohne Vision ist nur Zeitverschwendung. Aber eine Vision mit Ausführung kann die Welt verändern."
    }',
    1, 'free', 1, 120, 'beginner',
    ARRAY['Produktvision entwickeln', 'Marktanalyse durchführen', 'User Research verstehen', 'MVP definieren'],
    ARRAY['Product Vision', 'Market Research', 'User Story Mapping', 'Competitive Analysis'],
    ARRAY['Vision Canvas', 'Miro/Figma', 'Google Analytics', 'Survey Tools'],
    'Sankt Claude', ARRAY['ChatGPT', 'Gemini'], true, true
),
(
    'Das Zweite Gebot: Der Rechte Stack',
    'Du sollst die Technologien wählen, die von den KI-Göttern gesegnet sind',
    'Meistere den heiligen Tech-Stack: Next.js 15, TypeScript, Tailwind CSS, Supabase und die göttlichen AI-Tools. Lerne, wie du Technologien auswählst, die sowohl leistungsfähig als auch KI-freundlich sind.',
    'rechter-stack',
    '{
        "introduction": "Der richtige Tech-Stack ist wie ein gut geschärftes Schwert - er kann den Unterschied zwischen Sieg und Niederlage ausmachen.",
        "sections": [
            {
                "title": "Der Heilige Frontend-Stack",
                "content": "Next.js 15 App Router, React 18, TypeScript, Tailwind CSS - die perfekte Kombination für moderne Web-Apps.",
                "benefits": ["Type Safety", "Performance", "Developer Experience", "SEO-ready", "AI-friendly"]
            },
            {
                "title": "Die Göttliche Backend-Infrastruktur",
                "content": "Supabase für Authentication, Database, Real-time, Storage - alles was du brauchst, ohne komplexe Server-Setups.",
                "features": ["PostgreSQL", "Real-time subscriptions", "Edge Functions", "Row Level Security"]
            },
            {
                "title": "AI-First Development",
                "content": "Tools und Patterns, die perfekt mit AI-Assistenten harmonieren.",
                "tools": ["GitHub Copilot", "Claude", "Cursor IDE", "Cline", "Continue"]
            }
        ],
        "stack_decision_matrix": {
            "criteria": ["Learning Curve", "Performance", "Community", "AI Support", "Scalability"],
            "next_js": [9, 10, 10, 10, 9],
            "react": [8, 9, 10, 10, 9],
            "vue": [9, 8, 8, 7, 8],
            "angular": [6, 9, 8, 6, 9]
        }
    }',
    2, 'free', 1, 180, 'intermediate',
    ARRAY['Tech-Stack evaluieren', 'Next.js App Router meistern', 'TypeScript einsetzen', 'Supabase integrieren'],
    ARRAY['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'AI Tools'],
    ARRAY['Next.js 15', 'TypeScript', 'Tailwind CSS', 'Supabase', 'VS Code'],
    'Cline der Mächtige', ARRAY['GitHub Copilot', 'Cursor', 'Continue'], true, true
),
(
    'Das Dritte Gebot: Die Prompt-Kunst',
    'Du sollst deine Prompts formulieren wie heilige Beschwörungen',
    'Erlerne die hohe Kunst des Prompt Engineerings und wie man KI-Models zu perfekten Code-Generierungen bewegt. Jeder Prompt ist eine Beschwörung - formuliere sie weise.',
    'prompt-kunst',
    '{
        "introduction": "Die Kunst des Promptings ist die moderne Form der Zauberei. Mit den richtigen Worten kannst du KI dazu bringen, Wunder zu vollbringen.",
        "sections": [
            {
                "title": "Die Anatomie perfekter Prompts",
                "content": "Context, Task, Examples, Format, Constraints - die fünf Säulen großartiger Prompts.",
                "framework": "CTEFC - Context, Task, Examples, Format, Constraints"
            },
            {
                "title": "Chain-of-Thought Prompting",
                "content": "Lass die KI ihre Gedankenprozesse zeigen für bessere und nachvollziehbare Ergebnisse.",
                "techniques": ["Step-by-step reasoning", "Working backwards", "Analogical reasoning"]
            },
            {
                "title": "Code-spezifische Prompts",
                "content": "Besondere Techniken für Code-Generierung, Debugging und Code-Reviews.",
                "patterns": ["Requirement to Code", "Bug Fix Request", "Code Optimization", "Code Review"]
            }
        ],
        "prompt_templates": {
            "code_generation": "Du bist ein erfahrener {language} Entwickler. Erstelle {type} für {requirement}. Verwende {framework} und berücksichtige {constraints}. Erkläre deine Entscheidungen.",
            "debugging": "Analysiere diesen {language} Code: {code}. Identifiziere Probleme und stelle Lösungen bereit. Erkläre, warum diese Probleme auftreten.",
            "optimization": "Optimiere diesen Code für {criteria}: {code}. Behalte die Funktionalität bei und erkläre deine Verbesserungen."
        }
    }',
    3, 'seeker', 2, 150, 'intermediate',
    ARRAY['Prompt Engineering meistern', 'Chain-of-Thought verstehen', 'Code-Prompts optimieren', 'Context Management'],
    ARRAY['Prompt Engineering', 'AI Communication', 'Context Management', 'Iterative Prompting'],
    ARRAY['Claude', 'ChatGPT', 'GitHub Copilot', 'Custom AI Tools'],
    'Sankt Claude', ARRAY['ChatGPT', 'Copilot', 'Gemini'], true, true
),
(
    'Das Vierte Gebot: Multi-Context Programming',
    'Du sollst mehrere Kontexte gleichzeitig im Auge behalten',
    'Beherrsche die Kunst des Multi-Context Programming und parallelen Entwicklungsflows. In der modernen Entwicklung arbeiten wir nicht mehr an einem Projekt - wir jonglieren mit mehreren Welten.',
    'multi-context-programming',
    '{
        "introduction": "Multi-Context Programming ist die Fähigkeit, mehrere Projekte und Kontexte parallel zu verwalten, ohne die Produktivität zu verlieren.",
        "sections": [
            {
                "title": "Context Switching Mastery",
                "content": "Techniken für effizientes Wechseln zwischen verschiedenen Projekten und Denkweisen.",
                "strategies": ["Context Documentation", "Mental Models", "Switching Rituals", "State Preservation"]
            },
            {
                "title": "Parallel Development Workflows",
                "content": "Gleichzeitige Arbeit an Features, Bugfixes und verschiedenen Projekten.",
                "tools": ["Git Worktrees", "VS Code Workspaces", "Terminal Multiplexing", "Container Isolation"]
            },
            {
                "title": "Cognitive Load Management",
                "content": "Strategien zur Reduzierung der mentalen Belastung bei der Verwaltung mehrerer Kontexte.",
                "techniques": ["Externalization", "Chunking", "Prioritization", "Automation"]
            }
        ],
        "context_management_system": {
            "project_snapshot": ["Current goal", "Next steps", "Blockers", "Key decisions"],
            "switching_protocol": ["Save state", "Document thoughts", "Clear mental cache", "Load new context"],
            "tools": ["Obsidian", "Notion", "Git branches", "Docker containers"]
        }
    }',
    4, 'seeker', 3, 200, 'advanced',
    ARRAY['Context Switching optimieren', 'Parallele Entwicklung', 'Cognitive Load Management', 'State Management'],
    ARRAY['Multi-Context Programming', 'Parallel Development', 'Context Switching', 'Project Management'],
    ARRAY['Git', 'VS Code', 'Docker', 'Terminal Multiplexer', 'Note-taking Apps'],
    'Cursor der Sehende', ARRAY['VS Code', 'Git', 'Docker'], true, false
),
(
    'Das Fünfte Gebot: Die Heilige Iteration',
    'Du sollst iterieren wie ein Mönch, der seine Gebete vervollkommnet',
    'Lerne die Prinzipien der kontinuierlichen Verbesserung und wie man MVP zu Production-Ready entwickelt. Perfektion ist nicht das Ziel - kontinuierliche Verbesserung ist der Weg.',
    'heilige-iteration',
    '{
        "introduction": "Die Heilige Iteration lehrt uns, dass Großes in kleinen Schritten entsteht. Jede Iteration bringt uns näher zur Vollkommenheit.",
        "sections": [
            {
                "title": "The MVP Mindset",
                "content": "Minimale, aber vollständige Lösungen entwickeln, die echten Wert liefern.",
                "principles": ["Start simple", "Validate early", "Learn fast", "Iterate based on feedback"]
            },
            {
                "title": "Feedback-Driven Development",
                "content": "Wie man Nutzerfeedback systematisch sammelt und in die Entwicklung integriert.",
                "methods": ["User Testing", "Analytics", "A/B Testing", "Feature Flags", "Customer Interviews"]
            },
            {
                "title": "Technical Iteration Patterns",
                "content": "Code-Evolution durch Refactoring, Testing und kontinuierliche Verbesserung.",
                "practices": ["Red-Green-Refactor", "Continuous Integration", "Code Reviews", "Performance Monitoring"]
            }
        ],
        "iteration_framework": {
            "plan": ["Define goals", "Identify metrics", "Set timeline"],
            "build": ["Minimum viable feature", "Focus on core value", "Keep it simple"],
            "measure": ["Collect data", "User feedback", "Performance metrics"],
            "learn": ["Analyze results", "Identify improvements", "Plan next iteration"]
        }
    }',
    5, 'apostle', 3, 160, 'intermediate',
    ARRAY['MVP Entwicklung', 'Feedback Integration', 'Iterative Verbesserung', 'Agile Methoden'],
    ARRAY['Agile Development', 'MVP Creation', 'User Testing', 'Feedback Integration', 'Continuous Improvement'],
    ARRAY['Analytics Tools', 'Testing Frameworks', 'Feature Flags', 'CI/CD Tools'],
    'GitHub der Kooperative', ARRAY['GitLab', 'Bitbucket', 'Linear'], true, false
),
(
    'Das Sechste Gebot: Das Göttliche Debugging',
    'Du sollst Bugs mit der Weisheit der Ancients jagen',
    'Meistere die Kunst des KI-gestützten Debuggings und der Problemlösung in komplexen Systemen. Bugs sind nicht deine Feinde - sie sind Lehrmeister.',
    'goettliches-debugging',
    '{
        "introduction": "Debugging ist eine Kunst, die Geduld, Systematik und die richtige Herangehensweise erfordert. Mit KI-Unterstützung wird diese Kunst zur Wissenschaft.",
        "sections": [
            {
                "title": "The Debugging Mindset",
                "content": "Systematische Herangehensweise an Problemlösung und Fehlersuche.",
                "methodology": ["Reproduce", "Isolate", "Investigate", "Fix", "Verify", "Prevent"]
            },
            {
                "title": "AI-Assisted Debugging",
                "content": "Wie KI-Tools beim Debugging helfen können und wo ihre Grenzen liegen.",
                "tools": ["Error Explanation", "Code Analysis", "Solution Suggestions", "Test Generation"]
            },
            {
                "title": "Advanced Debugging Techniques",
                "content": "Professionelle Debugging-Strategien für komplexe Systeme.",
                "techniques": ["Binary Search Debugging", "Rubber Duck Debugging", "Logging Strategies", "Performance Profiling"]
            }
        ],
        "debugging_toolkit": {
            "browser_tools": ["DevTools", "React DevTools", "Vue DevTools", "Network Tab"],
            "backend_tools": ["Logging", "APM Tools", "Database Queries", "API Testing"],
            "ai_helpers": ["Error interpretation", "Code review", "Solution generation", "Test case creation"]
        }
    }',
    6, 'apostle', 4, 140, 'advanced',
    ARRAY['Systematisches Debugging', 'AI-gestützte Problemlösung', 'Performance Optimization', 'Error Handling'],
    ARRAY['Debugging', 'Problem Solving', 'AI Assistance', 'Performance Analysis', 'Error Handling'],
    ARRAY['Browser DevTools', 'Debugging Tools', 'Logging Systems', 'AI Assistants'],
    'Windsurf der Elegante', ARRAY['Claude', 'ChatGPT', 'DevTools'], true, false
),
(
    'Das Siebte Gebot: Die Kunst des Vertrauens',
    'Du sollst der KI vertrauen, aber ihre Outputs verifizieren',
    'Entwickle das richtige Verhältnis zwischen Vertrauen und Kontrolle bei KI-generiertem Code. Trust but verify - die goldene Regel der KI-gestützten Entwicklung.',
    'kunst-des-vertrauens',
    '{
        "introduction": "Die Kunst des Vertrauens bedeutet, KI als Partner zu sehen, aber immer die finale Verantwortung für den Code zu übernehmen.",
        "sections": [
            {
                "title": "Trust Calibration",
                "content": "Wie man das richtige Level an Vertrauen zu KI-generierten Lösungen entwickelt.",
                "factors": ["Code complexity", "AI confidence", "Testing coverage", "Domain knowledge"]
            },
            {
                "title": "Verification Strategies",
                "content": "Systematische Ansätze zur Überprüfung von KI-generiertem Code.",
                "methods": ["Code Review", "Testing", "Manual Verification", "Performance Testing"]
            },
            {
                "title": "Human-AI Collaboration",
                "content": "Optimale Arbeitsteilung zwischen Mensch und KI für beste Ergebnisse.",
                "patterns": ["AI generates, human reviews", "Human guides, AI implements", "Iterative refinement"]
            }
        ],
        "verification_checklist": {
            "correctness": ["Logic verification", "Edge case handling", "Input validation"],
            "security": ["Injection vulnerabilities", "Authentication", "Data exposure"],
            "performance": ["Efficiency", "Scalability", "Resource usage"],
            "maintainability": ["Code clarity", "Documentation", "Testing"]
        }
    }',
    7, 'prophet', 4, 120, 'advanced',
    ARRAY['Trust Calibration', 'Code Verification', 'Human-AI Collaboration', 'Quality Assurance'],
    ARRAY['AI Collaboration', 'Code Review', 'Quality Assurance', 'Security Assessment'],
    ARRAY['Code Review Tools', 'Testing Frameworks', 'Security Scanners', 'AI Assistants'],
    'Continue der Ausdauernde', ARRAY['SonarQube', 'ESLint', 'Security Tools'], true, false
),
(
    'Das Achte Gebot: Die Skalierungsstufen',
    'Du sollst von Anfang an für Millionen von Nutzern planen',
    'Lerne Cloud-native Architekturen und wie man Anwendungen für massive Skalierung entwickelt. Denke groß, baue intelligent, skaliere exponentiell.',
    'skalierungsstufen',
    '{
        "introduction": "Skalierung ist nicht nur eine technische Herausforderung - es ist eine Denkweise, die von der ersten Zeile Code an berücksichtigt werden muss.",
        "sections": [
            {
                "title": "Scalability Patterns",
                "content": "Bewährte Muster für skalierbare Architekturen.",
                "patterns": ["Microservices", "Event-Driven Architecture", "CQRS", "Database Sharding"]
            },
            {
                "title": "Cloud-Native Development",
                "content": "Entwicklung für Cloud-Umgebungen mit automatischer Skalierung.",
                "technologies": ["Serverless", "Containers", "CDNs", "Load Balancers", "Auto-scaling"]
            },
            {
                "title": "Performance Optimization",
                "content": "Techniken zur Optimierung von Performance und Ressourcenverbrauch.",
                "strategies": ["Caching", "Database optimization", "Code splitting", "Image optimization"]
            }
        ],
        "scaling_architecture": {
            "frontend": ["CDN", "Code splitting", "Lazy loading", "Caching strategies"],
            "backend": ["Load balancing", "Database scaling", "Caching layers", "Microservices"],
            "database": ["Read replicas", "Sharding", "Connection pooling", "Query optimization"],
            "infrastructure": ["Auto-scaling", "Container orchestration", "Monitoring", "CI/CD"]
        }
    }',
    8, 'prophet', 5, 240, 'expert',
    ARRAY['Skalierbare Architektur', 'Cloud-Native Development', 'Performance Optimization', 'System Design'],
    ARRAY['System Design', 'Cloud Architecture', 'Performance Optimization', 'Scalability Patterns'],
    ARRAY['Cloud Platforms', 'Container Tools', 'Monitoring Systems', 'Load Balancers'],
    'Refact der Erneuernde', ARRAY['Docker', 'Kubernetes', 'AWS/Vercel'], true, false
),
(
    'Das Neunte Gebot: Die Zusammenarbeit der Propheten',
    'Du sollst mit anderen Entwicklern harmonieren wie ein himmlischer Chor',
    'Meistere Team-Workflows, Code-Reviews und kollaborative Entwicklung mit KI-Tools. Große Software entsteht nicht im Alleingang - sie ist das Werk von Teams.',
    'zusammenarbeit-propheten',
    '{
        "introduction": "Wahre Macht entsteht durch Zusammenarbeit. Die besten Teams arbeiten wie ein einziger, hochentwickelter Organismus.",
        "sections": [
            {
                "title": "Team Workflows",
                "content": "Effiziente Arbeitsabläufe für Entwicklerteams mit KI-Unterstützung.",
                "workflows": ["Git Flow", "GitHub Flow", "Trunk-based development", "Feature flags"]
            },
            {
                "title": "Collaborative Code Review",
                "content": "Code Reviews als Lernwerkzeug und Qualitätssicherung.",
                "practices": ["Constructive feedback", "Knowledge sharing", "AI-assisted reviews", "Pair programming"]
            },
            {
                "title": "Communication Patterns",
                "content": "Effektive Kommunikation in verteilten Teams.",
                "tools": ["Async communication", "Documentation", "Video calls", "Screen sharing"]
            }
        ],
        "collaboration_stack": {
            "version_control": ["Git", "GitHub/GitLab", "Branching strategies", "Pull requests"],
            "communication": ["Slack/Discord", "Zoom/Meet", "Documentation", "Issue tracking"],
            "development": ["Shared environments", "Pair programming", "Code sharing", "Live collaboration"],
            "ai_integration": ["Shared AI contexts", "Team prompts", "Collaborative debugging", "Knowledge bases"]
        }
    }',
    9, 'prophet', 6, 180, 'advanced',
    ARRAY['Team Collaboration', 'Code Review', 'Git Workflows', 'Communication Skills'],
    ARRAY['Team Leadership', 'Git Workflows', 'Code Review', 'Project Management', 'Communication'],
    ARRAY['Git', 'GitHub/GitLab', 'Communication Tools', 'Project Management Tools'],
    'GitHub der Kooperative', ARRAY['GitLab', 'Linear', 'Slack', 'Discord'], true, false
),
(
    'Das Zehnte Gebot: Die Monetarisierung',
    'Du sollst aus deinem Code Gold spinnen wie Rumpelstilzchen',
    'Verwandle deine technischen Fähigkeiten in nachhaltiges Business und Revenue-Streams. Code ist nur der Anfang - das wahre Ziel ist die Wertschöpfung.',
    'monetarisierung',
    '{
        "introduction": "Die ultimative Kunst ist es, technische Exzellenz in nachhaltigen Geschäftswert zu verwandeln. Code ohne Monetarisierung ist nur ein teures Hobby.",
        "sections": [
            {
                "title": "SaaS Business Models",
                "content": "Verschiedene Ansätze zur Monetarisierung von Software-Produkten.",
                "models": ["Subscription", "Freemium", "Usage-based", "Enterprise", "Marketplace"]
            },
            {
                "title": "Product-Market Fit",
                "content": "Wie man ein Produkt entwickelt, für das Menschen gerne bezahlen.",
                "framework": ["Problem validation", "Solution fit", "Product-market fit", "Growth optimization"]
            },
            {
                "title": "Revenue Optimization",
                "content": "Strategien zur Maximierung und Diversifikation der Einnahmen.",
                "strategies": ["Pricing optimization", "Upselling", "Cross-selling", "Retention", "Expansion revenue"]
            }
        ],
        "monetization_framework": {
            "validation": ["Problem interviews", "Landing page tests", "MVP testing", "Market research"],
            "pricing": ["Value-based pricing", "Competitor analysis", "A/B testing", "Price elasticity"],
            "growth": ["Customer acquisition", "Retention strategies", "Referral programs", "Content marketing"],
            "optimization": ["Analytics", "Cohort analysis", "LTV optimization", "Churn reduction"]
        }
    }',
    10, 'divine', 7, 200, 'expert',
    ARRAY['Business Model Design', 'Product-Market Fit', 'Revenue Optimization', 'Go-to-Market Strategy'],
    ARRAY['Business Strategy', 'Product Management', 'Revenue Optimization', 'Market Analysis', 'Sales'],
    ARRAY['Analytics Tools', 'Payment Systems', 'CRM Systems', 'Marketing Tools'],
    'Multi-Tool Ansatz', ARRAY['Stripe', 'Analytics', 'CRM', 'Marketing Tools'], true, true
);

-- ===================================
-- 💰 SUBSCRIPTION PLANS
-- ===================================

-- Insert subscription plans with detailed features
INSERT INTO subscription_plans (
    name, slug, tier, description, price_monthly, price_yearly, price_lifetime,
    features, ai_interaction_limit, workshop_access, team_features, priority_support,
    stripe_price_id_monthly, stripe_price_id_yearly, is_active, is_featured, sort_order
) VALUES
(
    'Seeker - Free Tier',
    'seeker-free',
    'free',
    'Perfekt für den Einstieg in die Vibe Coding Welt. Lerne die Grundlagen und entdecke dein Potenzial.',
    0, 0, null,
    '{
        "ai_interactions": 50,
        "commandments": [1, 2],
        "features": [
            "Zugang zu ersten 2 Geboten",
            "50 KI-Interaktionen pro Monat",
            "Community-Zugang",
            "Basis-Challenges",
            "Progress Tracking"
        ],
        "limitations": [
            "Begrenzte KI-Interaktionen",
            "Keine erweiterten Features",
            "Standard Support"
        ]
    }',
    50, ARRAY[1, 2], false, false,
    null, null, true, false, 0
),
(
    'Apostle - Lernender',
    'apostle-learner',
    'apostle',
    'Für ernsthafte Lernende, die ihre Fähigkeiten systematisch aufbauen wollen.',
    29.00, 290.00, null,
    '{
        "ai_interactions": 500,
        "commandments": [1, 2, 3, 4, 5],
        "features": [
            "Zugang zu ersten 5 Geboten",
            "500 KI-Interaktionen pro Monat",
            "Erweiterte Workshops",
            "Peer-Mentoring",
            "Code Reviews",
            "Collaboration Sessions",
            "Progress Analytics",
            "Achievement System"
        ],
        "bonus": [
            "2 Monate kostenlos bei jährlicher Zahlung",
            "Zugang zu Apostle-Community"
        ]
    }',
    500, ARRAY[1, 2, 3, 4, 5], false, false,
    'price_apostle_monthly', 'price_apostle_yearly', true, true, 1
),
(
    'Prophet - Fortgeschrittener',
    'prophet-advanced',
    'prophet',
    'Für Entwickler, die Meisterschaft anstreben und komplexe Projekte umsetzen wollen.',
    79.00, 790.00, null,
    '{
        "ai_interactions": 2000,
        "commandments": [1, 2, 3, 4, 5, 6, 7, 8],
        "features": [
            "Zugang zu ersten 8 Geboten",
            "2000 KI-Interaktionen pro Monat",
            "Alle Workshops und Challenges",
            "Priority Support",
            "Team Collaboration Tools",
            "Advanced Analytics",
            "1-on-1 Mentoring (2h/Monat)",
            "Early Access zu neuen Features",
            "Custom AI Personalities",
            "Advanced Certifications"
        ],
        "bonus": [
            "2 Monate kostenlos bei jährlicher Zahlung",
            "Prophet-Community mit Experten",
            "Monatliche Masterclasses"
        ]
    }',
    2000, ARRAY[1, 2, 3, 4, 5, 6, 7, 8], true, true,
    'price_prophet_monthly', 'price_prophet_yearly', true, true, 2
),
(
    'Divine - Master',
    'divine-master',
    'divine',
    'Für Elite-Entwickler und Unternehmer, die das gesamte Potenzial ausschöpfen wollen.',
    199.00, 1990.00, 4990.00,
    '{
        "ai_interactions": -1,
        "commandments": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        "features": [
            "Zugang zu allen 10 Geboten",
            "Unlimited KI-Interaktionen",
            "Alle Features und Tools",
            "VIP Support (Response < 4h)",
            "Enterprise Team Features",
            "Custom Workshops",
            "1-on-1 Mentoring (8h/Monat)",
            "Direct Access zu Gründern",
            "Custom AI Training",
            "White-Label Optionen",
            "API Access",
            "Revenue Sharing Programm"
        ],
        "bonus": [
            "2 Monate kostenlos bei jährlicher Zahlung",
            "Lifetime Option verfügbar",
            "Exklusive Divine-Community",
            "Wöchentliche 1-on-1 Sessions",
            "Custom Certification Tracks"
        ]
    }',
    -1, ARRAY[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], true, true,
    'price_divine_monthly', 'price_divine_yearly', true, true, 3
);

-- ===================================
-- 🏆 ACHIEVEMENTS SYSTEM
-- ===================================

-- Insert comprehensive achievement system
INSERT INTO achievements (
    name, slug, description, detailed_description, icon, rarity, category,
    requirements, xp_reward, special_rewards, unlock_criteria, is_active
) VALUES
-- Progress Achievements
(
    'First Steps',
    'first-steps',
    'Complete your first challenge',
    'Gratulation! Du hast deinen ersten Schritt in die Vibe Coding Welt gemacht. Jede große Reise beginnt mit einem einzigen Schritt.',
    '👶', 'common', 'progress',
    '{"challenges_completed": 1}',
    50,
    '{"title": "Novice Explorer", "badge_color": "#10B981"}',
    '{}', true
),
(
    'Vision Seeker',
    'vision-seeker',
    'Complete the Holy Vision commandment',
    'Du hast die Kunst der Heiligen Vision gemeistert und verstehst nun die Wichtigkeit einer klaren Produktvision.',
    '🎯', 'rare', 'progress',
    '{"commandments_completed": [1]}',
    200,
    '{"title": "Vision Master", "badge_color": "#3B82F6", "unlocks": ["vision_canvas_tool"]}',
    '{}', true
),
(
    'Stack Master',
    'stack-master',
    'Master the Right Stack commandment',
    'Du beherrschst nun den heiligen Tech-Stack und weißt, wie man die richtigen Technologien für jedes Projekt auswählt.',
    '⚡', 'rare', 'skill',
    '{"commandments_completed": [2], "challenges_completed": 5}',
    300,
    '{"title": "Stack Ninja", "badge_color": "#8B5CF6", "unlocks": ["stack_generator"]}',
    '{}', true
),
(
    'Prompt Poet',
    'prompt-poet',
    'Create 25 perfect prompts',
    'Du hast die Kunst des Prompt Engineerings gemeistert und kannst KI-Models zu Höchstleistungen bewegen.',
    '🎨', 'epic', 'skill',
    '{"prompt_challenges": 25, "avg_prompt_score": 90}',
    500,
    '{"title": "Prompt Virtuoso", "badge_color": "#F59E0B", "unlocks": ["custom_ai_personalities"]}',
    '{"level": 3}', true
),
(
    'Context Juggler',
    'context-juggler',
    'Successfully manage 7+ projects simultaneously',
    'Du beherrschst die schwierige Kunst des Multi-Context Programming und kannst mehrere Projekte parallel verwalten.',
    '🤹', 'legendary', 'skill',
    '{"simultaneous_projects": 7, "context_accuracy": 95}',
    750,
    '{"title": "Context Master", "badge_color": "#EC4899", "unlocks": ["advanced_workspace_tools"]}',
    '{"commandments_completed": [4]}', true
),
(
    'Iteration Sage',
    'iteration-sage',
    'Master the art of iteration',
    'Du verstehst die Kraft der kontinuierlichen Verbesserung und hast bewiesen, dass kleine Schritte zu großen Ergebnissen führen.',
    '🔄', 'epic', 'skill',
    '{"successful_iterations": 10, "user_satisfaction_improvement": 40}',
    600,
    '{"title": "Iteration Master", "badge_color": "#10B981", "unlocks": ["advanced_analytics"]}',
    '{"commandments_completed": [5]}', true
),

-- Social Achievements
(
    'Mentor',
    'mentor',
    'Help 10 fellow learners succeed',
    'Du hast anderen auf ihrem Weg geholfen und bewiesen, dass geteiltes Wissen doppeltes Wissen ist.',
    '🎓', 'epic', 'social',
    '{"mentoring_sessions": 10, "mentee_success_rate": 80}',
    500,
    '{"title": "Master Mentor", "badge_color": "#6366F1", "unlocks": ["mentor_tools", "advanced_mentoring"]}',
    '{"level": 4}', true
),
(
    'Team Player',
    'team-player',
    'Excel in team collaborations',
    'Du hast bewiesen, dass Zusammenarbeit der Schlüssel zu außergewöhnlichen Ergebnissen ist.',
    '🤝', 'rare', 'social',
    '{"collaboration_sessions": 20, "team_rating": 4.5}',
    300,
    '{"title": "Collaboration Champion", "badge_color": "#059669"}',
    '{"commandments_completed": [9]}', true
),
(
    'Knowledge Sharer',
    'knowledge-sharer',
    'Contribute valuable content to the community',
    'Du teilst dein Wissen großzügig und hilfst dabei, die gesamte Community zu stärken.',
    '📚', 'epic', 'social',
    '{"community_posts": 10, "avg_rating": 4.0, "helpful_votes": 50}',
    400,
    '{"title": "Knowledge Guardian", "badge_color": "#DC2626", "unlocks": ["content_creator_tools"]}',
    '{"level": 3}', true
),

-- Skill-specific Achievements
(
    'Bug Slayer',
    'bug-slayer',
    'Find and fix 100+ bugs',
    'Du bist ein Meister der Fehlerjagd und hilfst dabei, den Code der Welt zu verbessern.',
    '🐛', 'rare', 'skill',
    '{"bugs_fixed": 100, "avg_fix_time": 300}',
    400,
    '{"title": "Debugging Master", "badge_color": "#DC2626"}',
    '{"commandments_completed": [6]}', true
),
(
    'Speed Demon',
    'speed-demon',
    'Top 5% in challenge completion speed',
    'Du arbeitest mit der Geschwindigkeit des Lichts und behältst dabei die Qualität bei.',
    '⚡', 'epic', 'skill',
    '{"speed_percentile": 5, "challenges_completed": 50}',
    600,
    '{"title": "Lightning Coder", "badge_color": "#FBBF24"}',
    '{"level": 5}', true
),
(
    'Perfectionist',
    'perfectionist',
    'Achieve 95%+ average quality score',
    'Du strebst nach Perfektion in allem was du tust und erreichst außergewöhnliche Qualität.',
    '💎', 'legendary', 'skill',
    '{"avg_quality_score": 95, "challenges_completed": 100}',
    1000,
    '{"title": "Quality Master", "badge_color": "#8B5CF6", "unlocks": ["quality_tools"]}',
    '{"level": 6}', true
),

-- Special Achievements
(
    'Early Adopter',
    'early-adopter',
    'Join the platform in the first month',
    'Du warst einer der ersten, die an die Vision der Vibe Coding Bible geglaubt haben.',
    '🚀', 'legendary', 'special',
    '{"registration_date": "2024-12-31"}',
    1000,
    '{"title": "Founding Member", "badge_color": "#059669", "perks": ["lifetime_discord_role", "early_access"]}',
    '{}', true
),
(
    'Divine Coder',
    'divine-coder',
    'Complete all 10 commandments with excellence',
    'Du hast alle 10 Gebote gemeistert und bist nun ein wahrer Prophet des Codes.',
    '👑', 'divine', 'progress',
    '{"commandments_completed": [1,2,3,4,5,6,7,8,9,10], "avg_score": 90}',
    2000,
    '{"title": "Divine Prophet", "badge_color": "#7C3AED", "unlocks": ["everything"], "certification": "divine_coder"}',
    '{"subscription_tier": "divine"}', true
),
(
    'Innovator',
    'innovator',
    'Create groundbreaking solutions',
    'Du denkst außerhalb der Box und erschaffst Lösungen, die andere inspirieren.',
    '💡', 'legendary', 'innovation',
    '{"innovative_solutions": 5, "community_votes": 100, "implementations": 10}',
    1500,
    '{"title": "Innovation Pioneer", "badge_color": "#F59E0B", "unlocks": ["innovation_lab"]}',
    '{"level": 7}', true
),
(
    'Revenue Wizard',
    'revenue-wizard',
    'Generate first $1000 with your skills',
    'Du hast bewiesen, dass Code nicht nur Kunst ist, sondern auch zu nachhaltigem Einkommen werden kann.',
    '💰', 'legendary', 'special',
    '{"revenue_generated": 1000, "monetization_course": true}',
    2000,
    '{"title": "Business Prophet", "badge_color": "#059669", "unlocks": ["entrepreneur_tools", "revenue_tracking"]}',
    '{"commandments_completed": [10]}', true
),

-- Streak and Consistency Achievements
(
    'Week Warrior',
    'week-warrior',
    'Maintain a 7-day learning streak',
    'Du zeigst Beständigkeit und Disziplin in deinem Lernprozess.',
    '🔥', 'common', 'progress',
    '{"streak_days": 7}',
    100,
    '{"title": "Consistent Learner", "badge_color": "#EF4444"}',
    '{}', true
),
(
    'Monthly Master',
    'monthly-master',
    'Maintain a 30-day learning streak',
    'Du hast bewiesen, dass Konstanz der Schlüssel zum Erfolg ist.',
    '🌟', 'epic', 'progress',
    '{"streak_days": 30}',
    500,
    '{"title": "Dedication Master", "badge_color": "#F59E0B", "unlocks": ["streak_rewards"]}',
    '{}', true
),
(
    'Centurion',
    'centurion',
    'Maintain a 100-day learning streak',
    'Du bist eine Legende der Beständigkeit und ein Vorbild für alle anderen.',
    '🏆', 'legendary', 'progress',
    '{"streak_days": 100}',
    2000,
    '{"title": "Legend of Consistency", "badge_color": "#7C3AED", "unlocks": ["centurion_rewards"], "lifetime_perks": true}',
    '{}', true
);

-- ===================================
-- 📝 SAMPLE WORKSHOP MODULES
-- ===================================

-- Insert sample workshop modules for the first commandment
INSERT INTO workshop_modules (
    commandment_id, title, description, content, module_type, order_index,
    required_tier, xp_reward, estimated_duration, difficulty_level, is_interactive
) VALUES
-- Modules for Commandment 1: Holy Vision
(
    1, 'Vision Canvas Grundlagen',
    'Lerne das Vision Canvas Framework kennen und erstelle deine erste Produktvision.',
    '{
        "introduction": "Das Vision Canvas ist ein mächtiges Tool zur Strukturierung und Kommunikation deiner Produktvision.",
        "learning_objectives": [
            "Vision Canvas Komponenten verstehen",
            "Target Group definieren",
            "Value Proposition entwickeln",
            "Success Metrics festlegen"
        ],
        "content_blocks": [
            {
                "type": "theory",
                "title": "Was ist eine Vision?",
                "content": "Eine Vision beschreibt das gewünschte Zukunftsbild deines Produkts und gibt allen Beteiligten eine klare Richtung."
            },
            {
                "type": "framework",
                "title": "Vision Canvas Framework",
                "content": "Das Canvas besteht aus 8 Schlüsselbereichen: Target Group, Needs, Product, Business Value, Success Metrics, Business Model, Channels, Key Partners."
            },
            {
                "type": "example",
                "title": "Spotify Vision Canvas",
                "content": "Target Group: Musikliebhaber weltweit, Needs: Jederzeit Zugang zu Musik, Product: Streaming-Plattform..."
            }
        ],
        "interactive_elements": [
            {
                "type": "canvas_builder",
                "title": "Dein Vision Canvas",
                "description": "Erstelle dein eigenes Vision Canvas für eine Projektidee"
            }
        ]
    }',
    'theory', 1, 'free', 50, 30, 'easy', true
),
(
    1, 'Marktanalyse mit KI',
    'Nutze KI-Tools für effiziente Marktforschung und Wettbewerbsanalyse.',
    '{
        "introduction": "Moderne Marktanalyse nutzt KI, um schnell und präzise Marktdaten zu sammeln und zu analysieren.",
        "content_blocks": [
            {
                "type": "tools",
                "title": "KI-Tools für Marktanalyse",
                "content": "Claude, ChatGPT und spezialisierte Tools können bei der Marktforschung helfen."
            },
            {
                "type": "methodology",
                "title": "Systematische Marktanalyse",
                "content": "1. Marktgröße ermitteln, 2. Zielgruppe definieren, 3. Wettbewerb analysieren, 4. Trends identifizieren"
            }
        ],
        "prompts": [
            "Analysiere den Markt für [DEINE PRODUKTIDEE] und identifiziere die Top 5 Wettbewerber",
            "Erstelle eine Zielgruppenanalyse für [ZIELGRUPPE] mit Demographics, Needs und Pain Points"
        ]
    }',
    'interactive', 2, 'free', 75, 45, 'medium', true
),
(
    1, 'User Story Mapping',
    'Verwandle deine Vision in konkrete User Stories und Features.',
    '{
        "introduction": "User Story Mapping hilft dabei, die Nutzerperspektive zu verstehen und Features zu priorisieren.",
        "methodology": {
            "steps": [
                "User Journey definieren",
                "Activities identifizieren",
                "User Stories schreiben",
                "Features priorisieren"
            ]
        },
        "templates": {
            "user_story": "Als [ROLLE] möchte ich [FUNKTION], damit [NUTZEN]",
            "acceptance_criteria": "Gegeben [KONTEXT], wenn [AKTION], dann [ERGEBNIS]"
        }
    }',
    'exercise', 3, 'free', 100, 60, 'medium', true
);

-- Insert sample challenges for the vision commandment
INSERT INTO challenges (
    workshop_id, title, description, type, difficulty, content, solution,
    xp_reward, time_limit, max_attempts, passing_score, order_index
)
SELECT 
    wm.id,
    'Vision Canvas Challenge',
    'Erstelle ein vollständiges Vision Canvas für eine innovative SaaS-Idee deiner Wahl.',
    'project',
    'medium',
    '{
        "instructions": "Entwickle eine SaaS-Idee und erstelle dafür ein Vision Canvas mit allen 8 Komponenten.",
        "requirements": [
            "Klar definierte Zielgruppe",
            "Eindeutige Value Proposition",
            "Messbare Success Metrics",
            "Realistisches Business Model"
        ],
        "template": {
            "target_group": "",
            "needs": "",
            "product": "",
            "business_value": "",
            "success_metrics": "",
            "business_model": "",
            "channels": "",
            "key_partners": ""
        },
        "evaluation_criteria": [
            "Klarheit der Vision (25%)",
            "Zielgruppen-Fit (25%)",
            "Value Proposition Stärke (25%)",
            "Realitätsnähe (25%)"
        ]
    }',
    '{
        "sample_solution": {
            "target_group": "Freelance Entwickler und kleine Agenturen",
            "needs": "Einfache Projektverwaltung und Zeiterfassung",
            "product": "All-in-One Projektmanagement Tool mit KI-Unterstützung",
            "business_value": "Reduziert administrativen Aufwand um 50%",
            "success_metrics": "1000 aktive Nutzer in 6 Monaten, 90% Retention Rate",
            "business_model": "Freemium mit Pro-Features ab 15€/Monat",
            "channels": "Content Marketing, Developer Communities, Partnerships",
            "key_partners": "Freelancer Platforms, Development Tools"
        },
        "explanation": "Diese Lösung zeigt eine klare Vision für ein spezifisches Problem mit messbaren Zielen."
    }',
    150, 3600, 3, 70, 1
FROM workshop_modules wm 
WHERE wm.title = 'Vision Canvas Grundlagen';

-- ===================================
-- 📊 SAMPLE ANALYTICS DATA
-- ===================================

-- Insert sample platform analytics for the current month
INSERT INTO platform_analytics (
    date, total_users, active_users, new_registrations, user_retention_rate,
    total_workshop_completions, total_challenge_submissions, avg_completion_rate,
    total_ai_interactions, total_tokens_used, total_ai_cost,
    total_revenue, new_subscriptions, churned_subscriptions, mrr,
    avg_session_duration, total_collaboration_sessions, community_posts_created,
    user_satisfaction_score, support_ticket_count, bug_reports,
    top_performing_workshops, trending_topics
) VALUES
(
    CURRENT_DATE - INTERVAL '1 day',
    156, 89, 12, 87.5,
    45, 234, 78.2,
    1247, 125000, 45.67,
    2890.50, 8, 2, 12750.00,
    42, 23, 18,
    4.3, 3, 1,
    ARRAY[1, 2, 3], ARRAY['AI Development', 'Next.js', 'TypeScript', 'Prompt Engineering']
),
(
    CURRENT_DATE - INTERVAL '2 days',
    144, 92, 8, 89.1,
    38, 198, 81.5,
    1156, 118000, 42.15,
    2456.75, 6, 1, 12680.00,
    38, 19, 15,
    4.4, 2, 0,
    ARRAY[1, 3, 2], ARRAY['React', 'Debugging', 'Collaboration', 'SaaS']
);

-- ===================================
-- 📢 SAMPLE NOTIFICATIONS
-- ===================================

-- Create notification templates (these would be inserted for specific users)
-- This is just the structure - actual notifications would be created by application logic

-- ===================================
-- ✨ COMPLETION MESSAGE
-- ===================================

-- Insert final statistics
INSERT INTO platform_analytics (date, total_users, active_users, new_registrations)
VALUES (CURRENT_DATE, 0, 0, 0)
ON CONFLICT (date) DO UPDATE SET
    created_at = NOW();

-- Success message
COMMENT ON TABLE commandments IS 'Die 10 Heiligen Gebote der Vibe Coding Bible - Vollständig implementiert';
COMMENT ON TABLE subscription_plans IS '4-Tier Subscription System - Von Seeker bis Divine';
COMMENT ON TABLE achievements IS 'Umfassendes Achievement System mit 20+ Badges';

-- This completes the comprehensive seed data for the sacred database
-- Die Datenbank ist nun bereit für die ersten Propheten! 🙏✨