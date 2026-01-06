package com.dariomatias.my_commerce.model.shared;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class Address {

    @Column(nullable = false, length = 50)
    protected String label;

    @Column(nullable = false)
    protected String street;

    @Column(nullable = false)
    protected String number;

    @Column
    protected String complement;

    @Column(nullable = false)
    protected String neighborhood;

    @Column(nullable = false)
    protected String city;

    @Column(nullable = false, length = 2)
    protected String state;

    @Column(nullable = false, length = 10)
    protected String zip;
}
