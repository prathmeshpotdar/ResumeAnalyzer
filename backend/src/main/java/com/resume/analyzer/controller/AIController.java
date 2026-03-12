package com.resume.analyzer.controller;

import com.resume.analyzer.payload.ImproveRequest;
import com.resume.analyzer.payload.ImproveResponse;
import com.resume.analyzer.service.AIAnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIAnalysisService aiAnalysisService;

    @PostMapping("/improve")
    public ResponseEntity<?> improveText(@Valid @RequestBody ImproveRequest request) {
        String improved = aiAnalysisService.improveText(request.getText(), request.getContext());
        return ResponseEntity.ok(new ImproveResponse(improved));
    }
}
