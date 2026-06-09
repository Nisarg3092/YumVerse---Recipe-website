const resetPasswordTemplate = (resetToken, username) => {
    const subject = `Reset Your Password - YumVerse`;
    const emailHtml = `
    <div style="
        max-width: 600px;
        margin: auto;
        padding: 30px;
        font-family: Arial, sans-serif;
        border: 1px solid #e5e5e5;
        border-radius: 12px;
    ">

        <h2 style="
            color: #222;
            margin-bottom: 20px;
        ">
            Reset Your Password
        </h2>

        <p>
            Hello ${username},
        </p>

        <p>
            We received a request to reset your password.
        </p>

        <p>
            Since YumVerse is currently API-only, use the token below in the
            Reset Password endpoint.
        </p>

        <div style="
            background-color: #f4f4f5;
            border: 1px solid #d4d4d8;
            border-radius: 8px;
            padding: 16px;
            margin: 25px 0;
            word-break: break-all;
            font-family: monospace;
        ">
            ${resetToken}
        </div>

        <p>
            Endpoint:
        </p>

        <div style="
            background-color: #f9fafb;
            border-left: 4px solid #2563eb;
            padding: 12px;
            margin-bottom: 20px;
            font-family: monospace;
        ">
            POST /api/v1/auth/reset-password/:token
        </div>

        <p>
            This token will expire in 10 minutes.
        </p>

        <p>
            If you did not request a password reset,
            you can safely ignore this email.
        </p>

        <br>

        <p>
            Regards,<br>
            YumVerse Team
        </p>

    </div>

    `;

    return { subject, emailHtml };
};

module.exports = resetPasswordTemplate;