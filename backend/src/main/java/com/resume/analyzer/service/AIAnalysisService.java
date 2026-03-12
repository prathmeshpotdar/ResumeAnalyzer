package com.resume.analyzer.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AIAnalysisService {

    private static final Logger logger = LoggerFactory.getLogger(AIAnalysisService.class);

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzeResume(String parsedText, String jobRole, String jobDescription) {
        String prompt = buildPrompt(parsedText, jobRole, jobDescription);
        
        // Ensure API key is present, else return mock for dev
        if (openaiApiKey == null || openaiApiKey.isEmpty() || openaiApiKey.equals("YOUR_OPENAI_API_KEY_HERE")) {
            logger.warn("Using MOCK AI Response because API Key is missing or default.");
            return getMockResponse();
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            String requestBody = "{\n" +
                    "  \"model\": \"gpt-4o-mini\",\n" +
                    "  \"messages\": [\n" +
                    "    {\n" +
                    "      \"role\": \"user\",\n" +
                    "      \"content\": \"" + escapeJson(prompt) + "\"\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"temperature\": 0.7\n" +
                    "}";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(openaiApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                return rootNode.path("choices").get(0).path("message").path("content").asText();
            }

        } catch (Exception e) {
            logger.error("Error communicating with OpenAI API", e);
        }
        
        return getMockResponse();
    }

    private String buildPrompt(String parsedText, String jobRole, String jobDescription) {
        return "You are an expert ATS (Applicant Tracking System) Analyzer and Technical Recruiter. " +
                "I am providing you with a parsed resume text, a job role, and a job description. " +
                "Evaluate the resume against the role and description. " +
                "Provide the result strictly in valid JSON format with the following keys: " +
                "'atsScore' (integer 0-100), 'rating' (integer 1-5), and 'suggestions' (an array of strings indicating missing skills or improvements). " +
                "\n\nJob Role: " + jobRole +
                "\nJob Description: " + jobDescription +
                "\n\nResume Text:\n" + parsedText;
    }

    private String escapeJson(String text) {
        return text.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }

    private String getMockResponse() {
        return "{\n" +
                "  \"atsScore\": 75,\n" +
                "  \"rating\": 3,\n" +
                "  \"suggestions\": [\n" +
                "    \"Add more metrics to your experience section.\",\n" +
                "    \"Include keyword 'Agile' as requested in JD.\",\n" +
                "    \"Formatting holds strong but lacks summary impact.\"\n" +
                "  ]\n" +
                "}";
    }

    public String improveText(String text, String context) {
        String prompt = "You are an expert resume writer. Improve the following text for a resume. " +
                "Context: " + context + "\n\nOriginal Text: " + text + "\n\nProvide ONLY the improved text directly without any quotes or explanations.";
        
        if (openaiApiKey == null || openaiApiKey.isEmpty() || openaiApiKey.equals("YOUR_OPENAI_API_KEY_HERE")) {
            logger.warn("Using MOCK AI Response for improvement because API Key is missing or default.");
            return text + " (Improved for " + context + ")";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            String requestBody = "{\n" +
                    "  \"model\": \"gpt-4o-mini\",\n" +
                    "  \"messages\": [\n" +
                    "    {\n" +
                    "      \"role\": \"user\",\n" +
                    "      \"content\": \"" + escapeJson(prompt) + "\"\n" +
                    "    }\n" +
                    "  ],\n" +
                    "  \"temperature\": 0.7\n" +
                    "}";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(openaiApiUrl, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                return rootNode.path("choices").get(0).path("message").path("content").asText().trim();
            }

        } catch (Exception e) {
            logger.error("Error communicating with OpenAI API for improvement", e);
        }
        
        return text + " (Improved for " + context + ")";
    }
}
