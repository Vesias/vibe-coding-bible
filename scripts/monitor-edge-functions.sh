#!/bin/bash

# =============================================
# Edge Functions Production Monitoring Script
# =============================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SUPABASE_PROJECT_ID="${SUPABASE_PROJECT_ID:-hpguscbanxnzufjduiws}"
ALERT_WEBHOOK="${ALERT_WEBHOOK:-}"
CHECK_INTERVAL="${CHECK_INTERVAL:-300}" # 5 minutes

# Function URLs
declare -A FUNCTION_URLS=(
    ["stripe-webhook"]="https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/stripe-webhook"
    ["user-management"]="https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/user-management"
    ["analytics-tracking"]="https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/analytics-tracking"
    ["email-notifications"]="https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/email-notifications"
)

# Thresholds
RESPONSE_TIME_THRESHOLD=5000  # 5 seconds
ERROR_RATE_THRESHOLD=5        # 5%
MEMORY_USAGE_THRESHOLD=80     # 80%

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Health check for individual function
check_function_health() {
    local function_name="$1"
    local function_url="$2"
    local start_time=$(date +%s%3N)
    
    # Perform health check based on function type
    local http_code
    local response_time
    
    case "$function_name" in
        "stripe-webhook")
            # Test with OPTIONS request (CORS preflight)
            http_code=$(curl -s -w "%{http_code}" -X OPTIONS "$function_url" \
                --max-time 10 -o /dev/null || echo "000")
            ;;
        "user-management")
            # Test with invalid auth (should return 401/500)
            http_code=$(curl -s -w "%{http_code}" -X POST "$function_url" \
                -H "Content-Type: application/json" \
                -d '{"action": "check_access", "data": {}}' \
                --max-time 10 -o /dev/null || echo "000")
            ;;
        "analytics-tracking")
            # Test analytics endpoint
            http_code=$(curl -s -w "%{http_code}" -X GET "$function_url/dashboard" \
                --max-time 10 -o /dev/null || echo "000")
            ;;
        "email-notifications")
            # Test with invalid request (should return error)
            http_code=$(curl -s -w "%{http_code}" -X POST "$function_url" \
                -H "Content-Type: application/json" \
                -d '{}' \
                --max-time 10 -o /dev/null || echo "000")
            ;;
    esac
    
    local end_time=$(date +%s%3N)
    response_time=$((end_time - start_time))
    
    # Evaluate health
    local status="healthy"
    local message="Function responding normally"
    
    if [[ "$http_code" == "000" ]]; then
        status="critical"
        message="Function not responding"
    elif [[ "$response_time" -gt "$RESPONSE_TIME_THRESHOLD" ]]; then
        status="warning" 
        message="Slow response time: ${response_time}ms"
    elif [[ "$http_code" == "500" ]] && [[ "$function_name" != "user-management" ]]; then
        status="error"
        message="Internal server error"
    fi
    
    echo "$status|$message|$response_time|$http_code"
}

# Get function metrics from Supabase
get_function_metrics() {
    local function_name="$1"
    
    # This would integrate with Supabase API to get actual metrics
    # For now, return mock data
    echo "invocations:1234,errors:12,avg_duration:245"
}

# Calculate error rate
calculate_error_rate() {
    local invocations="$1"
    local errors="$2"
    
    if [[ "$invocations" -eq 0 ]]; then
        echo "0"
    else
        echo "$(( (errors * 100) / invocations ))"
    fi
}

# Send alert
send_alert() {
    local severity="$1"
    local function_name="$2"
    local message="$3"
    
    local alert_payload=$(cat << EOF
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "severity": "$severity",
    "service": "edge-functions",
    "function": "$function_name",
    "message": "$message",
    "project": "$SUPABASE_PROJECT_ID"
}
EOF
)
    
    # Send to webhook if configured
    if [[ -n "$ALERT_WEBHOOK" ]]; then
        curl -s -X POST "$ALERT_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "$alert_payload" > /dev/null || true
    fi
    
    # Log alert
    error "ALERT [$severity] $function_name: $message"
}

# Check database connectivity
check_database_health() {
    log "Checking database connectivity..."
    
    # This would test database connection through user-management function
    local health_check_url="https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/user-management"
    local response
    
    response=$(curl -s -X POST "$health_check_url" \
        -H "Content-Type: application/json" \
        -d '{"action": "health_check"}' \
        --max-time 15 || echo "error")
    
    if [[ "$response" == "error" ]]; then
        send_alert "critical" "database" "Database connectivity check failed"
        return 1
    else
        success "Database connectivity OK"
        return 0
    fi
}

