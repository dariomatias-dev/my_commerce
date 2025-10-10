package com.dariomatias.my_commerce.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Objects;
import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        Dotenv dotenv = Dotenv.load();

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(dotenv.get("MAIL_HOST"));
        mailSender.setPort(Integer.parseInt(Objects.requireNonNull(dotenv.get("MAIL_PORT"))));
        mailSender.setUsername(dotenv.get("MAIL_USERNAME"));
        mailSender.setPassword(dotenv.get("MAIL_PASSWORD"));

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", dotenv.get("MAIL_PROTOCOL", "smtp"));
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", dotenv.get("MAIL_TLS", "true"));
        props.put("mail.debug", dotenv.get("MAIL_DEBUG", "false"));

        return mailSender;
    }
}
