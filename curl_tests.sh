#!/bin/bash

# ==============================================================================
# Crealia API Test Suite (Generated via Static Analysis)
# ==============================================================================
#
# IMPORTANT: These tests were generated based on a static analysis of the
# frontend and backend code. They have not been executed against a live
# environment due to network issues preventing the application from running.
#
# Before running:
# 1. Ensure the application is running (e.g., via `docker-compose up`).
# 2. Replace placeholder values (like <jwt_token>) if authentication is required.
#

# --- Configuration ---
BASE_URL="http://localhost:3000/api"
USER_ID="demo-user" # Using demo user ID found in frontend code

# --- Helper Functions ---
function run_test {
    echo "-----------------------------------------------------"
    echo "🔄 Running Test: $1"
    echo "▶️  Command: $2"
    echo "-----------------------------------------------------"
    eval $2
    echo ""
    echo ""
}

# ==============================================================================
# Social Accounts API Tests
# ==============================================================================

# --- SA-01: Get all social accounts for a user ---
TEST_NAME="SA-01: Get Social Accounts"
COMMAND="curl -X GET \"${BASE_URL}/social-accounts?userId=${USER_ID}\" -v"
run_test "$TEST_NAME" "$COMMAND"

# --- SA-03: Disconnect a social account ---
# Note: Replace 'test-account-id' with a valid account ID.
TEST_NAME="SA-03: Disconnect Social Account"
COMMAND="curl -X DELETE \"${BASE_URL}/social-accounts?accountId=test-account-id&userId=${USER_ID}\" -v"
run_test "$TEST_NAME" "$COMMAND"

# --- SA-04: Refresh an expired token ---
# Note: Replace 'test-account-id' with a valid account ID.
TEST_NAME="SA-04: Refresh Token"
COMMAND="curl -X POST \"${BASE_URL}/social-accounts/refresh\" \\
    -H \"Content-Type: application/json\" \\
    -d '{\"accountId\": \"test-account-id\"}' \\
    -v"
run_test "$TEST_NAME" "$COMMAND"

# ==============================================================================
# Social Analytics API Tests
# ==============================================================================

# --- SAN-01: Extract performance data ---
# Note: This endpoint has a contract mismatch. The backend expects a 'dateRange'
# that the frontend does not send. This test includes the 'dateRange' as per
# the backend's expectation.
TEST_NAME="SAN-01: Extract Performance Data"
COMMAND="curl -X POST \"${BASE_URL}/social-analytics/extract\" \\
    -H \"Content-Type: application/json\" \\
    -d '{\"userId\": \"${USER_ID}\", \"platform\": \"instagram\", \"dateRange\": {\"start\": \"2023-01-01\", \"end\": \"2023-01-31\"}}' \\
    -v"
run_test "$TEST_NAME" "$COMMAND"

# --- SAN-02: Analyze content trends ---
TEST_NAME="SAN-02: Analyze Content Trends"
COMMAND="curl -X POST \"${BASE_URL}/social-analytics/trends\" \\
    -H \"Content-Type: application/json\" \\
    -d '{\"userId\": \"${USER_ID}\", \"platform\": \"instagram\"}' \\
    -v"
run_test "$TEST_NAME" "$COMMAND"

# --- SAN-03: Generate strategic recommendations ---
TEST_NAME="SAN-03: Generate Strategic Recommendations"
COMMAND="curl -X POST \"${BASE_URL}/social-analytics/recommendations\" \\
    -H \"Content-Type: application/json\" \\
    -d '{\"userId\": \"${USER_ID}\", \"objective\": \"growth\", \"platform\": \"instagram\"}' \\
    -v"
run_test "$TEST_NAME" "$COMMAND"

echo "✅ Test script finished."
