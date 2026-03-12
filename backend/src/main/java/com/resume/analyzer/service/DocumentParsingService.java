package com.resume.analyzer.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class DocumentParsingService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentParsingService.class);

    public String extractTextFromResume(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("Filename cannot be null");
        }

        String extension = getFileExtension(filename).toLowerCase();
        
        switch (extension) {
            case "pdf":
                return extractTextFromPdf(file);
            case "docx":
                return extractTextFromDocx(file);
            default:
                throw new IllegalArgumentException("Unsupported file format: " + extension + ". Only PDF and DOCX are supported.");
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        logger.info("Extracting text from PDF: {}", file.getOriginalFilename());
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            
            // Adjust stripping defaults if necessary for column support
            stripper.setSortByPosition(true);
            
            return stripper.getText(document);
        }
    }

    private String extractTextFromDocx(MultipartFile file) throws IOException {
        logger.info("Extracting text from DOCX: {}", file.getOriginalFilename());
        try (XWPFDocument document = new XWPFDocument(file.getInputStream());
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return ""; // No extension
        }
        return filename.substring(lastDotIndex + 1);
    }
}
