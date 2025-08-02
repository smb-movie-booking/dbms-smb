#!/bin/bash

# Set API base
BASE_URL_auth="http://localhost:3000/api/auth"
BASE_URL="http://localhost:3000/api/users"
COOKIE_JAR="cookies.txt"

echo "🧪 1. Register Normal User"
curl -X POST "$BASE_URL_auth/register" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{
    "name": "NormalUser",
    "email": "normal@example.com",
    "phone": "9878987898",
    "password": "pass1234"
  }'
echo -e "\n"

echo "🧪 2. Register Admin User"
curl -X POST "$BASE_URL_auth/register" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{
    "name": "AdminUser",
    "email": "admin@example.com",
    "phone": "2222222222",
    "password": "adminpass",
    "adminCode": "supersecretadminkey"
  }'
echo -e "\n"

echo "🧪 3. Duplicate User Registration (Should Fail with 409)"
curl -X POST "$BASE_URL_auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Duplicate",
    "email": "normal@example.com",
    "phone": "3333333333",
    "password": "something"
  }'
echo -e "\n"

echo "🔐 4. Login as Normal User"
curl -X POST "$BASE_URL_auth/login" \
  -H "Content-Type: application/json" \
  -c $COOKIE_JAR \
  -d '{
    "email": "normal@example.com",
    "password": "pass1234"
  }'
echo -e "\n"

echo "👤 5. Get User Profile"
curl -X GET "$BASE_URL/me" \
  -b $COOKIE_JAR
echo -e "\n"

echo "✏️ 6. Update Profile (Name & Phone)"
curl -X PUT "$BASE_URL/me" \
  -H "Content-Type: application/json" \
  -b $COOKIE_JAR \
  -d '{
    "name": "UpdatedUser",
    "phone": "4444444444"
  }'
echo -e "\n"

echo "🚫 7. Invalid Login (Wrong Password)"
curl -X POST "$BASE_URL_auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "normal@example.com",
    "password": "wrongpass"
  }'
echo -e "\n"

echo "🧼 8. Logout (optional if implemented)"
curl -X POST "$BASE_URL_auth/logout" \
  -b $COOKIE_JAR
echo -e "\n"

echo "🔒 9. Get Profile After Logout (Should Fail)"
curl -X GET "$BASE_URL/me" \
  -b $COOKIE_JAR
echo -e "\n"

# Clean up
rm -f $COOKIE_JAR
