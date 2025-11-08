package com.dariomatias.my_commerce.util;

import java.text.Normalizer;

public class SlugUtil {
    public static String generateSlug(String name) {
        if (name == null || name.isBlank()) {
            return "";
        }
        return Normalizer.normalize(name, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-|-$", "");
    }
}
