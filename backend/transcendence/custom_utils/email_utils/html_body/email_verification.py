email_verification_html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif;">

	<table style="max-width: 600px; margin: 0 auto; padding: 20px;">
		<tr>
			<td style="text-align: center;">
				<h1>Email Verification</h1>
				<p>Please click the button below to verify your email address.</p>
				<form id="verificationForm" method="POST" action="http://127.0.0.1:8000/api/auth/validate_email">
					<input type="hidden" name="email" value="{user_email}">
					<input type="hidden" name="email_token" value="{email_token}">
					<button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none;">Verify Email</button>
				</form>
			</td>
		</tr>
	</table>
</body>
</html>
"""
