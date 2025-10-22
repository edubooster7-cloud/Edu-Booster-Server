const otp_template = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Edu Booster - Code OTP</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%">
          <tbody>
            <tr style="height: 0">
              <td>
                <img
                  alt="Logo Edu Booster"
                  src="https://res.cloudinary.com/dp9aciyww/image/upload/v1758662697/logo_ndetpj.png"
                  height="120px"
                />
              </td>
              <td style="text-align: right">
                <span style="font-size: 16px; line-height: 30px; color: #ffffff"
                  >{{date}}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Votre code OTP
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Bonjour {{firstName}} {{lastName}},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Merci d’avoir choisi <b>Edu Booster</b>. Utilisez le code OTP
              ci-dessous pour finaliser votre processus de vérification. Ce code
              est valable pendant
              <span style="font-weight: 600; color: #1f1f1f">15 minutes</span>.
              Ne partagez jamais ce code avec qui que ce soit, même pas avec le
              personnel d’Edu Booster.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
              {{otp}}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Besoin d’aide ? Contactez-nous à
          <a
            href="mailto:edubooster7@gmail.com"
            style="color: #499fb6; text-decoration: none"
            >edubooster7@gmail.com</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          Edu Booster
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343">
          Goma, RD Congo.
        </p>
        <div style="margin: 0; margin-top: 16px">
          <a href="#" target="_blank" style="display: inline-block">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343">
          Copyright © 2025 Edu Booster. Tous droits réservés.
        </p>
      </footer>
    </div>
  </body>
</html>
`;

const login_template = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <title>EduBooster – Nouvelle connexion</title>
  </head>
  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f6f8;
      font-family: Poppins, Arial, sans-serif;
    "
  >
    <table
      align="center"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="
        max-width: 680px;
        background: #ffffff;
        border: 1px solid #e6e9ee;
        border-radius: 6px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      "
    >
      <!-- Logo -->
      <tr>
        <td align="center" style="padding: 20px">
          <img
            src="https://res.cloudinary.com/dp9aciyww/image/upload/v1758662697/logo_ndetpj.png"
            alt="EduBooster"
            height="120"
          />
        </td>
      </tr>

      <!-- Titre -->
      <tr>
        <td
          align="center"
          style="
            padding: 10px 20px;
            font-size: 20px;
            font-weight: 600;
            color: #111827;
          "
        >
          Nouvelle connexion à votre compte
        </td>
      </tr>

      <!-- Email -->
      <tr>
        <td
          align="center"
          style="
            padding: 12px 20px;
            border-top: 1px solid #e6e9ee;
            border-bottom: 1px solid #e6e9ee;
          "
        >
          <div
            style="
              display: inline-block;
              vertical-align: middle;
              margin-left: 10px;
              text-align: left;
            "
          >
            <div style="font-size: 15px; font-weight: 600; color: #111827">
              {{EMAIL_UTILISATEUR}}
            </div>
          </div>
        </td>
      </tr>

      <!-- Message principal -->
      <tr>
        <td
          align="center"
          style="
            padding: 20px;
            font-size: 14px;
            color: #111827;
            line-height: 1.5;
          "
        >
          Nous avons remarqué une nouvelle connexion à votre compte EduBooster.
          Si c’était bien vous, vous n’avez rien à faire. Sinon, nous allons
          vous aider à sécuriser votre compte.
        </td>
      </tr>

      <!-- Heure et localisation -->
      <tr>
        <td align="center" style="padding: 10px 20px">
          <table
            cellspacing="0"
            cellpadding="0"
            style="
              background: #fbfcfe;
              border: 1px dashed #e1e6f2;
              border-radius: 6px;
              padding: 10px 14px;
            "
          >
            <tr>
              <td align="center" style="font-size: 13px; color: #111827">
                Connecté le <b>{{HEURE_CONNEXION}}</b><br />
                Localisation : <b>{{LIEU_CONNEXION}}</b>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Bouton -->
      <tr>
        <td align="center" style="padding: 20px">
          <a
            href="{{LIEN_SECURITE}}"
            target="_blank"
            style="
              background: #1a73e8;
              color: #ffffff;
              text-decoration: none;
              padding: 10px 22px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 14px;
              display: inline-block;
            "
          >
            Vérifier l’activité
          </a>
        </td>
      </tr>

      <!-- Lien alternatif -->
      <tr>
        <td
          align="center"
          style="font-size: 12px; color: #6b7280; padding: 10px 20px"
        >
          Vous pouvez également consulter l’activité de sécurité sur <br />
          {{LIEN_SECURITE}}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td
          align="center"
          style="
            font-size: 12px;
            color: #6b7280;
            padding: 20px;
            border-top: 1px solid #e6e9ee;
          "
        >
          Vous recevez cet e-mail afin d’être informé des changements importants
          concernant votre compte EduBooster et nos services.<br />
          © 2025 EduBooster, Tous droits réservés.
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const forgot_password = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Edu Booster - Réinitialisation du mot de passe</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%">
          <tbody>
            <tr style="height: 0">
              <td>
                <img
                  alt="Logo Edu Booster"
                  src="https://res.cloudinary.com/dp9aciyww/image/upload/v1758662697/logo_ndetpj.png"
                  height="120px"
                />
              </td>
              <td style="text-align: right">
                <span style="font-size: 16px; line-height: 30px; color: #ffffff"
                  >{{date}}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Réinitialisation du mot de passe
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Bonjour {{firstName}} {{lastName}},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Vous avez demandé à réinitialiser votre mot de passe pour accéder
              à <b>Edu Booster</b>. Utilisez le code ci-dessous pour continuer le
              processus de réinitialisation. Ce code est valable pendant
              <span style="font-weight: 600; color: #1f1f1f">15 minutes</span>.
              <br /><br />
              Si vous n’êtes pas à l’origine de cette demande, ignorez
              simplement cet email.
            </p>

            <p
              style="
                margin: 0;
                margin-top: 60px;
                font-size: 40px;
                font-weight: 600;
                letter-spacing: 25px;
                color: #ba3d4f;
              "
            >
              {{otp}}
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Besoin d’aide ? Contactez-nous à
          <a
            href="mailto:edubooster7@gmail.com"
            style="color: #499fb6; text-decoration: none"
            >edubooster7@gmail.com</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          Edu Booster
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343">
          Goma, RD Congo.
        </p>
        <div style="margin: 0; margin-top: 16px">
          <a href="#" target="_blank" style="display: inline-block">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343">
          Copyright © 2025 Edu Booster. Tous droits réservés.
        </p>
      </footer>
    </div>
  </body>
</html>
`;

