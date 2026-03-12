package com.resume.analyzer.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.resume.analyzer.entity.Analysis;
import com.resume.analyzer.entity.Resume;
import com.resume.analyzer.payload.AnalysisRequest;
import com.resume.analyzer.payload.MessageResponse;
import com.resume.analyzer.repository.AnalysisRepository;
import com.resume.analyzer.repository.ResumeRepository;
import com.resume.analyzer.service.AIAnalysisService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analysis")
public class AnalysisController {

    @Autowired
    private AnalysisRepository analysisRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private AIAnalysisService aiAnalysisService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/generate")
    public ResponseEntity<?> generateAnalysis(@Valid @RequestBody AnalysisRequest request) {
        try {
            Optional<Resume> resumeOpt = resumeRepository.findById(request.getResumeId());
            if (resumeOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Resume not found."));
            }
            
            Resume resume = resumeOpt.get();
            
            // Call AI Service
            String aiResultJsonStr = aiAnalysisService.analyzeResume(
                    resume.getParsedText(), 
                    request.getJobRole(), 
                    request.getJobDescription()
            );

            // Parse AI response safely
            if (aiResultJsonStr.startsWith("```json")) {
                aiResultJsonStr = aiResultJsonStr.substring(7);
            } else if (aiResultJsonStr.startsWith("```")) {
                aiResultJsonStr = aiResultJsonStr.substring(3);
            }
            if (aiResultJsonStr.endsWith("```")) {
                aiResultJsonStr = aiResultJsonStr.substring(0, aiResultJsonStr.length() - 3);
            }
            aiResultJsonStr = aiResultJsonStr.trim();

            JsonNode rootNode = objectMapper.readTree(aiResultJsonStr);
            // Default to mock-like values if AI didn't return perfect JSON
            int atsScore = rootNode.has("atsScore") ? rootNode.get("atsScore").asInt() : 50;
            int rating = rootNode.has("rating") ? rootNode.get("rating").asInt() : 2;
            String suggestionsJson = rootNode.has("suggestions") ? rootNode.get("suggestions").toString() : "[]";

            // Save to Database
            Analysis analysis = Analysis.builder()
                    .resume(resume)
                    .jobRole(request.getJobRole())
                    .jobDescription(request.getJobDescription())
                    .atsScore(atsScore)
                    .rating(rating)
                    .suggestionsJson(suggestionsJson)
                    .build();

            Analysis savedAnalysis = analysisRepository.save(analysis);

            return ResponseEntity.ok(savedAnalysis);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error during analysis: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getAnalysisByResume(@PathVariable Long resumeId) {
        Analysis analysis = analysisRepository.findByResumeId(resumeId);
        if (analysis == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(analysis);
    }
}
