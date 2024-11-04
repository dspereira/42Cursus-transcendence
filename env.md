# ENV File

To ensure the project works correctly, we need to create a `.env` file.

## Table of Contents

- [Template](#template)
- [Variables](#variables)
- [Cryptographer Keys](#cryptographer-keys)

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

- [ENV File](#env-file)
  - [Table of Contents](#table-of-contents)
  - [Template](#template)
  - [Variables](#variables)
    - [DB\_NAME](#db_name)
    - [DB\_USER](#db_user)
    - [DB\_PASS](#db_pass)
    - [DOMAIN](#domain)
    - [JWT\_SECRET\_KEY](#jwt_secret_key)
    - [EMAIL\_HOST](#email_host)
    - [EMAIL\_PORT](#email_port)
    - [EMAIL\_USE\_TLS](#email_use_tls)
    - [EMAIL\_HOST\_USER](#email_host_user)
    - [EMAIL\_HOST\_PASSWORD](#email_host_password)
    - [TWILIO\_ACCOUNT\_SID](#twilio_account_sid)
    - [TWILIO\_AUTH\_TOKEN](#twilio_auth_token)
    - [TWILIO\_PHONE\_NUMBER](#twilio_phone_number)
    - [BACKEND\_DEBUG\_MODE](#backend_debug_mode)
    - [CRYPTOGRAPHER\_PRIVATE\_KEY](#cryptographer_private_key)
    - [CRYPTOGRAPHER\_PUBLIC\_KEY](#cryptographer_public_key)
  - [Cryptographer Keys](#cryptographer-keys)

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

## Cryptographer Keys

**IMPORTANT:** Before generating the keys, ensure that you have created an `.env` file. If you haven't done so, please create it before proceeding. Make sure you do not have the variables `CRYPTOGRAPHER_PRIVATE_KEY` and `CRYPTOGRAPHER_PUBLIC_KEY` in the `.env` file

To generate the `CRYPTOGRAPHER_PRIVATE_KEY` and `CRYPTOGRAPHER_PUBLIC_KEY`, run the following command:

```bash
python3 generate_cryptographer_keys.py
```

After running the command, the keys will be added to your `.env` file and will be ready for use.
