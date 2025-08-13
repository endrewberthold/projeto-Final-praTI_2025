# Estrutura do Backend

Este é o backend da Plataforma de Estudos, desenvolvido em Spring Boot com Java 21.
O projeto é responsável pela lógica de negócio e comunicação com o banco de dados (configurado via docker-compose).

## Pré-requisitos
Para rodar este projeto, certifique-se de ter instalado na sua máquina:

    Java 21 (JDK 21)

    Maven 3.9+

    Docker e Docker Compose

    Git

Caso utilize o WSL ou outro ambiente Linux no Windows, certifique-se de ter o <code>Java</code> e <code>Maven</code> instalados nesse ambiente.

## Subindo os containers com Docker Compose
Dentro da pasta do projeto, execute:

```bash
  docker compose up -d --build
```

O parâmetro --build garante que a imagem seja recompilada com base nas alterações mais recentes.

Para verificar se os containers estão ativos:

```bash
  docker compose ps
```

Para parar os containers:

```bash
  docker compose down
```

## Instalando dependências
O projeto utiliza Maven para gerenciar dependências. Para instalar:

```bash
  mvn clean install
```

## Executando o projeto
Com o ambiente configurado, basta rodar:

```bash
  mvn spring-boot:run
```

O backend será iniciado e ficará disponível em:

```arduino
http://localhost:8080
```

## Estrutura do projeto
A estrutura básica segue o padrão Spring Boot:

```arduino
src/main/java/org.plataform.backend

controllers/ → Endpoints REST

services/ → Regras de negócio

repositories/ → Comunicação com o banco (JPA)

models/ → Entidades do banco de dados

dtos/ → Objetos para transporte de dados

src/main/resources

application.properties → Configurações do Spring Boot
```
