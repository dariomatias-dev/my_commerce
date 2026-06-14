package com.dariomatias.my_commerce.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RandomUtil")
class RandomUtilTest {

    @Test
    @DisplayName("chance(0) should always return false")
    void chance_withZeroPercent_shouldAlwaysReturnFalse() {
        assertFalse(RandomUtil.chance(0));
    }

    @Test
    @DisplayName("chance(100) should always return true")
    void chance_with100Percent_shouldAlwaysReturnTrue() {
        assertTrue(RandomUtil.chance(100));
    }

    @Test
    @DisplayName("negative chance should return false")
    void chance_withNegative_shouldReturnFalse() {
        assertFalse(RandomUtil.chance(-10));
    }

    @Test
    @DisplayName("chance above 100 should return true")
    void chance_above100_shouldReturnTrue() {
        assertTrue(RandomUtil.chance(101));
    }

    @Test
    @DisplayName("randomPastDate(0) should return today's date")
    void randomPastDate_withZeroDays_shouldReturnToday() {
        LocalDateTime result = RandomUtil.randomPastDate(0);
        assertNotNull(result);
        assertEquals(LocalDateTime.now().toLocalDate(), result.toLocalDate());
    }

    @Test
    @DisplayName("randomPastDate should return date within interval")
    void randomPastDate_withInterval_shouldReturnWithinRange() {
        int maxDays = 30;
        LocalDateTime result = RandomUtil.randomPastDate(maxDays);
        LocalDateTime lowerBound = LocalDateTime.now().minusDays(maxDays).minusMinutes(1);
        assertTrue(result.isAfter(lowerBound));
        assertTrue(result.isBefore(LocalDateTime.now().plusMinutes(1)));
    }

    @Test
    @DisplayName("randomDeletion with 0% should never mark as deleted")
    void randomDeletion_withZeroPercent_shouldNeverMarkAsDeleted() {
        RandomUtil.RandomResult result = RandomUtil.randomDeletion(0, 30);
        assertFalse(result.isDeleted());
        assertNull(result.getDeletedAt());
    }

    @Test
    @DisplayName("randomDeletion with 100% should always mark as deleted with date")
    void randomDeletion_with100Percent_shouldAlwaysMarkAsDeletedWithDate() {
        RandomUtil.RandomResult result = RandomUtil.randomDeletion(100, 30);
        assertTrue(result.isDeleted());
        assertNotNull(result.getDeletedAt());
    }
}
