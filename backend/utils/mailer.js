const nodemailer = require('nodemailer');

function createTransporter() {
	if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
		return null;
	}

	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS
		}
	});
}

async function sendVerificationEmail(to, code) {
	const subject = 'DevQ&A verification code';
	const text = `Your code is ${code}. It expires in 10 minutes.`;
	const html = `
		<div style="font-family:Arial,sans-serif;max-width:420px;margin:0 auto;">
		    <div style="font-family:Arial,sans-serif;padding:24px;">
		        <div style="max-width:400px;margin:0 auto;overflow:hidden;">
		            <div style="color:#6366f1;padding:16px 20px;font-weight:700;font-size:25px;">
		                DevQ&A
		            </div>
		            <div style="padding:20px;">
		                <p style="margin:0 0 12px;color:#374151;">Your verification code:</p>
		                <div style="background:#eef2ff;border-radius:10px;padding:14px;text-align:center;font-size:28px;font-weight:700;letter-spacing:6px;color:#4338ca;">
		                    ${code}
		                </div>
		                <p style="margin:14px 0 0;color:#9ca3af;font-size:12px;">Expires in 10 minutes.</p>
		            </div>
		        </div>
		    </div>
		</div>
	`;

	const transporter = createTransporter();

	if (!transporter) {
		console.log(`[DEV] Verification code for ${to}: ${code}`);
		return {
			sent: false,
			logged: true
		};
	}

	await transporter.sendMail({
		from: `"DevQ&A" <${process.env.EMAIL_USER}>`,
		to,
		subject,
		text,
		html
	});

	return {
		sent: true
	};
}

module.exports = {
	sendVerificationEmail
};