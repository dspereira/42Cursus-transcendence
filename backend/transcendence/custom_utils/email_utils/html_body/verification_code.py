verification_code_html = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Steam Verification Code</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">

<div style="max-width: 600px; margin: 0 auto;">
    <div style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="padding: 20px;">
            <div style="text-align: center;">
                <h1 style="margin-top: 20px;">Verification Code</h1>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <p style="color: #777;">Use the following code to verify your account:</p>
                <div style="background-color: #66c0f4; color: #fff; border-radius: 10px; padding: 10px; font-size: 30px; display: inline-block;">
                    <h2 style="margin: 0;">{verification_code}</h2>
                </div>
                <p style="color: #777; margin-top: 20px;">This code will expire in 10 minutes.</p>
                <p style="color: #777;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
        </div>
    </div>
</div>

</body>
</html>
"""
