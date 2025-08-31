package org.plataform.backend.userConfiguration.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {

    @Id
    @Column(name = "id_subject", nullable = false)
    private UUID id;

}
