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
            Click the button below to create a new password.
        </p>

        <div style="
            text-align: center;
            margin: 35px 0;
        ">

            <a 
                href="http://localhost:3000/api/v1/auth/reset-password/${resetToken}"
                style="
                    background-color: #2563eb;
                    color: white;
                    padding: 14px 28px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                    display: inline-block;
                "
            >
                Reset Password
            </a>

        </div>

        <p>
            This link will expire in 10 minutes.
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