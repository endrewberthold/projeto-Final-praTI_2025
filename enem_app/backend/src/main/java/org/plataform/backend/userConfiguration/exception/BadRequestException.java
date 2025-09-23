package org.plataform.backend.userConfiguration.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**@author Endrew
 * Classe de exception para tratamento de erros de requisições
 * mal formatadas
 * **/

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}