package org.plataform.backend.userConfiguration.services;

import org.plataform.backend.userConfiguration.dtos.users.UserRequest;
import org.plataform.backend.userConfiguration.dtos.users.UserResponse;
import org.plataform.backend.userConfiguration.repositories.UserRepository;
import org.plataform.backend.userConfiguration.entity.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceRep {

    private final UserRepository userRepository;

    public UserServiceRep(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Cadastro
    public UserResponse registerUser(UserRequest request) {
        // Verifica se o email já existe
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        // Cria o usuário (sempre USER por padrão)
        User user = new User(request); // o construtor já define role = USER
        return new UserResponse(userRepository.save(user));
    }

    // Login (simplificado)
    public UserResponse loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Aqui você deve verificar a senha (hash se tiver)
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Senha inválida");
        }

        return new UserResponse(user);
    }

    // Obter perfil do usuário
    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        return new UserResponse(user);
    }

    // Listar todos usuários (apenas admin)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();
    }
}
