package com.resume.analyzer.repository;

import com.resume.analyzer.entity.Analysis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalysisRepository extends JpaRepository<Analysis, Long> {
    Analysis findByResumeId(Long resumeId);
}
