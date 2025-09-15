package org.plataform.backend.userConfiguration.dtos.question;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PresentedAlternativeDTO {
    private String presentedId;
    private Long id;
    private String letter;
    private String text;
}
