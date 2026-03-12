package com.resume.analyzer.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResumeUploadResponse {
    private String message;
    private Long resumeId;
    private String originalFilename;
}
