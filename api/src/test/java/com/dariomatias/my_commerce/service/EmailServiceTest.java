package com.dariomatias.my_commerce.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("EmailService")
class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private EmailService emailService;

    @Nested
    @DisplayName("sendVerificationEmail")
    class SendVerificationEmail {

        @Test
        @DisplayName("should create and send MimeMessage via mailSender")
        void shouldSendEmail() throws MessagingException {
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

            emailService.sendVerificationEmail("user@test.com", "token-abc");

            verify(mailSender).send(mimeMessage);
        }

        @Test
        @DisplayName("mailSender failure should propagate MailSendException")
        void mailSenderFailure_shouldPropagate() {
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
            doThrow(new MailSendException("SMTP failure"))
                    .when(mailSender).send(mimeMessage);

            assertThrows(MailSendException.class,
                    () -> emailService.sendVerificationEmail("user@test.com", "token-abc"));
        }
    }

    @Nested
    @DisplayName("sendPasswordRecoveryEmail")
    class SendPasswordRecoveryEmail {

        @Test
        @DisplayName("should create and send MimeMessage via mailSender")
        void shouldSendEmail() throws MessagingException {
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

            emailService.sendPasswordRecoveryEmail("user@test.com", "token-xyz");

            verify(mailSender).send(mimeMessage);
        }

        @Test
        @DisplayName("mailSender failure should propagate MailSendException")
        void mailSenderFailure_shouldPropagate() {
            MimeMessage mimeMessage = mock(MimeMessage.class);
            when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
            doThrow(new MailSendException("SMTP failure"))
                    .when(mailSender).send(mimeMessage);

            assertThrows(MailSendException.class,
                    () -> emailService.sendPasswordRecoveryEmail("user@test.com", "token-xyz"));
        }
    }
}
