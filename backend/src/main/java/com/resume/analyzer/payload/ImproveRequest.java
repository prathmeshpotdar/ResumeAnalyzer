package com.resume.analyzer.payload;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ImproveRequest {
    @NotBlank
    private String text;

    @NotBlank
    private String context;
}
