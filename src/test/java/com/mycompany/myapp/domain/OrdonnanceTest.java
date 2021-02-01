package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class OrdonnanceTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ordonnance.class);
        Ordonnance ordonnance1 = new Ordonnance();
        ordonnance1.setId(1L);
        Ordonnance ordonnance2 = new Ordonnance();
        ordonnance2.setId(ordonnance1.getId());
        assertThat(ordonnance1).isEqualTo(ordonnance2);
        ordonnance2.setId(2L);
        assertThat(ordonnance1).isNotEqualTo(ordonnance2);
        ordonnance1.setId(null);
        assertThat(ordonnance1).isNotEqualTo(ordonnance2);
    }
}
