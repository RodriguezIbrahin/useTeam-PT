require("dotenv").config();
const nodemailer = require("nodemailer");

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // true si usás 465
    auth: process.env.MAIL_USER
      ? { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
      : undefined,
  });

  const info = await transporter.sendMail({
    from: '"useTeam" <no-reply@useteam.local>',
    to: "test@example.com",
    subject: "Prueba de correo - useTeam",
    text: "Este correo es una prueba desde nodemailer + Mailtrap/smtp4dev",
    html: "<b>Prueba de correo</b>",
  });

  console.log("Message sent:", info);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
