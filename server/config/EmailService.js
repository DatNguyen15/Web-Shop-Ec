const nodemailer = require("nodemailer");

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      pool: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      secure: true,
    });
  }
  async sendMail(from, to, subject, html) {
    return await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}

module.exports = EmailService;
