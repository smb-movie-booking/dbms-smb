#!/bin/bash

# ===================================================================================
#
# Comprehensive API Test Script
#
# Description: This script tests the user authentication and profile management
#              API endpoints. It uses jq to safely construct JSON payloads,
#              preventing syntax errors from variable expansion.
#
# Requirements: curl, jq, and a .env file in the same directory.
#
# Usage: ./test_api.sh
#
# ===================================================================================

# --- Configuration ---
BASE_URL="http://localhost:3000/api" # Change this to your server's address
COOKIE_JAR_USER1="cookies_user1.txt"
COOKIE_JAR_USER2="cookies_user2.txt"
COOKIE_JAR_ADMIN="cookies_admin.txt"

# Load environment variables silently
export $(grep -v '^#' .env | xargs)

# Silently reset database
if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "DROP DATABASE IF EXISTS $DB_NAME; CREATE DATABASE $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" > /dev/null 2>&1 &&
   mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < ../database/smb.sql > /dev/null 2>&1; then
  echo "[INFO] Database loaded and ready."
else
  echo "[ERROR] Failed to reset and load the database." >&2
  exit 1
fi

mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF > /dev/null 2>&1
CREATE TABLE IF NOT EXISTS sessions (
  session_id varchar(128) COLLATE utf8mb4_bin NOT NULL,
  expires int(11) unsigned NOT NULL,
  data text COLLATE utf8mb4_bin,
  PRIMARY KEY (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
EOF

echo "[INFO] Session table ensured."


# --- Colors for Output ---
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# --- Helper Functions ---

# Function to print a section header
print_header() {
    echo -e "\n${BLUE}=======================================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}=======================================================================${NC}"
}

# Function to print a success message
print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to print an error message
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to print an informational message
print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# --- Load Admin Secret from .env file ---
if [ -f .env ]; then
    # Use grep to find the line starting with ADMIN_SECRET= and cut to get the value
    ADMIN_SECRET=$(grep '^ADMIN_SECRET=' .env | cut -d '=' -f2-)
    print_info "Successfully loaded ADMIN_SECRET from .env file."
else
    print_error ".env file not found. Please create one with your ADMIN_SECRET."
    exit 1
fi

if [ -z "$ADMIN_SECRET" ]; then
    print_error "ADMIN_SECRET not found in .env file. Please add it."
    exit 1
fi


# Function to make a curl request, print the response, and check the status
# Usage: assert_status "Description" "Expected Status" "Method" "Endpoint" "Data" "Cookie Jar"
assert_status() {
    DESCRIPTION=$1
    EXPECTED_STATUS=$2
    METHOD=$3
    ENDPOINT=$4
    DATA=$5
    COOKIE_JAR=$6

    print_info "Testing: $DESCRIPTION"

    # Build the curl command in an array to handle empty data correctly.
    CURL_CMD=("curl" "-s" "-w" "HTTP_STATUS_SEPARATOR%{http_code}")
    CURL_CMD+=("-X" "$METHOD")

    if [ -n "$COOKIE_JAR" ]; then
        CURL_CMD+=("-b" "$COOKIE_JAR" "-c" "$COOKIE_JAR")
    fi

    # CORRECTED: Only add Content-Type header and data if data is actually being sent.
    # This prevents the "Unexpected end of JSON input" error on GET/DELETE requests.
    if [ -n "$DATA" ]; then
        CURL_CMD+=("-H" "Content-Type: application/json")
        CURL_CMD+=("-d" "$DATA")
    fi

    CURL_CMD+=("$BASE_URL$ENDPOINT")

    # Execute the command and capture the full output
    FULL_RESPONSE=$("${CURL_CMD[@]}")


    # Separate the body and the status code using a more robust method
    # that handles multi-line response bodies (like HTML error pages).
    BODY="${FULL_RESPONSE%HTTP_STATUS_SEPARATOR*}"
    STATUS_CODE="${FULL_RESPONSE##*HTTP_STATUS_SEPARATOR}"

    # Print the response body, pretty-printing with jq if it's valid JSON
    if [ -n "$BODY" ]; then
        echo -e "${BLUE}---------- Response Body ----------${NC}"
        # Attempt to pretty-print with jq; if it fails (e.g., not JSON), print the raw body.
        echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
        echo -e "${BLUE}-----------------------------------${NC}"
    fi

    # Check the status code
    if [[ "$STATUS_CODE" =~ ^[0-9]+$ ]]; then
        if [ "$STATUS_CODE" -eq "$EXPECTED_STATUS" ]; then
            print_success "Expected status $EXPECTED_STATUS, got $STATUS_CODE."
        else
            print_error "Expected status $EXPECTED_STATUS, but got $STATUS_CODE."
        fi
    else
        print_error "Could not connect to server or invalid response. Status: '$STATUS_CODE'"
    fi
}

# --- Test Data ---
USER1_NAME="Test User One"
USER1_PHONE="9876543210"
USER1_EMAIL="user1@example.com"
USER1_PASS="Password123"
USER1_NEW_PASS="NewPassword456"

USER2_NAME="Test User Two"
USER2_PHONE="9876543211"
USER2_EMAIL="user2@example.com"
USER2_PASS="Password789"

ADMIN_NAME="Admin User"
ADMIN_PHONE="9999999999"
ADMIN_PASS="AdminPass!@#"

# --- Cleanup Function ---
cleanup() {
    print_header "CLEANUP"
    rm -f $COOKIE_JAR_USER1 $COOKIE_JAR_USER2 $COOKIE_JAR_ADMIN
    print_info "Removed cookie jars."
}

# Make sure to run cleanup on exit
trap cleanup EXIT

# ===================================================================================
#
#                                 START OF TESTS
#
# ===================================================================================

# --- Test Suite: Unauthenticated Access ---
test_unauthenticated_access() {
    print_header "TESTING UNAUTHENTICATED ACCESS TO PROTECTED ROUTES"
    local DATA

    assert_status "Get profile without auth" 401 "GET" "/users/me" "" ""

    DATA=$(jq -n --arg name "hacker" '{name: $name}')
    assert_status "Update name without auth" 401 "PUT" "/users/update-name" "$DATA" ""

    DATA=$(jq -n --arg current "a" --arg new "b" --arg confirm "b" \
        '{currentPassword: $current, newPassword: $new, confirmPassword: $confirm}')
    assert_status "Update password without auth" 401 "PUT" "/users/update-password" "$DATA" ""

    assert_status "Delete profile without auth" 401 "DELETE" "/users/me" "" ""
}


# --- Test Suite: User Registration ---
test_registration() {
    print_header "TESTING USER REGISTRATION"
    local DATA

    # Failures
    DATA=$(jq -n --arg name "Test" '{name: $name}')
    assert_status "Register with missing fields" 400 "POST" "/auth/register" "$DATA" ""

    DATA=$(jq -n --arg name "$USER1_NAME" --arg phone "$USER1_PHONE" --arg pass "$USER1_PASS" \
        '{name: $name, phone: $phone, password: $pass}')
    assert_status "Register without OTP verification" 403 "POST" "/auth/register" "$DATA" ""

    # OTP Flow
    print_info "The next step requires you to get the OTP from your server console."
    DATA=$(jq -n --arg id "$USER1_PHONE" '{identifier: $id}')
    assert_status "Send OTP to new phone" 200 "POST" "/auth/send-otp" "$DATA" ""
    read -p "Please enter the OTP for $USER1_PHONE from the console: " USER1_OTP
    
    DATA=$(jq -n --arg id "$USER1_PHONE" --arg otp "999999" '{identifier: $id, otp: $otp}')
    assert_status "Verify with incorrect OTP" 401 "POST" "/auth/verify-otp" "$DATA" ""
    
    DATA=$(jq -n --arg id "$USER1_PHONE" --arg otp "$USER1_OTP" '{identifier: $id, otp: $otp}')
    assert_status "Verify with correct OTP" 200 "POST" "/auth/verify-otp" "$DATA" ""

    # Successful Registration
    DATA=$(jq -n --arg name "$USER1_NAME" --arg phone "$USER1_PHONE" --arg pass "$USER1_PASS" \
        '{name: $name, phone: $phone, password: $pass}')
    assert_status "Register User 1 successfully" 201 "POST" "/auth/register" "$DATA" $COOKIE_JAR_USER1
    
    # Logout after auto-login from registration to test login separately
    assert_status "Logout User 1 after registration" 200 "GET" "/auth/logout" "" $COOKIE_JAR_USER1

    # Attempt to re-register with the same phone
    print_info "The next step requires another OTP."
    DATA=$(jq -n --arg id "$USER1_PHONE" '{identifier: $id}')
    assert_status "Send OTP to existing phone" 200 "POST" "/auth/send-otp" "$DATA" ""
    read -p "Please enter the new OTP for $USER1_PHONE from the console: " RE_REGISTER_OTP
    
    DATA=$(jq -n --arg id "$USER1_PHONE" --arg otp "$RE_REGISTER_OTP" '{identifier: $id, otp: $otp}')
    assert_status "Verify OTP for existing phone" 200 "POST" "/auth/verify-otp" "$DATA" ""
    
    DATA=$(jq -n --arg name "$USER1_NAME" --arg phone "$USER1_PHONE" --arg pass "$USER1_PASS" \
        '{name: $name, phone: $phone, password: $pass}')
    assert_status "Attempt to re-register with same phone" 500 "POST" "/auth/register" "$DATA" ""
}

# --- Test Suite: Admin Registration ---
test_admin_registration() {
    print_header "TESTING ADMIN REGISTRATION"
    local DATA
    
    print_info "The next step requires an OTP for the admin user."
    DATA=$(jq -n --arg id "$ADMIN_PHONE" '{identifier: $id}')
    assert_status "Send OTP to admin phone" 200 "POST" "/auth/send-otp" "$DATA" ""
    read -p "Please enter the OTP for $ADMIN_PHONE from the console: " ADMIN_OTP
    
    DATA=$(jq -n --arg id "$ADMIN_PHONE" --arg otp "$ADMIN_OTP" '{identifier: $id, otp: $otp}')
    assert_status "Verify admin OTP" 200 "POST" "/auth/verify-otp" "$DATA" ""

    DATA=$(jq -n --arg name "$ADMIN_NAME" --arg phone "$ADMIN_PHONE" --arg pass "$ADMIN_PASS" --arg code "$ADMIN_SECRET" \
        '{name: $name, phone: $phone, password: $pass, adminCode: $code}')
    assert_status "Register Admin successfully" 201 "POST" "/auth/register" "$DATA" $COOKIE_JAR_ADMIN
    
    # Logout after auto-login
    assert_status "Logout Admin after registration" 200 "GET" "/auth/logout" "" $COOKIE_JAR_ADMIN
}


# --- Test Suite: Login and Logout ---
test_login_logout() {
    print_header "TESTING LOGIN AND LOGOUT"
    local DATA

    # Failures
    DATA=$(jq -n --arg phone "0000000000" --arg pass "$USER1_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login with wrong phone" 400 "POST" "/auth/login" "$DATA" ""
    
    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg pass "wrongpassword" '{phone: $phone, password: $pass}')
    assert_status "Login with wrong password" 401 "POST" "/auth/login" "$DATA" ""
    
    DATA=$(jq -n --arg phone "123" --arg pass "$USER1_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login with invalid phone format" 400 "POST" "/auth/login" "$DATA" ""

    # Success
    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg pass "$USER1_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login User 1 successfully" 200 "POST" "/auth/login" "$DATA" $COOKIE_JAR_USER1
    print_info "User 1 is now logged in."

    # Logout
    assert_status "Logout User 1 successfully" 200 "GET" "/auth/logout" "" $COOKIE_JAR_USER1
    print_info "User 1 is now logged out."

    # Verify logout by trying to access a protected route
    assert_status "Get profile after logout (should fail)" 401 "GET" "/users/me" "" $COOKIE_JAR_USER1
}


# --- Test Suite: Password Reset ---
test_password_reset() {
    print_header "TESTING PASSWORD RESET"
    local DATA

    print_info "The next step requires an OTP for password reset."
    DATA=$(jq -n --arg id "$USER1_PHONE" '{identifier: $id}')
    assert_status "Send OTP for password reset" 200 "POST" "/auth/send-otp" "$DATA" ""
    read -p "Please enter the OTP for $USER1_PHONE from the console: " RESET_OTP

    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg otp "999999" --arg new "$USER1_NEW_PASS" \
        '{phone: $phone, otp: $otp, newPassword: $new}')
    assert_status "Reset password with wrong OTP" 401 "POST" "/auth/reset-password" "$DATA" ""
    
    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg otp "$RESET_OTP" --arg new "$USER1_NEW_PASS" \
        '{phone: $phone, otp: $otp, newPassword: $new}')
    assert_status "Reset password successfully" 200 "POST" "/auth/reset-password" "$DATA" ""

    # Verify the new password works
    print_info "Verifying login with the new password."
    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg pass "$USER1_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login with old password (should fail)" 401 "POST" "/auth/login" "$DATA" $COOKIE_JAR_USER1
    
    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg pass "$USER1_NEW_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login with new password (should succeed)" 200 "POST" "/auth/login" "$DATA" $COOKIE_JAR_USER1
    
    assert_status "Logout after password reset test" 200 "GET" "/auth/logout" "" $COOKIE_JAR_USER1
}


# --- Test Suite: Profile Management ---
test_profile_management() {
    print_header "TESTING PROFILE MANAGEMENT (USER 1)"
    local DATA

    # Login first
    DATA=$(jq -n --arg phone "$USER1_PHONE" --arg pass "$USER1_NEW_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login User 1 for profile tests" 200 "POST" "/auth/login" "$DATA" $COOKIE_JAR_USER1

    # Get Profile
    print_info "Fetching user profile..."
    assert_status "Get current user profile" 200 "GET" "/users/me" "" $COOKIE_JAR_USER1

    # Update Name
    DATA=$(jq -n --arg name "Test User One Updated" '{name: $name}')
    assert_status "Update name" 200 "PUT" "/users/update-name" "$DATA" $COOKIE_JAR_USER1

    # Update Password
    DATA=$(jq -n --arg current "wrong" --arg new "a" --arg confirm "a" \
        '{currentPassword: $current, newPassword: $new, confirmPassword: $confirm}')
    assert_status "Update password with wrong current pass" 401 "PUT" "/users/update-password" "$DATA" $COOKIE_JAR_USER1
    
    DATA=$(jq -n --arg current "$USER1_NEW_PASS" --arg new "a" --arg confirm "b" \
        '{currentPassword: $current, newPassword: $new, confirmPassword: $confirm}')
    assert_status "Update password with mismatching new pass" 400 "PUT" "/users/update-password" "$DATA" $COOKIE_JAR_USER1
    
    DATA=$(jq -n --arg current "$USER1_NEW_PASS" --arg new "$USER1_PASS" --arg confirm "$USER1_PASS" \
        '{currentPassword: $current, newPassword: $new, confirmPassword: $confirm}')
    assert_status "Update password successfully" 200 "PUT" "/users/update-password" "$DATA" $COOKIE_JAR_USER1
    print_info "Password has been changed back to the original."

    # Update Email
    print_header "TESTING EMAIL UPDATE"
    DATA=$(jq -n --arg id "$USER1_EMAIL" '{identifier: $id}')
    assert_status "Send OTP to new email" 200 "POST" "/auth/send-otp" "$DATA" $COOKIE_JAR_USER1
    read -p "Please enter the OTP for $USER1_EMAIL from the console: " EMAIL_OTP
    
    DATA=$(jq -n --arg id "$USER1_EMAIL" --arg otp "$EMAIL_OTP" '{identifier: $id, otp: $otp}')
    assert_status "Verify email OTP" 200 "POST" "/auth/verify-otp" "$DATA" $COOKIE_JAR_USER1
    
    DATA=$(jq -n --arg email "$USER1_EMAIL" --arg otp "$EMAIL_OTP" '{email: $email, otp: $otp}')
    assert_status "Update email successfully" 200 "PUT" "/users/update-email" "$DATA" $COOKIE_JAR_USER1

    # Logout
    assert_status "Logout User 1 after profile tests" 200 "GET" "/auth/logout" "" $COOKIE_JAR_USER1
}

# --- Test Suite: Concurrency and Uniqueness ---
test_uniqueness() {
    print_header "TESTING UNIQUENESS CONSTRAINTS (USER 2)"
    local DATA

    # Register User 2
    print_info "Registering a second user to test uniqueness constraints."
    DATA=$(jq -n --arg id "$USER2_PHONE" '{identifier: $id}')
    assert_status "Send OTP for User 2" 200 "POST" "/auth/send-otp" "$DATA" ""
    read -p "Please enter the OTP for $USER2_PHONE from the console: " USER2_OTP
    
    DATA=$(jq -n --arg id "$USER2_PHONE" --arg otp "$USER2_OTP" '{identifier: $id, otp: $otp}')
    assert_status "Verify OTP for User 2" 200 "POST" "/auth/verify-otp" "$DATA" ""
    
    DATA=$(jq -n --arg name "$USER2_NAME" --arg phone "$USER2_PHONE" --arg pass "$USER2_PASS" \
        '{name: $name, phone: $phone, password: $pass}')
    assert_status "Register User 2" 201 "POST" "/auth/register" "$DATA" $COOKIE_JAR_USER2

    # Attempt to update User 2's email to User 1's email
    print_info "Attempting to update User 2's email to one that is already in use by User 1."
    DATA=$(jq -n --arg id "$USER1_EMAIL" '{identifier: $id}')
    assert_status "Send OTP to User 1's email (for User 2)" 409 "POST" "/auth/send-otp" "$DATA" $COOKIE_JAR_USER2
    
    # Logout User 2
    assert_status "Logout User 2" 200 "GET" "/auth/logout" "" $COOKIE_JAR_USER2
}


# --- Test Suite: Account Deletion ---
test_deletion() {
    print_header "TESTING ACCOUNT DELETION"
    local DATA

    # Login User 2 to delete their account
    DATA=$(jq -n --arg phone "$USER2_PHONE" --arg pass "$USER2_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login User 2 for deletion" 200 "POST" "/auth/login" "$DATA" $COOKIE_JAR_USER2
    
    assert_status "Delete User 2's profile" 200 "DELETE" "/users/me" "" $COOKIE_JAR_USER2

    # Verify deletion
    print_info "Verifying User 2 account is deleted."
    DATA=$(jq -n --arg phone "$USER2_PHONE" --arg pass "$USER2_PASS" '{phone: $phone, password: $pass}')
    assert_status "Login with deleted account (should fail)" 401 "POST" "/auth/login" "$DATA" ""
}


# --- Main Execution ---
main() {
    print_header "STARTING API TEST SUITE"
    
    test_unauthenticated_access
    test_registration
    test_admin_registration
    test_login_logout
    test_password_reset
    test_profile_management
    test_uniqueness
    test_deletion

    print_header "ALL TESTS COMPLETED"
}

# Run the main function
main
