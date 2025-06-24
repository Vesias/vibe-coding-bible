# 🚨 EMERGENCY API KEY ROTATION GUIDE

**CRITICAL: Live production API keys have been exposed publicly. Execute this checklist IMMEDIATELY.**

## PRIORITY 1: STRIPE KEYS (FINANCIAL RISK)

### Exposed Key Pattern:
- `sk_live_51RX4tmRvUIOvArhD...` (Live Secret Key)

### IMMEDIATE ACTIONS:
1. **Log into Stripe Dashboard**: https://dashboard.stripe.com/
2. **Navigate to**: Developers → API keys
3. **Click "Reveal" on the exposed live secret key**
4. **Click "Roll key" button** - this immediately invalidates the old key
5. **Copy the new key** and update your production environment
6. **Test payment flow** to ensure continuity

### Critical: This key can authorize real payments and refunds!

---

## PRIORITY 2: AI PROVIDER KEYS (BILLING RISK)

### OpenAI Keys
1. **Login**: https://platform.openai.com/account/api-keys
2. **Find exposed key** in the list
3. **Click "Delete"** to revoke immediately
4. **Create new key** with same permissions
5. **Update environment variables**

### Anthropic Keys
1. **Login**: https://console.anthropic.com/settings/keys
2. **Locate exposed key**
3. **Click "Delete"** to revoke
4. **Generate new key**
5. **Update environment variables**

### DeepSeek Keys
1. **Login**: https://platform.deepseek.com/api_keys
2. **Find and delete** exposed key
3. **Create new key**
4. **Update environment variables**

### Google AI Keys
1. **Login**: https://makersuite.google.com/app/apikey
2. **Delete exposed key**
3. **Create new key**
4. **Update environment variables**

---

## PRIORITY 3: SEARCH PROVIDER KEYS

### Brave Search API
1. **Login**: https://api.search.brave.com/app/keys
2. **Revoke exposed key**
3. **Generate new key**

### Serper API
1. **Login**: https://serper.dev/api-key
2. **Delete exposed key**
3. **Create new key**

---

## IMMEDIATE ENVIRONMENT SECURITY

### 1. Secure Your Environment Files
```bash
# Remove any exposed .env files from git history
git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env*' --prune-empty --tag-name-filter cat -- --all

# Add .env* to .gitignore if not already there
echo -e "\n# Environment files\n.env*\n!.env.example" >> .gitignore
```

### 2. Update Environment Variables Securely
```bash
# Create new .env file with rotated keys
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
# Update with new keys - DO NOT COMMIT THIS FILE
```

### 3. Production Environment Update
- **Vercel**: Update environment variables in dashboard
- **Heroku**: Use `heroku config:set`
- **AWS**: Update in Systems Manager Parameter Store
- **Docker**: Update secrets in container orchestration

---

## VERIFICATION CHECKLIST

After rotation, verify each service:

- [ ] Stripe: Test payment processing
- [ ] OpenAI: Test API calls
- [ ] Anthropic: Test API calls  
- [ ] DeepSeek: Test API calls
- [ ] Google AI: Test API calls
- [ ] Brave Search: Test search functionality
- [ ] Serper: Test search functionality

---

## PREVENTION MEASURES

### 1. Environment Variable Management
```bash
# Use a secret management service
# Examples:
# - AWS Secrets Manager
# - HashiCorp Vault  
# - Azure Key Vault
# - 1Password CLI
```

### 2. Git Hooks
```bash
# Install git hooks to prevent accidental commits
npm install --save-dev @commitlint/cli @commitlint/config-conventional
# Add pre-commit hook to scan for secrets
```

### 3. API Key Monitoring
- Set up usage alerts in each provider dashboard
- Monitor for unusual API usage patterns
- Implement rate limiting in your applications

---

## INCIDENT TIMELINE

**Document for security audit:**
- **Exposure Time**: [When keys were first exposed]
- **Detection Time**: [When breach was discovered]  
- **Response Time**: [When rotation began]
- **Resolution Time**: [When all keys rotated and verified]

**Next Steps:**
1. Review access logs for unauthorized usage
2. Monitor billing for unexpected charges
3. Implement automated secret scanning
4. Conduct security training for development team

---

## EMERGENCY CONTACTS

- **Stripe Support**: https://support.stripe.com/
- **OpenAI Support**: https://help.openai.com/
- **Your Security Team**: [Add contact information]

**TIME IS CRITICAL - BEGIN ROTATION IMMEDIATELY**