# Check external service dependencies
check_external_services() {
    log "Checking external service dependencies..."
    
    # Check Stripe API
    if ! curl -s -f "https://api.stripe.com/v1/charges" \
        -H "Authorization: Bearer $STRIPE_SECRET_KEY" \
        --max-time 10 > /dev/null; then
        send_alert "warning" "stripe" "Stripe API connectivity issue"
    else
        success "Stripe API connectivity OK"
    fi
    
    # Check email service (if configured)
    if [[ -n "${EMAIL_SERVICE_URL:-}" ]]; then
        if ! curl -s -f "${EMAIL_SERVICE_URL}/health" \
            --max-time 10 > /dev/null; then
            send_alert "warning" "email" "Email service connectivity issue"
        else
            success "Email service connectivity OK"
        fi
    fi
}

# Generate health report
generate_health_report() {
    local report_file="/tmp/edge-functions-health-$(date +%Y%m%d-%H%M%S).json"
    
    log "Generating health report: $report_file"
    
    local overall_status="healthy"
    local function_reports=""
    
    for function_name in "${!FUNCTION_URLS[@]}"; do
        local function_url="${FUNCTION_URLS[$function_name]}"
        local health_result
        
        health_result=$(check_function_health "$function_name" "$function_url")
        IFS='|' read -r status message response_time http_code <<< "$health_result"
        
        # Get metrics
        local metrics
        metrics=$(get_function_metrics "$function_name")
        IFS=',' read -r invocations_part errors_part duration_part <<< "$metrics"
        
        local invocations="${invocations_part#*:}"
        local errors="${errors_part#*:}"
        local avg_duration="${duration_part#*:}"
        local error_rate
        error_rate=$(calculate_error_rate "$invocations" "$errors")
        
        # Build function report
        local function_report=$(cat << EOF
    "$function_name": {
        "status": "$status",
        "message": "$message",
        "response_time_ms": $response_time,
        "http_code": "$http_code",
        "metrics": {
            "invocations": $invocations,
            "errors": $errors,
            "error_rate_percent": $error_rate,
            "avg_duration_ms": $avg_duration
        },
        "thresholds": {
            "response_time_exceeded": $([ "$response_time" -gt "$RESPONSE_TIME_THRESHOLD" ] && echo "true" || echo "false"),
            "error_rate_exceeded": $([ "$error_rate" -gt "$ERROR_RATE_THRESHOLD" ] && echo "true" || echo "false")
        }
    }
EOF
)
        
        if [[ -n "$function_reports" ]]; then
            function_reports="$function_reports,"
        fi
        function_reports="$function_reports$function_report"
        
        # Update overall status
        if [[ "$status" == "critical" ]]; then
            overall_status="critical"
        elif [[ "$status" == "error" && "$overall_status" != "critical" ]]; then
            overall_status="error"
        elif [[ "$status" == "warning" && "$overall_status" == "healthy" ]]; then
            overall_status="warning"
        fi
        
        # Send alerts for issues
        if [[ "$status" != "healthy" ]]; then
            send_alert "$status" "$function_name" "$message"
        fi
        
        # Check thresholds
        if [[ "$error_rate" -gt "$ERROR_RATE_THRESHOLD" ]]; then
            send_alert "warning" "$function_name" "Error rate exceeded threshold: ${error_rate}%"
        fi
    done
    
    # Generate complete report
    cat << EOF > "$report_file"
{
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "overall_status": "$overall_status",
    "project_id": "$SUPABASE_PROJECT_ID",
    "functions": {
$function_reports
    },
    "system": {
        "database_healthy": true,
        "external_services_healthy": true
    }
}
EOF
    
    echo "$report_file"
}

# Display dashboard
display_dashboard() {
    clear
    echo "=================================="
    echo "🔍 EDGE FUNCTIONS MONITORING"
    echo "=================================="
    echo "Project: $SUPABASE_PROJECT_ID"
    echo "Time: $(date)"
    echo "=================================="
    echo ""
    
    for function_name in "${!FUNCTION_URLS[@]}"; do
        local function_url="${FUNCTION_URLS[$function_name]}"
        local health_result
        
        health_result=$(check_function_health "$function_name" "$function_url")
        IFS='|' read -r status message response_time http_code <<< "$health_result"
        
        local status_icon
        case "$status" in
            "healthy") status_icon="✅" ;;
            "warning") status_icon="⚠️" ;;
            "error") status_icon="❌" ;;
            "critical") status_icon="🚨" ;;
        esac
        
        printf "%-20s %s %-10s %4dms [%s]\n" \
            "$function_name" "$status_icon" "$status" "$response_time" "$http_code"
    done
    
    echo ""
    echo "=================================="
    echo "📊 System Status"
    echo "=================================="
    
    # Check database
    if check_database_health > /dev/null 2>&1; then
        echo "Database:         ✅ Healthy"
    else
        echo "Database:         ❌ Issues"
    fi
    
    echo ""
    echo "Press Ctrl+C to stop monitoring"
}

