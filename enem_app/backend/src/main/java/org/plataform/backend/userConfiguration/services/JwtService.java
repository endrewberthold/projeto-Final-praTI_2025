package org.plataform.backend.userConfiguration.services;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class  JwtService {

    // Chave secreta usada para assinar e validar os tokens JWT
    @Value("${jwt.secret:mySecretKey123456789012345678901234567890}")
    private String secretKey;

    // Tempo de expiração do token (padrão: 24 horas em milissegundos)
    @Value("${jwt.expiration:86400000}") // 24 horas em ms
    private Long jwtExpiration;

    // Extrai o "username" (normalmente o email) do token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extrai a "role" (permissão, ex: USER ou ADMIN) do token - não esta em uso
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    // Extrai a data de expiração do token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Method genérico que permite extrair qualquer informação (claim) do token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Gera um token JWT apenas com o email - não esta em uso
    public String generateToken(String email) {
        Map<String, Object> extraClaims = new HashMap<>();
        return generateToken(extraClaims, email, jwtExpiration);
    }

    // Gera um token JWT para um usuário, incluindo a role (perfil) como claim
    public String generateToken(UserDetails userDetails, String role) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", role);
        return generateToken(extraClaims, userDetails.getUsername(), jwtExpiration);
    }

    // Sobrecarga: gera token com claims extras passados manualmente - não esta em uso
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return generateToken(extraClaims, userDetails.getUsername(), jwtExpiration);
    }
    // Cria o token JWT: adiciona claims, subject (email), tempo de expiração e assina com a chave secreta
    private String generateToken(Map<String, Object> extraClaims, String subject, long expiration) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Verifica se o token é válido: confere se o usuário bate e se não está expirado
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Verifica se o token já expirou
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Retorna o tempo configurado de expiração em ms
    public long getExpirationTime() {
        return jwtExpiration;
    }

    // Extrai todas as informações (claims) de dentro do token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Converte a chave secreta (string) em uma chave criptográfica para assinar tokens
    private Key getSignInKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}