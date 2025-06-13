import nodemailer from 'nodemailer';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { nom, email, societe, message } = JSON.parse(event.body);

    if (!nom || !email || !message) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Veuillez remplir tous les champs requis.' }) };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // S
      port: process.env.SMTP_PORT || 587,
      secure: false, // Utiliser TLS (STARTTLS) sur le port 587
      auth: {
        user: process.env.SMTP_USER, // S
        pass: process.env.SMTP_PASSWORD, // S
      },
    });

    const mailOptions = {
      from: email, // L'adresse e-mail de l'expéditeur (celle entrée dans le formulaire)
      to: process.env.RECIPIENT_EMAIL, // Votre adresse Gmail (Smartmtecofficial@gmail.com)
      subject: `Nouveau message de contact de ${nom}`,
      html: `
        <p><strong>Nom:</strong> ${nom}</p>
        ${societe ? `<p><strong>Société:</strong> ${societe}</p>` : ''}
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message envoyé:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Votre message a été envoyé avec succès !' }),
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'e-mail (SMTP avec Brevo):', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Une erreur s\'est produite lors de l\'envoi de l\'e-mail. Veuillez réessayer plus tard.' }),
    };
  }
}