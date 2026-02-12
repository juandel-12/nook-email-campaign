// Email template utility for rendering email previews
// Handles template storage, variable substitution, and HTML rendering

import DOMPurify from 'dompurify';

export const DEFAULT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Nook Video Delivery</title>
    <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style type="text/css">
    table { border-collapse: collapse; }
    .mso-button { padding: 8px 10px; }
    .mso-button-lg { padding: 12px 30px; }
  </style>
  <![endif]-->
    <style type="text/css">
        /* Reset */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: #263238;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        @media only screen and (max-width: 540px) {
            .email-container {
                width: 100% !important;
            }

            .fluid-img {
                width: 100% !important;
                height: auto !important;
            }

            .mobile-pad {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }
        }
    </style>
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
    <link href="/campaign/stripo/css/custom.css?v=647288" rel="stylesheet" type="text/css">
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
    <!--<![endif]-->
</head>

<body style="margin: 0; padding: 0; background-color: #263238;">
    <!-- Hidden preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #263238;" class="esd-text">{{PREVIEW_TEXT}}</div><!-- Full-width wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #263238;">
        <tbody>
            <tr>
                <td align="center" style="padding: 24px 12px;">
                    <!-- 500px container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="500" class="email-container" style="max-width: 500px; width: 100%;">
                        <!-- ================================ -->
                        <!--        CONTENT CARD              -->
                        <!-- ================================ -->
                        <tbody>
                            <tr>
                                <td style="padding: 0;">
                                    <!--[if mso]>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="1" width="100%" style="border-color:#b0bec5;">
                                    <tr><td style="background-color:#ffffff;">
                                    <![endif]-->
                                    <div style="border: 1px solid #b0bec5; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                                        <!-- HEADER: Logo + CTA -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad" style="padding: 24px 24px 24px 24px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" valign="middle" width="60">
                                                                        <a><img src="https://builtwithnook.activehosted.com/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png?id=386246" alt="Nook" width="60" style="display: block; width: 60px; height: auto;" data-cf-ir-is-resized="true" data-cf-ir-should-resize-image="true" srcset="https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=1/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 1x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=2/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 2x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=3/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 3x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=4/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 4x" data-cf-ir-no-srcset="true"></a>
                                                                    </td>
                                                                    <td align="right" valign="middle">
                                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display: inline-table;">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 26px; color: #222222; letter-spacing: 0.15px; padding-right: 12px; white-space: nowrap;" class="esd-text"> Ready to get started? </td>
                                                                                    <td><a href="https://builtwithnook.com/contact" target="_blank" style="display: inline-block; background-color: #263238; color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; line-height: 16px; text-align: center; text-decoration: none; padding: 8px 10px; border-radius: 4px; -webkit-text-size-adjust: none;">
                                                                                            <!--[if mso]>&nbsp;<![endif]-->Contact Sales
                                                                                            <!--[if mso]>&nbsp;<![endif]-->
                                                                                        </a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad" style="padding: 0 24px;"><a href="%%VIDEO_URL%%" target="_blank" style="display: block; text-decoration: none; border: 1px solid #cfd8dc; border-radius: 8px; overflow: hidden;">
                                                            <img src="{{IMAGE_URL}}" alt="Watch the Nook video" width="452" class="fluid-img" style="display: block; width: 100%; max-width: 452px; height: auto; border-radius: 8px;">
                                                        </a></td>
                                                </tr>
                                            </tbody>
                                        </table><!-- BODY COPY -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad esd-text" style="padding: 12px 24px 24px 24px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #222222; letter-spacing: 0.15px;">{{EMAIL_BODY}}</td>
                                                </tr>
                                            </tbody>
                                        </table><!-- DIVIDER -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="font-size: 1px; line-height: 1px; height: 1px; background-color: #cfd8dc;" class="esd-text">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso]>
                                    </td></tr></table>
                                    <![endif]-->
                                </td>
                            </tr><!-- Spacer between card and footer -->
                            <tr>
                                <td style="height: 48px; font-size: 1px; line-height: 1px;" class="esd-text"><br></td>
                            </tr><!-- ================================ -->
                            <!--           FOOTER                 -->
                            <!-- ================================ -->
                            <tr>
                                <td>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <!-- Footer Logo -->
                                        <tbody>
                                            <tr>
                                                <td align="center" style="padding-bottom: 10px;">
                                                    <a><img src="https://builtwithnook.activehosted.com/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png?id=386388" alt="Nook" width="55" style="display: block; width: 55px; height: auto;" data-cf-ir-is-resized="true" data-cf-ir-should-resize-image="true" srcset="https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=1/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 1x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=2/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 2x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=3/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 3x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=4/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 4x" data-cf-ir-no-srcset="true"></a>
                                                </td>
                                            </tr><!-- Powered By -->
                                            <tr>
                                                <td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; line-height: 26px; color: #ffffff; letter-spacing: 0.15px; padding-bottom: 12px;" class="esd-text">Powered By Nook</td>
                                            </tr><!-- Address -->
                                            <tr>
                                                <td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 26px; color: #ffffff; letter-spacing: 0.15px; padding-bottom: 12px;" class="esd-text">3692 Grand Ave #304, Miami, FL 33133</td>
                                            </tr><!-- Legal links -->
                                            <tr>
                                                <td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 26px; color: #ffffff; letter-spacing: 0.15px;" class="esd-text"><a href="https://builtwithnook.com/terms" target="_blank" style="color: #ffffff; text-decoration: none;">Terms of Service</a> &nbsp;&nbsp;&nbsp;&nbsp; <a href="https://builtwithnook.com/privacy" target="_blank" style="color: #ffffff; text-decoration: none;">Privacy Policy</a></td>
                                            </tr><!-- Unsubscribe (ActiveCampaign required) -->
                                            <tr>
                                                <td align="center" style="padding-top: 16px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 20px; color: #ffffff;"><a href="%UNSUBSCRIBELINK%" style="color: #ffffff; text-decoration: underline;">Unsubscribe</a></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table><!-- /email-container -->
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;

