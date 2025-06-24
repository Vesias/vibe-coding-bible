# Production Deployment Guide for Vibe Coding Bible

This guide provides comprehensive instructions for deploying the Vibe Coding Bible platform to production on Vercel with the domain `vibecodingbible.agentland.saarland`.

## 🚀 Quick Start

1. **Setup Environment Variables**
   ```bash
   ./scripts/setup-production-env.sh
   ```

2. **Validate Configuration**
   ```bash
   ./scripts/validate-production-env.sh
   ```

3. **Setup Stripe Webhooks**
   ```bash
   ./scripts/setup-stripe-webhooks.sh
   ```

4. **Deploy to Production**
   ```bash
   ./scripts/deploy-production.sh
   ```

## 📋 Prerequisites

- [Vercel CLI](https://vercel.com/cli) installed and authenticated
- [Stripe CLI](https://stripe.com/docs/stripe-cli) installed and authenticated
- [pnpm](https://pnpm.io/) package manager
- All API keys and credentials ready

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Production URL | `https://vibecodingbible.agentland.saarland` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `STRIPE_SECRET_KEY` | Stripe live secret key | `sk_live_51RX4tm...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe live publishable key | `pk_live_51RX4tm...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_xxxxx` |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | NextAuth.js URL | `https://vibecodingbible.agentland.saarland` |

### AI Provider Keys (Optional)

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | DeepSeek API key for AI features |
| `OPENAI_API_KEY` | OpenAI API key for AI features |
| `GOOGLE_AI_API_KEY` | Google AI API key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |

### Search Provider Keys (Optional)

| Variable | Description |
|----------|-------------|
| `BRAVE_SEARCH_API_KEY` | Brave Search API key |
| `SERPER_API_KEY` | Serper Google Search API key |

### Email Configuration (Optional)

| Variable | Description |
|----------|-------------|
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASSWORD` | SMTP password |
| `SMTP_FROM` | From email address |

## 🔗 Domain Configuration

### Vercel Domain Setup

1. **Add Domain to Vercel Project**
   ```bash
   vercel domains add vibecodingbible.agentland.saarland
   ```

2. **Configure DNS Records**
   Add the following DNS records to your domain provider:
   
   ```
   Type: CNAME
   Name: vibecodingbible
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - Certificate will be issued within minutes of DNS propagation
   - Supports automatic renewal

### Custom Domain Verification

1. Check DNS propagation:
   ```bash
   dig vibecodingbible.agentland.saarland
   ```

2. Verify SSL certificate:
   ```bash
   curl -I https://vibecodingbible.agentland.saarland
   ```

## 💳 Stripe Configuration

### Live Environment Setup

1. **Switch to Live Mode** in Stripe Dashboard
2. **Get Live API Keys** from Stripe Dashboard > Developers > API Keys
3. **Configure Products and Prices** (use the setup script):
   ```bash
   node scripts/setup-stripe-products.js
   ```

### Webhook Configuration

1. **Create Webhook Endpoint**
   ```bash
   ./scripts/setup-stripe-webhooks.sh
   ```

2. **Webhook Events to Listen For:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

3. **Webhook URL:**
   ```
   https://vibecodingbible.agentland.saarland/api/stripe/webhooks
   ```

## 🗄️ Database Setup

### Supabase Configuration

1. **Production Database**
   - Use your existing Supabase project: `https://hpguscbanxnzufjduiws.supabase.co`
   - Ensure all migrations are applied
   - Verify Row Level Security (RLS) policies

2. **Database Migrations**
   ```bash
   # Apply all migrations to production
   supabase db push --db-url "postgresql://[CONNECTION_STRING]"
   ```

3. **Backup Strategy**
   - Enable automated backups in Supabase Dashboard
   - Set backup retention period
   - Consider point-in-time recovery

## 🚀 Deployment Process

### Automated Deployment

```bash
# Complete deployment process
./scripts/validate-production-env.sh  # Validate configuration
./scripts/deploy-production.sh        # Deploy to production
```

### Manual Deployment

```bash
# 1. Install dependencies
pnpm install --frozen-lockfile

# 2. Run type checking
pnpm run type-check

# 3. Run linting
pnpm run lint

# 4. Test build
pnpm run build

# 5. Deploy to Vercel
vercel --prod
```

## 🔍 Post-Deployment Verification

### Health Checks

1. **Site Accessibility**
   ```bash
   curl -I https://vibecodingbible.agentland.saarland
   ```

2. **API Health**
   ```bash
   curl https://vibecodingbible.agentland.saarland/api/health
   ```

3. **Database Connection**
   ```bash
   curl https://vibecodingbible.agentland.saarland/api/test-db
   ```

### Critical Functionality Tests

1. **User Authentication**
   - Test signup/login flow
   - Verify email verification
   - Test password reset

2. **Payment Processing**
   - Test checkout flow
   - Verify webhook processing
   - Check subscription management

3. **AI Features**
   - Test AI mentor chat
   - Verify code review functionality
   - Check learning recommendations

## 🔧 Troubleshooting

### Common Issues

#### Deployment Fails
```bash
# Check Vercel logs
vercel logs

# Verify environment variables
vercel env ls

# Test local build
pnpm run build
```

#### Webhook Issues
```bash
# Check webhook endpoint
curl -X POST https://vibecodingbible.agentland.saarland/api/stripe/webhooks

# Verify webhook secret in Stripe Dashboard
# Test webhook with Stripe CLI
stripe trigger checkout.session.completed
```

#### Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: [ANON_KEY]" https://hpguscbanxnzufjduiws.supabase.co/rest/v1/

# Check RLS policies
# Verify service role key permissions
```

### Monitoring and Alerts

1. **Vercel Analytics**
   - Monitor performance metrics
   - Track Core Web Vitals
   - Set up uptime monitoring

2. **Stripe Dashboard**
   - Monitor payment success rates
   - Track failed payments
   - Review webhook delivery status

3. **Supabase Monitoring**
   - Monitor database performance
   - Track API usage
   - Set up alerts for errors

## 🔒 Security Considerations

### Environment Security
- Never commit API keys to version control
- Use Vercel's encrypted environment variables
- Rotate API keys regularly
- Monitor access logs

### Application Security
- Implement rate limiting
- Validate all user inputs
- Use HTTPS everywhere
- Enable security headers

### Data Protection
- Implement GDPR compliance
- Use data encryption at rest
- Regular security audits
- Backup verification

## 📊 Performance Optimization

### Vercel Configuration
- Use Edge Functions for geolocation
- Enable ISR for dynamic content
- Optimize image delivery
- Configure caching headers

### Database Optimization
- Implement connection pooling
- Use database indexes
- Monitor query performance
- Regular maintenance tasks

## 🚨 Emergency Procedures

### Rollback Process
```bash
# Rollback to previous deployment
vercel rollback [DEPLOYMENT_URL]

# Verify rollback
curl -I https://vibecodingbible.agentland.saarland
```

### Incident Response
1. Identify the issue
2. Check Vercel status page
3. Review recent deployments
4. Check external service status
5. Implement fix or rollback
6. Monitor recovery

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support

## 📝 Deployment Checklist

- [ ] All environment variables configured
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Stripe webhooks configured
- [ ] Database migrations applied
- [ ] Payment processing tested
- [ ] Authentication flow tested
- [ ] AI features verified
- [ ] Performance metrics baseline established
- [ ] Monitoring and alerts configured
- [ ] Backup strategy implemented
- [ ] Security audit completed

---

For additional support or questions, refer to the project documentation or contact the development team.