const reset_password = `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Edu Booster - Mot de passe réinitialisé</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: #f4f7ff;
        background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
        background-repeat: no-repeat;
        background-size: 800px 452px;
        background-position: top center;
        font-size: 14px;
        color: #434343;
      "
    >
      <header>
        <table style="width: 100%">
          <tbody>
            <tr style="height: 0">
              <td>
                <img
                  alt="Logo Edu Booster"
                  src="https://res.cloudinary.com/dp9aciyww/image/upload/v1758662697/logo_ndetpj.png"
                  height="120px"
                />
              </td>
              <td style="text-align: right">
                <span style="font-size: 16px; line-height: 30px; color: #ffffff"
                  >{{date}}</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <main>
        <div
          style="
            margin: 0;
            margin-top: 70px;
            padding: 92px 30px 115px;
            background: #ffffff;
            border-radius: 30px;
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 500;
                color: #1f1f1f;
              "
            >
              Mot de passe réinitialisé
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-size: 16px;
                font-weight: 500;
              "
            >
              Bonjour {{firstName}} {{lastName}},
            </p>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 500;
                letter-spacing: 0.56px;
              "
            >
              Nous vous confirmons que le mot de passe de votre compte
              <b>Edu Booster</b> a été réinitialisé avec succès.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 20px;
                font-size: 15px;
                color: #555555;
              "
            >
              Si vous êtes à l’origine de cette action, aucune autre démarche n’est nécessaire.  
              <br /><br />
              Si vous n’êtes pas à l’origine de cette réinitialisation, veuillez
              <b>contacter immédiatement notre support</b> afin de sécuriser
              votre compte.
            </p>
          </div>
        </div>

        <p
          style="
            max-width: 400px;
            margin: 0 auto;
            margin-top: 90px;
            text-align: center;
            font-weight: 500;
            color: #8c8c8c;
          "
        >
          Besoin d’aide ? Contactez-nous à
          <a
            href="mailto:edubooster7@gmail.com"
            style="color: #499fb6; text-decoration: none"
            >edubooster7@gmail.com</a
          >
        </p>
      </main>

      <footer
        style="
          width: 100%;
          max-width: 490px;
          margin: 20px auto 0;
          text-align: center;
          border-top: 1px solid #e6ebf1;
        "
      >
        <p
          style="
            margin: 0;
            margin-top: 40px;
            font-size: 16px;
            font-weight: 600;
            color: #434343;
          "
        >
          Edu Booster
        </p>
        <p style="margin: 0; margin-top: 8px; color: #434343">
          Goma, RD Congo.
        </p>
        <div style="margin: 0; margin-top: 16px">
          <a href="#" target="_blank" style="display: inline-block">
            <img
              width="36px"
              alt="Facebook"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Instagram"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
          /></a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Twitter"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
            />
          </a>
          <a
            href="#"
            target="_blank"
            style="display: inline-block; margin-left: 8px"
          >
            <img
              width="36px"
              alt="Youtube"
              src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
          /></a>
        </div>
        <p style="margin: 0; margin-top: 16px; color: #434343">
          Copyright © 2025 Edu Booster. Tous droits réservés.
        </p>
      </footer>
    </div>
  </body>
</html>
`;

module.exports = {
  otp_template,
  login_template,
  forgot_password,
  reset_password,
};
