package com.dariomatias.my_commerce.controller.stub;

import com.dariomatias.my_commerce.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/stub")
public class StubExceptionController {

    record ValidatedRequest(@NotBlank String name) {}
    record EnumRequest(PaymentMethod paymentMethod) {}

    @GetMapping("/access-denied")
    public ResponseEntity<Void> accessDenied() {
        throw new AccessDeniedException("denied");
    }

    @GetMapping("/not-found")
    public ResponseEntity<Void> notFound() {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Recurso não encontrado");
    }

    @PostMapping("/validate")
    public ResponseEntity<Void> validate(@Valid @RequestBody ValidatedRequest body) {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/enum")
    public ResponseEntity<Void> withEnum(@RequestBody EnumRequest body) {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/runtime")
    public ResponseEntity<Void> runtime() {
        throw new RuntimeException("erro interno");
    }

    @GetMapping("/server-error")
    public ResponseEntity<Void> serverError() throws Exception {
        throw new Exception("erro do servidor");
    }
}
