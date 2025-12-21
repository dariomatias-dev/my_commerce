package com.dariomatias.my_commerce.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);
        mailSender.send(message);
    }

    private String createEmailTemplate(String preheader, String title, String bodyContent, String buttonText, String buttonUrl) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin:0; padding:0; background-color:#f8fafc; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
                    <span style="display:none; font-size:1px; color:#f8fafc;">%s</span>
                    <table width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; padding: 40px 20px;">
                        <tr>
                            <td align="center">
                                <table width="100%%" style="max-width:600px; background-color:#ffffff; border: 1px solid #e2e8f0; border-radius:24px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.03);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="background-color:#0f172a; padding: 40px 0; text-align:center;">
                                            <div style="display:inline-block; background-color:#4f46e5; padding:12px; border-radius:12px; margin-bottom:15px;">
                                                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" width="30" height="30" alt="Logo" style="display:block;">
                                            </div>
                                            <h1 style="margin:0; color:#ffffff; font-size:20px; font-weight:900; letter-spacing:-0.05em; text-transform:uppercase; font-style:italic;">
                                                MY<span style="color:#6366f1;">ECOMMERCE</span>
                                            </h1>
                                        </td>
                                    </tr>
                                    <!-- Body -->
                                    <tr>
                                        <td style="padding: 40px 30px; line-height:1.6;">
                                            <h2 style="margin:0 0 20px 0; color:#0f172a; font-size:24px; font-weight:800; letter-spacing:-0.02em;">%s</h2>
                                            <div style="color:#475569; font-size:16px;">
                                                %s
                                            </div>
                                            <!-- Button -->
                                            <table border="0" cellspacing="0" cellpadding="0" style="margin-top:35px; width:100%%;">
                                                <tr>
                                                    <td align="center">
                                                        <a href="%s" target="_blank" style="background-color:#4f46e5; color:#ffffff; padding:18px 35px; text-decoration:none; border-radius:14px; font-weight:bold; font-size:14px; display:inline-block; letter-spacing:0.05em; box-shadow:0 4px 12px rgba(79,70,229,0.3);">
                                                            %s
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Footer -->
                                    <tr>
                                        <td style="background-color:#f8fafc; padding:30px; text-align:center; border-top: 1px solid #e2e8f0;">
                                            <p style="margin:0; color:#94a3b8; font-size:12px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase;">
                                                Segurança Protegida por MyEcommerce SaaS
                                            </p>
                                            <p style="margin:10px 0 0 0; color:#cbd5e1; font-size:11px;">
                                                © 2025 MyEcommerce. Todos os direitos reservados.<br/>
                                                Este é um e-mail automático, por favor não responda.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(preheader, title, bodyContent, buttonUrl, buttonText);
    }

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        String subject = "Verifique sua conta no MyEcommerce";
        String link = "http://localhost:3000/verify-email?token=" + token;

        String bodyContent = """
                <p>Olá,</p>
                <p>Seu próximo capítulo no mercado digital começa agora. Para ativar sua loja e acessar o console de operações, confirme sua identidade clicando no botão abaixo:</p>
                """;

        String content = createEmailTemplate(
                "Ative seu acesso agora",
                "BEM-VINDO AO TIME.",
                bodyContent,
                "CONFIRMAR E-MAIL AGORA",
                link
        );
        sendEmail(to, subject, content);
    }

    public void sendPasswordRecoveryEmail(String to, String token) throws MessagingException {
        String subject = "Recuperação de Senha";
        String link = "http://localhost:3000/reset-password?token=" + token;

        String bodyContent = """
                <p>Recebemos uma solicitação de redefinição de segurança para sua conta.</p>
                <p>Clique no botão abaixo para escolher uma nova combinação e garantir a proteção do seu império digital:</p>
                """;

        String content = createEmailTemplate(
                "Instruções para redefinir sua senha",
                "RECUPERAR ACESSO.",
                bodyContent,
                "REDEFINIR MINHA SENHA",
                link
        );
        sendEmail(to, subject, content);
    }
}