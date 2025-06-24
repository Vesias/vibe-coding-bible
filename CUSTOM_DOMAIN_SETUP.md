# Custom Domain Setup Guide
## vibecodingbible.agentland.saarland

### Current Status
✅ **Vercel Project**: `vibe-coding-bibel` is deployed and running  
✅ **Production URL**: https://vibe-coding-bibel-mw61gwf0r-bozz-aclearallbgs-projects.vercel.app  
✅ **Configuration**: Already optimized for custom domain usage  
⚠️ **Domain Assignment**: Requires manual intervention due to previous assignment conflicts

---

## 🔧 Manual Domain Setup Steps

### Step 1: Add Domain via Vercel Dashboard
Since CLI domain addition is blocked, use the web interface:

1. **Visit Vercel Dashboard**
   - Go to: https://vercel.com/bozz-aclearallbgs-projects/vibe-coding-bibel
   - Navigate to Settings → Domains

2. **Add Custom Domain**
   - Click "Add Domain"
   - Enter: `vibecodingbible.agentland.saarland`
   - Click "Add"

3. **If Domain Conflict Occurs**
   - Check for existing projects with this domain
   - Remove domain from old projects first
   - Then add to current project

### Step 2: DNS Configuration
Configure DNS settings for `agentland.saarland` domain:

#### DNS Records Required:
```dns
Type: CNAME
Name: vibecodingbible
Value: cname.vercel-dns.com
TTL: 300 (or default)
```

**Alternative Configuration (if CNAME doesn't work):**
```dns
Type: A
Name: vibecodingbible
Value: 76.76.19.61
TTL: 300

Type: AAAA  
Name: vibecodingbible
Value: 2600:1f14:436:8800:d0ba:e055:7dae:1fd2
TTL: 300
```

### Step 3: Verify Domain Configuration
After adding DNS records, verify:

1. **DNS Propagation Check**
   ```bash
   nslookup vibecodingbible.agentland.saarland
   dig vibecodingbible.agentland.saarland
   ```

2. **SSL Certificate**
   - Vercel automatically provisions SSL certificates
   - May take 5-10 minutes after DNS propagation
   - Check certificate status in Vercel dashboard

### Step 4: Test Domain Access
Once configured, test these URLs:
- https://vibecodingbible.agentland.saarland
- https://vibecodingbible.agentland.saarland/api/health
- https://vibecodingbible.agentland.saarland/dashboard

---

## 🔐 Environment Variables
Current configuration already includes custom domain:

```env
NEXT_PUBLIC_SITE_URL=https://vibecodingbible.agentland.saarland
NEXT_PUBLIC_SITE_NAME=VibeCoding Bible by Agentland
```

No changes needed to environment variables.

---

## 💳 Stripe Webhook Configuration
After domain is live, update Stripe webhooks:

### Automatic Setup
```bash
cd /home/jan/vibe-coding-bibel
./scripts/setup-stripe-webhooks.sh
```

### Manual Setup
1. **Stripe Dashboard**
   - Go to: https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://vibecodingbible.agentland.saarland/api/stripe/webhooks`

2. **Required Events**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.created`
   - `customer.updated`

3. **Update Environment Variable**
   ```bash
   vercel env add STRIPE_WEBHOOK_SECRET production
   # Enter the webhook secret from Stripe dashboard
   ```

---

## 🚀 Deployment Commands

### Deploy Latest Changes
```bash
vercel --prod
```

### Check Deployment Status
```bash
vercel inspect
```

### View Logs
```bash
vercel logs
```

---

## 🔍 Troubleshooting

### Domain Not Resolving
1. Check DNS propagation: https://dnschecker.org
2. Verify DNS records are correct
3. Wait 5-10 minutes for propagation

### SSL Certificate Issues
1. Check certificate status in Vercel dashboard
2. Force refresh: Remove and re-add domain
3. Wait for automatic renewal (24-48 hours)

### 404 Errors
1. Verify deployment is successful
2. Check vercel.json configuration
3. Review redirect rules

### API Endpoints Not Working
1. Check function timeout settings
2. Verify environment variables
3. Review API route implementations

---

## 📊 Performance Optimization
Current optimizations already in place:

✅ **Image Optimization**: Next.js Image component with AVIF/WebP  
✅ **Caching Headers**: Static assets cached for 1 year  
✅ **Compression**: Gzip/Brotli enabled  
✅ **CDN**: Vercel Edge Network  
✅ **Security Headers**: CSP, HSTS, XSS protection  

---

## ✅ Verification Checklist

### Before Going Live
- [ ] Domain resolves to Vercel
- [ ] SSL certificate is active
- [ ] All pages load correctly
- [ ] API endpoints respond
- [ ] Stripe webhooks configured
- [ ] Database connection works
- [ ] Authentication flows work

### After Going Live
- [ ] Monitor Vercel analytics
- [ ] Check error logs
- [ ] Test payment flows
- [ ] Verify SEO meta tags
- [ ] Test mobile responsiveness

---

## 🎯 Next Steps

1. **Manual Domain Addition**: Add domain via Vercel dashboard
2. **DNS Configuration**: Update DNS records with your provider
3. **Stripe Webhooks**: Run webhook setup script
4. **Testing**: Verify all functionality works
5. **Monitoring**: Set up alerts and monitoring

---

## 📞 Support

If issues persist:
1. Check Vercel documentation: https://vercel.com/docs/concepts/projects/domains
2. Contact Vercel support via dashboard
3. Review DNS provider documentation
4. Check domain registrar settings

---

**Status**: Ready for manual domain configuration
**Time Estimate**: 10-15 minutes for DNS propagation
**Prerequisites**: Access to DNS management for agentland.saarland