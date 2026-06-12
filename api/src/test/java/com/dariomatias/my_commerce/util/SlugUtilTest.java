package com.dariomatias.my_commerce.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SlugUtil")
class SlugUtilTest {

    @Test
    @DisplayName("texto simples deve virar slug minúsculo com hífens")
    void generateSlug_comTextoSimples_deveGerarSlugMinusculo() {
        assertEquals("minha-loja", SlugUtil.generateSlug("Minha Loja"));
    }

    @Test
    @DisplayName("texto com acentos deve ser normalizado sem acentos")
    void generateSlug_comAcentos_deveRemoverAcentos() {
        assertEquals("cafe-especial", SlugUtil.generateSlug("Café Especial"));
    }

    @Test
    @DisplayName("texto com caracteres especiais deve remover símbolos")
    void generateSlug_comCaracteresEspeciais_deveRemoverSimbolos() {
        assertEquals("produto-top", SlugUtil.generateSlug("Produto #Top!"));
    }

    @Test
    @DisplayName("null deve retornar string vazia")
    void generateSlug_comNull_deveRetornarStringVazia() {
        assertEquals("", SlugUtil.generateSlug(null));
    }

    @Test
    @DisplayName("string em branco deve retornar string vazia")
    void generateSlug_comStringVazia_deveRetornarStringVazia() {
        assertEquals("", SlugUtil.generateSlug("   "));
    }

    @Test
    @DisplayName("hífens extras no início e fim devem ser removidos")
    void generateSlug_comHifensNasExtremidades_deveRemoverHifensExtras() {
        assertEquals("produto", SlugUtil.generateSlug("--Produto--"));
    }

    @Test
    @DisplayName("números devem ser preservados no slug")
    void generateSlug_comNumeros_devePreservarNumeros() {
        assertEquals("produto-123", SlugUtil.generateSlug("Produto 123"));
    }

    @Test
    @DisplayName("múltiplos espaços devem virar um único hífen")
    void generateSlug_comMultiplosEspacos_deveGerarUmHifen() {
        assertEquals("minha-loja", SlugUtil.generateSlug("Minha   Loja"));
    }
}
