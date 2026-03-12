package com.resume.analyzer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "analyses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Analysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    @Column(nullable = false)
    private String jobRole;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String jobDescription;

    @Column(nullable = false)
    private Integer atsScore;

    @Column(nullable = false)
    private Integer rating;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String suggestionsJson;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
