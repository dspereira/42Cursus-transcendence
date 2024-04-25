email_verification_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="padding: 20px 0; text-align: center;">
          <h2 style="margin-bottom: 20px;">Email Verification</h2>
          <p style="margin-bottom: 20px;">Thank you for signing up! Please click the button below to verify your email address.</p>
          <table cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              <td style="border-radius: 3px; background-color: #007bff;">
                <a href="{email_verification_url}" style="display: inline-block; padding: 10px 20px; color: #ffffff; text-decoration: none; font-size: 16px;">Verify Email</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
"""