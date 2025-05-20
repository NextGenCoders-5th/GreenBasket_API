import { User } from '@prisma/client';

export function GetResetPassEmailHtmlTemplate({
  user,
  resetUrl,
  appName,
}: {
  user: User;
  resetUrl: string;
  appName: string;
}) {
  return `
      <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Password Reset Request</title>
            <style media="all" type="text/css">
              /* Global Resets */
              body {
                font-family: Helvetica, sans-serif;
                -webkit-font-smoothing: antialiased;
                font-size: 16px;
                line-height: 1.3;
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                background-color: #f4f5f6;
                margin: 0;
                padding: 0;
              }

              table {
                border-collapse: separate;
                width: 100%;
              }

              table td {
                font-family: Helvetica, sans-serif;
                font-size: 16px;
                vertical-align: top;
              }

              .container {
                margin: 0 auto;
                max-width: 600px;
                padding: 24px 0;
              }

              .content {
                margin: 0 auto;
                max-width: 600px;
                padding: 0;
              }

              .main {
                background: #ffffff;
                border: 1px solid #eaebed;
                border-radius: 16px;
                padding: 24px;
                width: 100%;
              }

              p {
                font-size: 16px;
                margin: 0 0 16px;
              }

              a {
                color: #0867ec;
                text-decoration: underline;
              }

              .btn-primary a {
                background-color: #0867ec;
                border: solid 2px #0867ec;
                border-radius: 4px;
                color: #ffffff;
                display: inline-block;
                font-size: 16px;
                font-weight: bold;
                padding: 12px 24px;
                text-decoration: none;
              }

              @media only screen and (max-width: 640px) {
                .main {
                  border-radius: 0 !important;
                }
              }
            </style>
          </head>
          <body>
            <table role="presentation" class="body">
              <tr>
                <td></td>
                <td class="container">
                  <div class="content">
                    <table role="presentation" class="main">
                      <tr>
                        <td class="wrapper">
                          <p>Dear ${user.first_name} ${user.last_name},</p>
                          <p>
                            We received a request to reset your password for your account at <strong>${appName}</strong>.
                          </p>
                          <p>
                            To reset your password, please click the button below. This
                            link will expire in 10 minutes for your security.
                          </p>
                          <table role="presentation" class="btn btn-primary">
                            <tr>
                              <td>
                                <a
                                  href="${resetUrl}"
                                  target="_blank"
                                  >Reset My Password</a
                                >
                              </td>
                            </tr>
                          </table>
                          <p>
                            If you did not request a password reset, please disregard
                            this email. Your account is safe, and no action is needed.
                          </p>
                          <p>
                            For any questions or assistance, feel free to reach out to
                            our support team. We're here to help!
                          </p>
                           <p>${appName}</p> 
                        </td>
                      </tr>
                    </table>
                    <!-- START FOOTER -->
                    <div class="footer">
                      <table
                        role="presentation"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td class="content-block">
                            <span class="apple-link"></span>
                          </td>
                        </tr>
                        <tr>
                          <td class="content-block powered-by"></td>
                        </tr>
                      </table>
                    </div>

                    <!-- END FOOTER -->

                    <!-- END CENTERED WHITE CONTAINER -->
                  </div>
                </td>
                <td>&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
`;
}