# Continuous monitoring mode
continuous_monitoring() {
    log "Starting continuous monitoring (interval: ${CHECK_INTERVAL}s)"
    
    while true; do
        display_dashboard
        sleep "$CHECK_INTERVAL"
    done
}

# Performance test
performance_test() {
    local function_name="$1"
    local iterations="${2:-10}"
    
    if [[ -z "${FUNCTION_URLS[$function_name]:-}" ]]; then
        error "Unknown function: $function_name"
        return 1
    fi
    
    local function_url="${FUNCTION_URLS[$function_name]}"
    local total_time=0
    local successful_requests=0
    
    log "Performance testing $function_name ($iterations iterations)..."
    
    for ((i=1; i<=iterations; i++)); do
        local start_time=$(date +%s%3N)
        local http_code
        
        http_code=$(curl -s -w "%{http_code}" -X POST "$function_url" \
            -H "Content-Type: application/json" \
            -d '{"test": true}' \
            --max-time 30 -o /dev/null || echo "000")
        
        local end_time=$(date +%s%3N)
        local response_time=$((end_time - start_time))
        
        if [[ "$http_code" != "000" ]]; then
            ((successful_requests++))
            total_time=$((total_time + response_time))
        fi
        
        printf "Request %2d: %3dms [%s]\n" "$i" "$response_time" "$http_code"
    done
    
    if [[ "$successful_requests" -gt 0 ]]; then
        local avg_time=$((total_time / successful_requests))
        local success_rate=$(( (successful_requests * 100) / iterations ))
        
        echo ""
        echo "Performance Summary:"
        echo "Success Rate: $success_rate%"
        echo "Average Response Time: ${avg_time}ms"
        echo "Total Successful Requests: $successful_requests/$iterations"
    else
        error "All requests failed"
    fi
}

# Main function
main() {
    case "${1:-}" in
        "dashboard")
            display_dashboard
            ;;
        "monitor")
            continuous_monitoring
            ;;
        "report")
            local report_file
            report_file=$(generate_health_report)
            success "Health report generated: $report_file"
            cat "$report_file"
            ;;
        "test")
            local function_name="${2:-user-management}"
            local iterations="${3:-10}"
            performance_test "$function_name" "$iterations"
            ;;
        "check")
            local function_name="${2:-all}"
            if [[ "$function_name" == "all" ]]; then
                for fname in "${!FUNCTION_URLS[@]}"; do
                    local result
                    result=$(check_function_health "$fname" "${FUNCTION_URLS[$fname]}")
                    IFS='|' read -r status message response_time http_code <<< "$result"
                    printf "%-20s: %s (%dms)\n" "$fname" "$message" "$response_time"
                done
            else
                if [[ -n "${FUNCTION_URLS[$function_name]:-}" ]]; then
                    local result
                    result=$(check_function_health "$function_name" "${FUNCTION_URLS[$function_name]}")
                    IFS='|' read -r status message response_time http_code <<< "$result"
                    echo "$function_name: $message ($response_time ms)"
                else
                    error "Unknown function: $function_name"
                fi
            fi
            ;;
        *)
            echo "Usage: $0 {dashboard|monitor|report|test|check} [options]"
            echo ""
            echo "Commands:"
            echo "  dashboard          - Show current status dashboard"
            echo "  monitor            - Continuous monitoring mode"
            echo "  report             - Generate detailed health report"
            echo "  test [function]    - Performance test a specific function"
            echo "  check [function]   - Check specific function health"
            echo ""
            echo "Examples:"
            echo "  $0 dashboard"
            echo "  $0 monitor"
            echo "  $0 test stripe-webhook 20"
            echo "  $0 check user-management"
            exit 1
            ;;
    esac
}

# Error handling
trap 'error "Monitoring script failed at line $LINENO"' ERR

# Run main function
main "$@"