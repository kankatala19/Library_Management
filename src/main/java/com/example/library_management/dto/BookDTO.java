package com.example.library_management.dto;


import lombok.Data;

@Data
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private String category;
    private int totalCopies;
    private int availableCopies;
}

