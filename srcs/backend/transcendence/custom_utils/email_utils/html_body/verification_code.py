verification_code_html = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verification Code</title>
    <style>
        .background-clr {
            background-color: #292B2F;
        }
        .card-clr {
            background-color: #2F3136;
        }
        #code_box {
            background-color: #66c0f4;
            color: #FFFFFF;
            border-radius: 10px;
            padding: 10px;
            font-size: 30px;
            display: inline-block;
            margin: 30px 0px 30px 0px;
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
                <h1>Verification Code</h1>
                <p>Use the following code to verify your account:</p>
                <div id="code_box">{verification_code}</div>
                <p style="margin-top: 20px;">This code will expire in 5 minutes.</p>
                <p>If you didn't request this code, you can safely ignore this email.</p>
            </td>
        </tr>
    </table>
</body>
</html>
"""