// Plain text template: no video thumbnail image, just preview text + body + footer
export const PLAIN_TEXT_TEMPLATE = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Nook Video Delivery</title>
    <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style type="text/css">
    table { border-collapse: collapse; }
    .mso-button { padding: 8px 10px; }
    .mso-button-lg { padding: 12px 30px; }
  </style>
  <![endif]-->
    <style type="text/css">
        /* Reset */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: #263238;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        @media only screen and (max-width: 540px) {
            .email-container {
                width: 100% !important;
            }

            .fluid-img {
                width: 100% !important;
                height: auto !important;
            }

            .mobile-pad {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }
        }
    </style>
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
    <link href="/campaign/stripo/css/custom.css?v=647288" rel="stylesheet" type="text/css">
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
    <!--<![endif]-->
</head>

<body style="margin: 0; padding: 0; background-color: #263238;">
    <!-- Hidden preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #263238;" class="esd-text">{{PREVIEW_TEXT}}</div><!-- Full-width wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #263238;">
        <tbody>
            <tr>
                <td align="center" style="padding: 24px 12px;">
                    <!-- 500px container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="500" class="email-container" style="max-width: 500px; width: 100%;">
                        <!-- ================================ -->
                        <!--        CONTENT CARD              -->
                        <!-- ================================ -->
                        <tbody>
                            <tr>
                                <td style="padding: 0;">
                                    <!--[if mso]>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="1" width="100%" style="border-color:#b0bec5;">
                                    <tr><td style="background-color:#ffffff;">
                                    <![endif]-->
                                    <div style="border: 1px solid #b0bec5; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                                        <!-- HEADER: Logo + CTA -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad" style="padding: 24px 24px 24px 24px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" valign="middle" width="60">
                                                                        <a><img src="https://builtwithnook.activehosted.com/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png?id=386246" alt="Nook" width="60" style="display: block; width: 60px; height: auto;" data-cf-ir-is-resized="true" data-cf-ir-should-resize-image="true" srcset="https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=1/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 1x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=2/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 2x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=3/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 3x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=4/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 4x" data-cf-ir-no-srcset="true"></a>
                                                                    </td>
                                                                    <td align="right" valign="middle">
                                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display: inline-table;">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 26px; color: #222222; letter-spacing: 0.15px; padding-right: 12px; white-space: nowrap;" class="esd-text"> Ready to get started? </td>
                                                                                    <td><a href="https://builtwithnook.com/contact" target="_blank" style="display: inline-block; background-color: #263238; color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; line-height: 16px; text-align: center; text-decoration: none; padding: 8px 10px; border-radius: 4px; -webkit-text-size-adjust: none;">
                                                                                            <!--[if mso]>&nbsp;<![endif]-->Contact Sales
                                                                                            <!--[if mso]>&nbsp;<![endif]-->
                                                                                        </a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table><!-- BODY COPY (no image) -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad esd-text" style="padding: 12px 24px 24px 24px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #222222; letter-spacing: 0.15px;">{{EMAIL_BODY}}</td>
                                                </tr>
                                            </tbody>
                                        </table><!-- DIVIDER -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="font-size: 1px; line-height: 1px; height: 1px; background-color: #cfd8dc;" class="esd-text">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso]>
                                    </td></tr></table>
                                    <![endif]-->
                                </td>
                            </tr><!-- Spacer between card and footer -->
                            <tr>
                                <td style="height: 48px; font-size: 1px; line-height: 1px;" class="esd-text"><br></td>
                            </tr><!-- ================================ -->
                            <!--           FOOTER                 -->
                            <!-- ================================ -->
                            <tr>
                                <td>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                        <!-- Footer Logo -->
                                        <tbody>
                                            <tr>
                                                <td align="center" style="padding-bottom: 10px;">
                                                    <a><img src="https://builtwithnook.activehosted.com/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png?id=386388" alt="Nook" width="55" style="display: block; width: 55px; height: auto;" data-cf-ir-is-resized="true" data-cf-ir-should-resize-image="true" srcset="https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=1/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 1x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=2/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 2x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=3/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 3x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,width=55,dpr=4/content/a2e1Ej/2026/02/06/e9b01835-463f-4c7f-ab92-11cb4280c8ad.png 4x" data-cf-ir-no-srcset="true"></a>
                                                </td>
                                            </tr><!-- Powered By -->
                                            <tr>
                                                <td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; font-weight: bold; line-height: 26px; color: #ffffff; letter-spacing: 0.15px; padding-bottom: 12px;" class="esd-text">Powered By Nook</td>
                                            </tr><!-- Address -->
                                            <tr>
                                                <td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 26px; color: #ffffff; letter-spacing: 0.15px; padding-bottom: 12px;" class="esd-text">3692 Grand Ave #304, Miami, FL 33133</td>
                                            </tr><!-- Legal links -->
                                            <tr>
                                                <td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; line-height: 26px; color: #ffffff; letter-spacing: 0.15px;" class="esd-text"><a href="https://builtwithnook.com/terms" target="_blank" style="color: #ffffff; text-decoration: none;">Terms of Service</a> &nbsp;&nbsp;&nbsp;&nbsp; <a href="https://builtwithnook.com/privacy" target="_blank" style="color: #ffffff; text-decoration: none;">Privacy Policy</a></td>
                                            </tr><!-- Unsubscribe (ActiveCampaign required) -->
                                            <tr>
                                                <td align="center" style="padding-top: 16px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 20px; color: #ffffff;"><a href="%UNSUBSCRIBELINK%" style="color: #ffffff; text-decoration: underline;">Unsubscribe</a></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table><!-- /email-container -->
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;

