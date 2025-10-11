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

    private String createEmailTemplate(String title, String bodyContent) {
        return """
                <html>
                <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                    <table width="100%%" cellpadding="0" cellspacing="0">
                        <tr><td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.1); margin-top:40px;">
                                <tr>
                                    <td style="background-color:#4CAF50; padding: 25px; text-align:center; color:white;">
                                        <h1 style="margin:0; font-size:24px; font-weight:bold;">%s</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:30px; color:#333333;">
                                        %s
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color:#f1f3f6; padding:20px; text-align:center; color:#777777; font-size:12px;">
                                        © 2025 My Commerce. Todos os direitos reservados.<br/>
                                        <a href="mailto:support@mycommerce.com" style="color:#4CAF50; text-decoration:none;">suporte@mycommerce.com</a>
                                    </td>
                                </tr>
                            </table>
                        </td></tr>
                    </table>
                </body>
                </html>
                """.formatted(title, bodyContent);
    }

    public void sendVerificationEmail(String to, String token) throws MessagingException {
        String subject = "Confirme seu e-mail";
        String link = "http://localhost:8080/api/auth/verify-email?token=" + token;
        String bodyContent = """
                <p>Olá,</p>
                <p>Obrigado por se cadastrar no <strong>My Commerce</strong>! Para ativar sua conta e começar a usar nossos serviços, clique no botão abaixo:</p>
                <p style="text-align:center; margin:40px 0;">
                    <a href="%s" style="background-color:#4CAF50; color:white; padding:15px 30px; text-decoration:none; border-radius:8px; font-weight:bold; box-shadow:0 4px 10px rgba(0,0,0,0.1); display:inline-block;">
                        Confirmar E-mail
                    </a>
                </p>
                <p>Se você não realizou este cadastro, apenas ignore este e-mail.</p>
                <p>Atenciosamente,<br/><strong>Equipe My Commerce</strong></p>
                """.formatted(link);

        String content = createEmailTemplate("Bem-vindo ao My Commerce!", bodyContent);
        sendEmail(to, subject, content);
    }
}
