package com.resume.analyzer.controller;

import com.resume.analyzer.entity.Resume;
import com.resume.analyzer.entity.User;
import com.resume.analyzer.payload.MessageResponse;
import com.resume.analyzer.payload.ResumeUploadResponse;
import com.resume.analyzer.repository.ResumeRepository;
import com.resume.analyzer.repository.UserRepository;
import com.resume.analyzer.service.DocumentParsingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private DocumentParsingService documentParsingService;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: File is empty."));
            }

            // Extract the user currently making the request
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> optionalUser = userRepository.findByUsername(userDetails.getUsername());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Error: User not found."));
            }

            User user = optionalUser.get();

            // Parse text
            String parsedText = documentParsingService.extractTextFromResume(file);

            // Save Resume Metadata
            Resume resume = Resume.builder()
                    .user(user)
                    .originalFilename(file.getOriginalFilename())
                    .parsedText(parsedText)
                    .build();
            
            Resume savedResume = resumeRepository.save(resume);

            return ResponseEntity.ok(new ResumeUploadResponse(
                    "File uploaded and parsed successfully!",
                    savedResume.getId(),
                    savedResume.getOriginalFilename()
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Bad Request: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error processing file: " + e.getMessage()));
        }
    }
}
