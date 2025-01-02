"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendResetEmail = (email, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password for VR_DATING',
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2 style="color: #333;">Hello!</h2>
      <p>We received a request to reset your password for your <strong>VR_DATING</strong> account. No worries, we’ve got you covered!</p>
      <p>To reset your password, click the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" 
          style="background-color: #ffbe00; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset My Password
        </a>
      </div>
      <p>If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
      <p>For any issues or help, feel free to contact us at <a href="mailto:support@vr_dating.com">support@vr_dating.com</a>.</p>
      <p>Thanks,<br/>The <strong>VR_DATING</strong> Team</p>
      <hr />
      <small style="color: #888;">If the button doesn't work, copy and paste the following link into your browser:</small><br />
      <a href="${resetLink}" style="color: #ffbe00;">${resetLink}</a>
    </div>
    `,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendResetEmail = sendResetEmail;
