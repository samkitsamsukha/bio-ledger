import nodemailer from "nodemailer";

export const sendAlertMail = async ({
	recipients,
	labName,
	alertMessage,
	timestamp,
}) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		secure: true, // use TLS
		port: 465, // port for secure SMTP
		auth: {
			user: "samkitsamsukha@gmail.com", // sender email
			pass: "xzwgvmwakujixmlr", // app password
		},
	});

	try {
		const mailOptions = {
			from: `BioLedger Lab Safety <${process.env.ALERT_EMAIL}>`,
			to: recipients, // array or comma-separated string
			subject: `🚨 Hazard Alert ${labName}`,
			html: `
        <div style="
  max-width: 600px;
  margin: 40px auto;
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border: 1px solid #e0e0e0;
">
  <!-- Header -->
  <div style="
    background: linear-gradient(90deg, #e3342f 0%, #c53030 100%);
    color: #fff;
    padding: 20px 30px;
    text-align: center;
  ">
    <h2 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">
      ⚠️ URGENT BIOSAFETY ALERT
    </h2>
  </div>

  <!-- Body -->
  <div style="padding: 30px; color: #333;">
    <p style="margin: 0 0 12px;"><strong>🔬 Lab Name:</strong> ${labName}</p>
    <p style="margin: 0 0 20px;"><strong>⏰ Time:</strong> ${new Date(
			timestamp
		).toLocaleString()}</p>

    <!-- Alert Box -->
    <div style="
      background-color: #fffbea;
      border-left: 5px solid #ffc107;
      padding: 18px 20px;
      border-radius: 6px;
      margin-bottom: 25px;
    ">
      <p style="margin: 0; font-weight: 600; color: #856404;">🚨 Alert Message:</p>
      <p style="margin-top: 10px; color: #5f4b00; line-height: 1.6;">
        ${alertMessage}
      </p>
    </div>

    <!-- Info Note -->
    <p style="font-size: 14px; color: #555; line-height: 1.5;">
      This is an automated notification from <strong>BioLedger's Lab Safety System</strong>.
      Immediate action is required to ensure biosafety protocols are followed.
    </p>
  </div>

  <!-- Footer -->
  <div style="
    background: #f5f5f5;
    text-align: center;
    padding: 18px;
    font-size: 12px;
    color: #999;
    border-top: 1px solid #e0e0e0;
  ">
    &copy; ${new Date().getFullYear()} <strong>BioLedger Labs</strong>. All rights reserved.
  </div>
</div>

      `,
		};

		await transporter.sendMail(mailOptions);
	} catch (error) {
		console.error("Error sending email:", error);
		throw error; // Re-throw the error to be caught in the route handler
	}
};
