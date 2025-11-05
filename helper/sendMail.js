import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "jontypundir12@gmail.com",
    pass: "kcnlafkyzgvwibyq", // Use environment variables for security
  },
});


export const sendMail = async (email, otp, subject = "Your OTP Code", message = "Use the following OTP to verify your account:") => {
  try {
    const mailOptions = {
      from: '"PetKo Support" ',
      to: email,
      subject,
     html: `
  <div style="background-color:#f4f4f4; padding:40px 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width:480px; background:white; margin:auto; border-radius:10px; padding:30px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="text-align:center; color:#f58f80; margin-bottom:10px;">${subject}</h2>
      <p style="text-align:center; color:#555; font-size:15px; margin-bottom:25px;">
        ${message}
      </p>

      <div style="text-align:center; margin-bottom:25px;">
        <div style="display:inline-block; background:#f58f80; color:#fff; font-size:24px; letter-spacing:4px; font-weight:bold; padding:12px 25px; border-radius:8px;">
          ${otp}
        </div>
      </div>

      <p style="text-align:center; font-size:13px; color:#888;">
        This OTP will expire in <strong>5 minutes</strong>.<br>
        If you didn’t request this code, please ignore this email.
      </p>

      <hr style="border:none; border-top:1px solid #eee; margin:30px 0;">

      <p style="text-align:center; font-size:12px; color:#aaa;">
        © ${new Date().getFullYear()} PetKo. All rights reserved.
      </p>
    </div>
  </div>
`

    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };
  } catch (error) {
    console.error("Error sending email: ", error);
    return { success: false, error };
  }
};
