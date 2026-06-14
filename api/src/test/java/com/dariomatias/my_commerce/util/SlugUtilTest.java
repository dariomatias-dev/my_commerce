package com.dariomatias.my_commerce.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SlugUtil")
class SlugUtilTest {

    @Test
    @DisplayName("simple text should become lowercase slug with hyphens")
    void generateSlug_withSimpleText_shouldGenerateLowercaseSlug() {
        assertEquals("my-store", SlugUtil.generateSlug("My Store"));
    }

    @Test
    @DisplayName("text with accents should be normalized without accents")
    void generateSlug_withAccents_shouldRemoveAccents() {
        assertEquals("cafe-special", SlugUtil.generateSlug("Café Special"));
    }

    @Test
    @DisplayName("text with special characters should remove symbols")
    void generateSlug_withSpecialCharacters_shouldRemoveSymbols() {
        assertEquals("product-top", SlugUtil.generateSlug("Product #Top!"));
    }

    @Test
    @DisplayName("null should return empty string")
    void generateSlug_withNull_shouldReturnEmptyString() {
        assertEquals("", SlugUtil.generateSlug(null));
    }

    @Test
    @DisplayName("blank string should return empty string")
    void generateSlug_withBlankString_shouldReturnEmptyString() {
        assertEquals("", SlugUtil.generateSlug("   "));
    }

    @Test
    @DisplayName("extra hyphens at start and end should be removed")
    void generateSlug_withEdgeHyphens_shouldRemoveExtraHyphens() {
        assertEquals("product", SlugUtil.generateSlug("--Product--"));
    }

    @Test
    @DisplayName("numbers should be preserved in slug")
    void generateSlug_withNumbers_shouldPreserveNumbers() {
        assertEquals("product-123", SlugUtil.generateSlug("Product 123"));
    }

    @Test
    @DisplayName("multiple spaces should become a single hyphen")
    void generateSlug_withMultipleSpaces_shouldGenerateSingleHyphen() {
        assertEquals("my-store", SlugUtil.generateSlug("My   Store"));
    }
}
