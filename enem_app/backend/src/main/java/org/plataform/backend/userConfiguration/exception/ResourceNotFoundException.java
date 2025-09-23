package org.plataform.backend.userConfiguration.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**@author Endrew
 * Classe de exception para tratamento de erros cada o conteudo não exista
 * caso não tenha sido criado, isso permite controle nas etapas de teste
 * **/

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
