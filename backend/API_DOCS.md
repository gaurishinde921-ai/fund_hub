# FundHub Backend APIs

## Base URL
http://localhost:5000

---

## AUTH
Header required:
Authorization: valid-token

---

## PROFILE

GET /api/profile

Response:
{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "userId": "user123",
    "email": "test@gmail.com",
    "name": "Test User"
  }
}

---

## SETTINGS

GET /api/settings

POST /api/settings/update

Body:
{
  "theme": "dark",
  "notifications": true
}

---

## NOTIFICATIONS

GET /api/notifications

---

## KYC

POST /api/kyc/submit

Body:
{
  "name": "Sanskriti",
  "document": "Aadhar"
}

GET /api/kyc/status

---

## PAYMENTS

POST /api/payments/create-order