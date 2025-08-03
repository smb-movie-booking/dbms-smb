#!/bin/bash

BASE_URL="http://localhost:3000/api"
SESSION_COOKIE="cookie.txt"

# User credentials
NAME="Test User"
PHONE="9876543211"
PASSWORD="initialPass123"
NEW_PASSWORD="newPass456"
EMAIL="testuser@example.com"
ADMIN_CODE="admin123"

echo "📨 Step 1: Sending OTP..."
curl -X POST "$BASE_URL/auth/send-otp" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\"}"
echo

echo "🔐 Step 2: Waiting for user to enter received OTP..."
read -p "Enter OTP: " OTP
OTP=$(echo "$OTP" | xargs)

echo "✅ Step 3: Verifying OTP..."
curl -X POST "$BASE_URL/auth/verify-otp" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\", \"otp\":\"$OTP\"}"
echo

echo "📝 Step 4: Registering user after OTP is verified..."
curl -X POST "$BASE_URL/auth/register" -H "Content-Type: application/json" \
    -d "{\"name\":\"$NAME\", \"phone\":\"$PHONE\", \"password\":\"$PASSWORD\", \"adminCode\":\"$ADMIN_CODE\"}" -c "$SESSION_COOKIE"
echo

echo "🔑 Logging in..."
curl -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\", \"password\":\"$PASSWORD\"}" -c $SESSION_COOKIE
echo

echo "👤 Getting profile..."
curl -X GET "$BASE_URL/users/me" -b $SESSION_COOKIE
echo

echo "✏️ Updating profile..."
curl -X PUT "$BASE_URL/users/me" -H "Content-Type: application/json" \
    -d "{\"name\":\"Updated User\", \"phone\":\"$PHONE\", \"email\":\"$EMAIL\", \"otp\":\"$OTP\"}" -b $SESSION_COOKIE
echo

echo "🔐 Changing password..."
curl -X PUT "$BASE_URL/users/me/password" -H "Content-Type: application/json" \
    -d "{\"currentPassword\":\"$PASSWORD\", \"newPassword\":\"$NEW_PASSWORD\", \"phone\":\"$PHONE\", \"otp\":\"$OTP\"}" -b $SESSION_COOKIE
echo

echo "🚪 Logging out..."
curl -X GET "$BASE_URL/auth/logout" -b $SESSION_COOKIE
echo

echo "🔑 Trying login with old password (should fail)..."
curl -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\", \"password\":\"$PASSWORD\"}" -c $SESSION_COOKIE
echo

echo "🔐 Sending OTP for reset..."
curl -X POST "$BASE_URL/auth/send-otp" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\"}"
echo -e "\nEnter OTP again for reset-password:"
read -p "OTP: " RESET_OTP

echo "🔁 Resetting password..."
curl -X POST "$BASE_URL/auth/reset-password" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\", \"otp\":\"$RESET_OTP\", \"newPassword\":\"$PASSWORD\"}"
echo

echo "✅ Logging in with RESET password..."
curl -X POST "$BASE_URL/auth/login" -H "Content-Type: application/json" \
    -d "{\"phone\":\"$PHONE\", \"password\":\"$PASSWORD\"}" -c $SESSION_COOKIE
echo

echo "❌ Deleting user..."
curl -X DELETE "$BASE_URL/users/me" -b $SESSION_COOKIE
echo

echo "🎉 All tests done."
