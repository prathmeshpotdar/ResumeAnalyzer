package com.resume.analyzer.payload;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
public class AnalysisRequest {
    @NotNull
    private Long resumeId;

    @NotBlank
    private String jobRole;

    @NotBlank
    private String jobDescription;
}
