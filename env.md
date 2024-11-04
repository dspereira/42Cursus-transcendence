# ENV File

To ensure the project works correctly, we need to create a `.env` file.

## Table of Contents

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
- [Simple Environment Configuration](#simple-environment-configuration)

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

A boolean variable (`True`/`False`) that determines whether to run the backend in **DEBUG** mode.

If **BACKEND_DEBUG_MODE** is set to `True`, the following features are disabled:
- Email verification
- Two-factor authentication (after logging in, you can enter any six digits to bypass this step).

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

## Simple Environment Configuration

This `.env` file is intended for local testing of the application.  
**Note:** This file is accessible to everyone.

```txt
DB_NAME= database
DB_USER= blitzpong
DB_PASS= 123

DOMAIN=localhost
PORT=8443

JWT_SECRET_KEY="your-256-bit-secret"

BACKEND_DEBUG_MODE=True

CRYPTOGRAPHER_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA4f9SMuGvAC0Fzcztq50ueG+w3fB54QOr0NMIwAsMEPApmZhG\nPjSw//Y4Xtc8Nxy1Kbr4B7vzwA6DPKLQk6fHnaOj0w8OMDW68ugiNdt5Sq+4buH/\n8OoTA1CADC5S/oFJhGsV+VOtrTY2GuB+ebZIrQoZN2WaA0nqU3f2eKg9f0kxr53E\ngNjD9evnAJWZLlx5LJrJt7F7mGzbuX8cBhokxToKwP9euvzy+Y6IH5XbTRUgN4Xs\nF6yXtTSbDR2dklmVLyjvIvMKbL+4i205wNR0aG8yvws96HKxIbK8O3mHYmjJZHfQ\nVHxnOaVXswpL/Sp5QtCcLBqqAbSA1fE4p7JmgQIDAQABAoIBAAimJPMPzkrdTj0u\nsDNayfwfuSb7RKzS/0S4CNwRqCnvSQZI7LpFebcoCQb/KX2p9nh1AHhKTgUuAQGF\ncSJPf90Vdcf2aep4KfIRJnsFbd5I/I/YzBrgGG9uaaIdtT0qfUHpN79xn4JTIm2z\npP97NYuSyP2E4Miqr+I3I3qBZM4d0HDyyTjmvCsGqTqV/jN9RsLneS38HLj3E94I\n7989gCXxqQ2huPH01V8WbyXjEi4xTIOUq8DzH7o9FQV1usiiHgXUeoiV45EH6d+k\ne5sJfjzDI0hSi4kBBBLeBpDKurm6u2LVE4M2WAVtvRfQ2HjKqaVASFXDa+8UeXXv\ntMSNTOECgYEA+qiGbxFUAYYIbPMQMQ8gqhz7TzsCgEGCIxS1SVLBWwFQ7VI4j/kl\niSjuKXUWy33acFvgTfWdyG0qS2UHssYANXQnqLZDCpor9oKkOSke7PHVjwwoRmmb\n0ClAy+HeCsMjg+l84VONH0G//opDmXahpBsMfTYPtEU2nFygaFGiKZECgYEA5tBB\n3bQCwXdeqPDUfjv+YFy/90UQlsTTmCloZUcuIo69ZEoRUojb4jZoijdkWewkZvfP\nye78M9HnJcqiuJT2L5kRL6gjLjvJPRw0nulG74i64jT29g++3z9Lu+FKMAlwTpIW\n+t17CjBw0oaSBrsI70sqZbcaslHt2C8LQktqdfECgYB/TP+ZgO9tJqk4y+k5QTmR\nq85mWs3WXW6+alH3vzO8CFsVbGCVni9WDZeHLpQ5HN3HmqG8djWACREl4VWbkbuh\najCKGqbJx6r0Mz08Won+RIP1dnMt74zWl1z1Lu0aAikTYY2u0kQlz7q2h3n1gq5t\nLd+V59Lp9wzZNKGy2WLGQQKBgDrq5DVMkvuBlgc32nYSqF8+rb3XwmFKAt0vjLd1\nkQA/QXcNNRjFWKOI0eyeMR6HGc+y6Daaq4Qqy38pF5pYY/NIdkuc9sYBet//iCsc\nTwAr/dBqRrQO1uEzzgg6fO6AKkvUHMuSp6q1LMeAlFvleGVk4YCvWcA1C6qIb65P\ng/BxAoGBAM9ebtb6zn8aaRkYQCqlSj1n2mF8V+5YyPMbvD+cuxztGwhjzf71itz9\nd0xKrUZND/rssPSf5KT4sX+iwDEv20Q+RAka529eZUH65NbVBRE4exP2TFoXA2Rq\nMwPESmyicih0sKbMS5ivTmimWH4tPPdsNaB9feP0W97670mX68GL\n-----END RSA PRIVATE KEY-----\n"

CRYPTOGRAPHER_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f9SMuGvAC0Fzcztq50u\neG+w3fB54QOr0NMIwAsMEPApmZhGPjSw//Y4Xtc8Nxy1Kbr4B7vzwA6DPKLQk6fH\nnaOj0w8OMDW68ugiNdt5Sq+4buH/8OoTA1CADC5S/oFJhGsV+VOtrTY2GuB+ebZI\nrQoZN2WaA0nqU3f2eKg9f0kxr53EgNjD9evnAJWZLlx5LJrJt7F7mGzbuX8cBhok\nxToKwP9euvzy+Y6IH5XbTRUgN4XsF6yXtTSbDR2dklmVLyjvIvMKbL+4i205wNR0\naG8yvws96HKxIbK8O3mHYmjJZHfQVHxnOaVXswpL/Sp5QtCcLBqqAbSA1fE4p7Jm\ngQIDAQAB\n-----END PUBLIC KEY-----\n"
```
