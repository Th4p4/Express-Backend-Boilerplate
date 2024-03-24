interface EmailProps {
  appName?: string;
  supportEmail?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  copyrightDate?: any;
  confirmEmailLink?: string;
  type?: string;
}

export const newAccountMail = ({ appName, copyrightDate, confirmEmailLink }: EmailProps) => {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
    <link
      href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
      rel="stylesheet"
    />
    <style>
      .wrapper {
        width: 100%;
        background-color: #e3f6f5;
        margin-bottom: 20px;
        flex-direction: column;
        margin : auto;
      }

      .heading {
        color: #3b361c;
        width: 100%;
        text-align: center;
        font-family: Lexend;
        font-size: 30px;
        font-style: normal;
        font-weight: bold;
        line-height: 138.5%;
      }

      .header {
        color: #3b361c;
        text-align: center;
        font-family: Bebas Neue;
        font-size: 30px;
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
      }

      .subHeader {
        line-height: 120%;
        font-family: Poppins;
        font-size: 15px;
        font-weight: 500;
        letter-spacing: -0.195px;
      }

      .contentBoxWrapper {
        background: #e3f6f5;
        width: 500px;
        display: flex;
        align-self: center;
        margin: auto;
        align-items: center;
        justify-content: center;
        padding: 1px;
      }

      .contentBox {
        border-radius: 5px;
      }

      .contentBoxHeader {
        color: #3b361c;
        text-align: center;
        font-family: Poppins;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 120%;
        letter-spacing: -0.24px;
      }

      .contentBoxSubHeader {
        font-size: 13px;
        font-weight: 500;
        letter-spacing: -0.195px;
      }

      .textRight {
        font-weight: 700;
        text-decoration-line: underline;
      }

      .socialIcon {
        background-color: #e3f6f5;
        border-radius: 100%;
        width: 30px;
        height: 25px;
        display: inline;
        text-align:center;
        padding:5px 12px;
      }
    </style>

  </head>
  <body>
    <div style="width: 100%">
      <h4 style="color: #3b361c;
        width: 100%;
        text-align: center;
        font-family: Bebas Neue;
        font-size: 30px;
        font-style: normal;
        font-weight: 500;
        line-height: 138.5%;">
        LOGO
      </h4>

      <div style="width: 80%; background-color: #E3F6F5; padding: 15px; margin: auto">
        <div style="width: 150px; margin: auto">
          <img src="cid:accountCreatedTick" alt="Embedded Image" width="100px" height="95px">
        </div>

        <p
          style="color: rgba(59, 54, 28, 0.65);
          text-align: center;
          font-family: Poppins;
          font-size: 15px;
          font-style: normal;
          font-weight: 700;
          line-height: 130%;
          letter-spacing: -0.36px;"
        >
        CONGRATULATIONS!
        </p>

        <p
          style="color: #3B361C;
          text-align: center;
          font-family: Bebas Neue;
          font-size: 25px;
          font-style: normal;
          font-weight: 400;
          line-height: 130%";
        >
        Welcome to ${appName}!
        </p>
      </div>

      <p
        style="color: #3B361C;
        text-align: center;
        font-family: Poppins;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 110%;
        letter-spacing: -0.195px;
        padding-bottom:20px;
        width: 60%;
        margin: auto;
        margin-top: 30px;"
      >
        Welcome to
        <span style="color: #FFD803;
        font-family: Poppins;
        font-size: 18px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        letter-spacing: -0.21px;"> ${appName}! </span>
        Your account has been created successfully.
      </p>

      <div style="width:100%; margin-top:15px; margin-bottom: 15px;">
        <h1 style="width:60%; margin: auto; color: #3B361C; align-self: center; align-items: center;  padding-top: 15px; padding-bottom:15px; padding-left:20px; padding-right:20px; text-align: center; font-family: Poppins; font-size: 20px; font-style: normal; font-weight: 600; line-height: 130%; letter-spacing: -0.537px; background-color:#FFD803; border-radius:10px; cursor: pointer; border: none;">
        <a  href=${confirmEmailLink}>Confirm Your Email!</a>
        </h1>
      </div>

      <p
      style="color: #3B361C;
      text-align: center;
      font-family: Poppins;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 110%;
      letter-spacing: -0.195px;
      padding-bottom:20px;
      width: 60%;
      margin: auto;
      margin-top: 30px;"
      >
      Start your journey with us now and experience the excitement of winning! If you have any questions or need assistance, our support team is here to help.
      </p>
      <p
      style="color: #3B361C;
      text-align: center;
      font-family: Poppins;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 110%;
      letter-spacing: -0.195px;
      padding-bottom:20px;
      width: 60%;
      margin: auto;
      margin-top: 30px;"
      >
      All the best,
      </p>

      <p style="color: #3b361c;
      text-align: center;
      font-family: Lexend;
      font-size: 25px;
      width: 20%;
      font-style: normal;
      font-weight: bold;
      line-height: 138.5%;
      border-bottom: 1.5px solid #3b361c;
      padding-bottom: 30px;
      margin: auto;"
      >
      ${appName} Team
      </p>


          <div
          style="width: 100%; padding: 40px;"
          >
            <h4
            style="font-size: 18px;
            font-style: normal;
            font-weight: 500;
            line-height: 110%;
            color: #3b361c;
            cursor: pointer;
            text-align: center;
            font-family: Poppins;
            width: 50%;
            margin: auto;"
            >
            © ${copyrightDate}. All Rights Reserved.
            </h4>
          </div>
      </div>
    </div>
  </body>
</html>`;
};
