package com.dariomatias.my_commerce.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RandomUtil")
class RandomUtilTest {

    @Test
    @DisplayName("chance(0) deve retornar sempre false")
    void chance_comZeroPorcento_deveRetornarSempreFalse() {
        assertFalse(RandomUtil.chance(0));
    }

    @Test
    @DisplayName("chance(100) deve retornar sempre true")
    void chance_com100Porcento_deveRetornarSempreTrue() {
        assertTrue(RandomUtil.chance(100));
    }

    @Test
    @DisplayName("chance negativo deve retornar false")
    void chance_comNegativo_deveRetornarFalse() {
        assertFalse(RandomUtil.chance(-10));
    }

    @Test
    @DisplayName("chance acima de 100 deve retornar true")
    void chance_comAcimaDe100_deveRetornarTrue() {
        assertTrue(RandomUtil.chance(101));
    }

    @Test
    @DisplayName("randomPastDate(0) deve retornar data de hoje")
    void randomPastDate_comZeroDias_deveRetornarHoje() {
        LocalDateTime resultado = RandomUtil.randomPastDate(0);
        assertNotNull(resultado);
        assertEquals(LocalDateTime.now().toLocalDate(), resultado.toLocalDate());
    }

    @Test
    @DisplayName("randomPastDate deve retornar data dentro do intervalo")
    void randomPastDate_comIntervalo_deveRetornarDentroDoIntervalo() {
        int maxDias = 30;
        LocalDateTime resultado = RandomUtil.randomPastDate(maxDias);
        LocalDateTime limite = LocalDateTime.now().minusDays(maxDias).minusMinutes(1);
        assertTrue(resultado.isAfter(limite));
        assertTrue(resultado.isBefore(LocalDateTime.now().plusMinutes(1)));
    }

    @Test
    @DisplayName("randomDeletion com 0% nunca deve marcar como deletado")
    void randomDeletion_comZeroPorcento_nuncaDeveMarcarComoDeletedo() {
        RandomUtil.RandomResult resultado = RandomUtil.randomDeletion(0, 30);
        assertFalse(resultado.isDeleted());
        assertNull(resultado.getDeletedAt());
    }

    @Test
    @DisplayName("randomDeletion com 100% sempre deve marcar como deletado com data")
    void randomDeletion_com100Porcento_sempreDeveMarcarComoDeletedoComData() {
        RandomUtil.RandomResult resultado = RandomUtil.randomDeletion(100, 30);
        assertTrue(resultado.isDeleted());
        assertNotNull(resultado.getDeletedAt());
    }
}