// eslint-disable-next-line no-unused-vars
const _PLACEHOLDER = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Nook Video Delivery</title>
    <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <style type="text/css">
    table { border-collapse: collapse; }
    .mso-button { padding: 8px 10px; }
    .mso-button-lg { padding: 12px 30px; }
  </style>
  <![endif]-->
    <style type="text/css">
        /* Reset */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: #263238;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        @media only screen and (max-width: 540px) {
            .email-container {
                width: 100% !important;
            }

            .fluid-img {
                width: 100% !important;
                height: auto !important;
            }

            .mobile-pad {
                padding-left: 16px !important;
                padding-right: 16px !important;
            }
        }
    </style>
    <!--[if mso]><xml>
    <w:WordDocument xmlns:w="urn:schemas-microsoft-com:office:word">
      <w:DontUseAdvancedTypographyReadingMail/>
    </w:WordDocument>
    </xml><![endif]-->
    <link href="/campaign/stripo/css/custom.css?v=647288" rel="stylesheet" type="text/css">
    <!--[if !mso]><!-- -->
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
    <!--<![endif]-->
</head>

<body style="margin: 0; padding: 0; background-color: #263238;">
    <!-- Hidden preheader -->
    <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; color: #263238;" class="esd-text">{{PREVIEW_TEXT}}</div><!-- Full-width wrapper -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #263238;">
        <tbody>
            <tr>
                <td align="center" style="padding: 24px 12px;">
                    <!-- 500px container -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="500" class="email-container" style="max-width: 500px; width: 100%;">
                        <!-- ================================ -->
                        <!--        CONTENT CARD              -->
                        <!-- ================================ -->
                        <tbody>
                            <tr>
                                <td style="padding: 0;">
                                    <!--[if mso]>
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="1" width="100%" style="border-color:#b0bec5;">
                                    <tr><td style="background-color:#ffffff;">
                                    <![endif]-->
                                    <div style="border: 1px solid #b0bec5; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                                        <!-- HEADER: Logo + CTA -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad" style="padding: 24px 24px 24px 24px;">
                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" valign="middle" width="60">
                                                                        <a><img src="https://builtwithnook.activehosted.com/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png?id=386246" alt="Nook" width="60" style="display: block; width: 60px; height: auto;" data-cf-ir-is-resized="true" data-cf-ir-should-resize-image="true" srcset="https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=1/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 1x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=2/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 2x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=3/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 3x,https://builtwithnook.activehosted.com/cdn-cgi/image/fit=scale-down,format=auto,redirect,width=60,dpr=4/content/a2e1Ej/2026/02/06/7073eb52-614b-4b2f-9117-58029744fafc.png 4x" data-cf-ir-no-srcset="true"></a>
                                                                    </td>
                                                                    <td align="right" valign="middle">
                                                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display: inline-table;">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td style="font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 26px; color: #222222; letter-spacing: 0.15px; padding-right: 12px; white-space: nowrap;" class="esd-text"> Ready to get started? </td>
                                                                                    <td><a href="https://builtwithnook.com/contact" target="_blank" style="display: inline-block; background-color: #263238; color: #ffffff; font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: bold; line-height: 16px; text-align: center; text-decoration: none; padding: 8px 10px; border-radius: 4px; -webkit-text-size-adjust: none;">
                                                                                            <!--[if mso]>&nbsp;<![endif]-->Contact Sales
                                                                                            <!--[if mso]>&nbsp;<![endif]-->
                                                                                        </a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad" style="padding: 0 24px;"><a href="%%VIDEO_URL%%" target="_blank" style="display: block; text-decoration: none; border: 1px solid #cfd8dc; border-radius: 8px; overflow: hidden;">
                                                            <img src="{{IMAGE_URL}}" alt="Watch the Nook video" width="452" class="fluid-img" style="display: block; width: 100%; max-width: 452px; height: auto; border-radius: 8px;">
                                                        </a></td>
                                                </tr>
                                            </tbody>
                                        </table><!-- BODY COPY -->
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td class="mobile-pad esd-text" style="padding: 12px 24px 24px 24px; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #222222; letter-spacing: 0.15px;">{{EMAIL_BODY}}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <!--[if mso]>
                                    </td></tr></table>
                                    <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table><!-- /email-container -->
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`;

// Predefined email templates for the template selector
export const PREDEFINED_TEMPLATES = [
  {
    id: 'video-nurture',
    name: 'Video Nurture',
    description: 'Full template with video thumbnail and footer',
    html: DEFAULT_EMAIL_TEMPLATE
  },
  {
    id: 'plain-text',
    name: 'Plain Text',
    description: 'Simple email with body text only, no image',
    html: PLAIN_TEXT_TEMPLATE
  }
];

// Default video thumbnail image URL (used when no per-variant image is set)
export const DEFAULT_IMAGE = 'https://builtwithnook.activehosted.com/content/a2e1Ej/2026/02/06/41daa6c8-92b0-41c5-aa5b-fb3605945fb3.jpeg';

/**
 * Escape HTML special characters to prevent XSS
 * Used for user-generated content that will be inserted into HTML
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert line breaks to <br> tags while preserving HTML formatting
 * Does NOT escape HTML - allows formatting tags like <strong>, <em>, etc.
 */
function nl2br(text) {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

/**
 * Render email template with substituted content
 *
 * @param {string} template - HTML template with placeholders
 * @param {object} emailData - Email data with day, title, variants
 * @param {string} variant - Current variant ('flooring', 'lighting', or 'generic')
 * @returns {string} - Rendered HTML with substituted values
 */
export function renderEmailTemplate(template, emailData, variant) {
  if (!emailData || !emailData.variants || !emailData.variants[variant]) {
    return template;
  }

  const variantData = emailData.variants[variant];

  // Prepare substitutions (HTML formatting preserved in body)
  // Note: ActiveCampaign variables like %FIRSTNAME%, %%VIDEO_URL%%, etc. are left as-is
  const substitutions = {
    '{{PREVIEW_TEXT}}': escapeHtml(variantData.preview || ''),
    '{{EMAIL_BODY}}': nl2br(variantData.body || ''), // Allows HTML formatting
    '{{IMAGE_URL}}': variantData.imageUrl || DEFAULT_IMAGE
  };

  // Apply all substitutions
  let rendered = template;
  Object.entries(substitutions).forEach(([placeholder, value]) => {
    rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
  });

  // Sanitize the final HTML to prevent XSS attacks
  // DOMPurify allows safe HTML tags but removes scripts and dangerous attributes
  return DOMPurify.sanitize(rendered);
}

/**
 * Render email template WITHOUT sanitization (for code display)
 * Use this only for displaying code, not for rendering in iframe
 *
 * @param {string} template - HTML template with placeholders
 * @param {object} emailData - Email data with day, title, variants
 * @param {string} variant - Current variant ('flooring', 'lighting', or 'generic')
 * @returns {string} - Rendered HTML with substituted values (unsanitized)
 */
export function renderEmailTemplateRaw(template, emailData, variant) {
  if (!emailData || !emailData.variants || !emailData.variants[variant]) {
    return template;
  }

  const variantData = emailData.variants[variant];

  // Prepare substitutions (HTML formatting preserved in body)
  // Note: ActiveCampaign variables like %FIRSTNAME%, %%VIDEO_URL%%, etc. are left as-is
  const substitutions = {
    '{{PREVIEW_TEXT}}': escapeHtml(variantData.preview || ''),
    '{{EMAIL_BODY}}': nl2br(variantData.body || ''), // Allows HTML formatting
    '{{IMAGE_URL}}': variantData.imageUrl || DEFAULT_IMAGE
  };

  // Apply all substitutions
  let rendered = template;
  Object.entries(substitutions).forEach(([placeholder, value]) => {
    rendered = rendered.replace(new RegExp(placeholder, 'g'), value);
  });

  // Return unsanitized HTML for code display
  return rendered;
}

/**
 * Get the subject line from email data for the specified variant
 *
 * @param {object} emailData - Email data with variants
 * @param {string} variant - Current variant
 * @returns {string} - Subject line
 */
export function getEmailSubject(emailData, variant) {
  if (!emailData || !emailData.variants || !emailData.variants[variant]) {
    return '';
  }
  return emailData.variants[variant].subject || '';
}

/**
 * Get the preview text from email data for the specified variant
 *
 * @param {object} emailData - Email data with variants
 * @param {string} variant - Current variant
 * @returns {string} - Preview text
 */
export function getEmailPreview(emailData, variant) {
  if (!emailData || !emailData.variants || !emailData.variants[variant]) {
    return '';
  }
  return emailData.variants[variant].preview || '';
}
