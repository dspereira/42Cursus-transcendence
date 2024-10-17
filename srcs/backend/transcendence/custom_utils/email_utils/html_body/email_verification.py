email_verification_html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email Verification</title>
    <style>
        .background-clr {
            background-color: #292B2F;
        }
        .card-clr {
            background-color: #2F3136;
        }
        #btn_verify {
            display: inline-block;
            background-color: #5865F2;
            color: #FFFFFF;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
        }
        #btn_verify:hover {
            background-color: #4A53BC;
            color: #FFFFFF;
        }
        h1, p {
            color: #FFFFFF;
        }
        .email-container {
            max-width: 600px;
            margin: 100px auto;
            padding: 50px;
        }
        .body-container {
            padding: 50px;
        }
    </style>
</head>
<body class="background-clr body-container" style="font-family: Arial, sans-serif;">
    <table class="card-clr email-container">
        <tr>
            <td style="text-align: center;">
                <h1>Email Verification</h1>
                <p>Please click the button below to verify your email address.</p>
                <a href="{email_verify_url}" id="btn_verify">Verify Email</a>
            </td>
        </tr>
    </table>
</body>
</html>
"""
