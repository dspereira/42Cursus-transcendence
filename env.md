# ENV File

To ensure the project works correctly, we need to create a `.env` file.

## Table of Contents

- [Template](#template)
- [Variables](#variables)

## Template

This is the [.env_template](.env_template) file, which serves as a template for creating your own `.env` file.

```txt
DB_NAME=[value]
DB_USER=[value]
DB_PASS=[value]

DOMAIN=[value]

JWT_SECRET_KEY=[value]

EMAIL_HOST=[value]
EMAIL_PORT=[value]
EMAIL_USE_TLS=[value]
EMAIL_HOST_USER=[value]
EMAIL_HOST_PASSWORD=[value] 

TWILIO_ACCOUNT_SID=[value]
TWILIO_AUTH_TOKEN=[value]
TWILIO_PHONE_NUMBER=[value]

BACKEND_DEBUG_MODE=[value]

CRYPTOGRAPHER_PRIVATE_KEY=[value]
CRYPTOGRAPHER_PUBLIC_KEY=[value]
```

**NOTE:** Replace each `[value]` with the intended variable value.

## Variables

- [DB_NAME](#db_name)
- [DB_USER](#db_user)
- [DB_PASS](#db_pass)
- [DOMAIN](#domain)
- [JWT_SECRET_KEY](#jwt_secret_key)
- [EMAIL_HOST](#email_host)
- [EMAIL_PORT](#email_port)
- [EMAIL_USE_TLS](#email_use_tls)
- [EMAIL_HOST_USER](#email_host_user)
- [EMAIL_HOST_PASSWORD](#email_host_password)
- [TWILIO_ACCOUNT_SID](#twilio_account_sid)
- [TWILIO_AUTH_TOKEN](#twilio_auth_token)
- [TWILIO_PHONE_NUMBER](#twilio_phone_number)
- [BACKEND_DEBUG_MODE](#backend_debug_mode)
- [CRYPTOGRAPHER_PRIVATE_KEY](#cryptographer_private_key)
- [CRYPTOGRAPHER_PUBLIC_KEY](#cryptographer_public_key)

---

### DB_NAME

Specifies the name of the database.

### DB_USER

Specifies the database host username.

### DB_PASS

Specifies the database host password.

### DOMAIN

Specifies the domain of the application.

### JWT_SECRET_KEY

Specifies the 256-bit secret key used for creating rotating tokens.

### EMAIL_HOST

This variable stores the SMTP server address.

### EMAIL_PORT

This variable stores the SMTP port.

### EMAIL_USE_TLS

This is a boolean variable (`True`/`False`) that determines whether to use TLS.

### EMAIL_HOST_USER

Specifies the email address used by the application.

### EMAIL_HOST_PASSWORD

Specifies the password used by the application.

### TWILIO_ACCOUNT_SID

Specifies the Twilio Account SID.

### TWILIO_AUTH_TOKEN

Specifies the Twilio auth token.

### TWILIO_PHONE_NUMBER

Specifies the Twilio phone number.

### BACKEND_DEBUG_MODE

Boolean variable (`True`/`False`) that determines whether to run the backend in **DEBUG** mode.

### CRYPTOGRAPHER_PRIVATE_KEY

Specifies the private key used for cryptographic operations.

### CRYPTOGRAPHER_PUBLIC_KEY

Specifies the public key used for cryptographic operations.
