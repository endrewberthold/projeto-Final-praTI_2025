# Funções para consumo das apis no Frontend

## Autenticação

### _Login_

Retorna toda a estrutura do json, coletando dados do usuário, token de acesso e token de sessão, que expira a cada 1h.

```javascript
async function login(email, password) {
    let url = `http://localhost/api/auth/login`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        email,
        password,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/auth/login
    Content-Type: application/json

{
    "email": "",
    "password": ""
}
```

_Retorno do login_

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInN1YiI6ImpvYW9AZW1haWwuY29tIiwiaWF0IjoxNzU3MTc2Mjc4LCJleHAiOjE3NTcyNjI2Nzh9.bfLq6OWJJKYBK3oFJGnH7UWyQA8Cjs-QG4ETMK5ewcY",
  "refreshToken": "1e90ea40-6b1f-4729-bcdf-dcb25622c863",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "name": "Joao",
    "email": "joao@email.com",
    "role": "USER",
    "createAt": 1757176257.18451,
    "xpPoints": 0,
    "level": 1,
    "provider": "local",
    "isOauthUser": false
  }
}
```

---

### _Logout_

```javascript
async function logout(refreshToken) {
    let url = `http://localhost/api/auth/logout`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        refreshToken,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/auth/logout
    Content-Type: application/json

{
    "refreshToken": ""
}
```

---

### _Register_

```javascript
async function registerUser(name, email, password) {
    let url = `http://localhost/api/auth/register`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        name,
        email,
        password,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/auth/register
    Content-Type: application/json

{
    "name": "",
    "email": "",
    "password": ""
}
```

---

### _Forgot Password_

```javascript
async function forgotPassword(email) {
    let url = `http://localhost/api/auth/forgot-password`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        email,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/auth/forgot-password
    Content-Type: application/json

{
    "email": ""
}
```

---

### _Validate Reset Token_

```javascript
async function validateResetToken(token) {
    let url = `http://localhost/api/auth/validate-reset-token/${token}`;

    let response = await fetch(url, {
        method: 'GET',
    });
    console.log(response.status)
};

//Method
GET http://localhost:8080/api/auth/validate-reset-token/{token}
```

---

### _Reset Password_

```javascript
async function resetPassword(token, newPassword, confirmPassword) {
    let url = `http://localhost/api/auth/reset-password`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        token,
        newPassword,
        confirmPassword,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/auth/reset-password
    Content-Type: application/json

{
    "token": "",
    "newPassword": "",
    "confirmPassword": ""
}
```

---

### _Refresh Token_

```javascript
async function refreshToken(refreshToken) {
    let url = `http://localhost/api/auth/refresh`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        refreshToken,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": ""
}
```

---

### _User Profile_

```javascript
async function getProfile() {
    let url = `http://localhost/api/user/profile`;

    let response = await fetch(url, {
        method: 'GET',
    });
    console.log(response.status)
};

//Method
GET http://localhost:8080/api/user/profile
```

---

## Flashcards

O usuário deve estar com o estado logado, a partir do AcessToken que é enviado como resposta no json de retorno do login.
O Header precisa receber um Bearer {token} para que o usuário logado consiga manipular os recursos, isto vale para todos os métodos GET, PUT, POST and DELETE dos flashcards.

### _Create Flashcard_

```javascript
async function createFlashcard(term, areaId, description) {
    let url = `http://localhost/api/flashcards`;

    let headers = {
        'Content-Type': 'application/json',
    };

    
    let body = {
        term,
        areaId,
        description,
    };

    let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
POST http://localhost:8080/api/flashcards
Content-Type: application/json

{
  "term": "",
  "areaId": "",
  "description": ""
}
```

### _Update Flashcard_

```javascript
async function updateFlashcard(id, term, areaId, description) {
    let url = `http://localhost/api/flashcards/${id}`;

    let headers = {
        'Content-Type': 'application/json',
    };

    let body = {
        term,
        areaId,
        description,
    };

    let response = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
    });
    console.log(response.status)
};

//Method
PUT http://localhost:8080/api/flashcards/{{id}}
    Content-Type: application/json

{
    "term": "",
    "areaId": "",
    "description": ""
}
```

### _Delete Flashcard_

```javascript
async function deleteFlashcard(id) {
    let url = `http://localhost/api/flashcards/${id}`;

    let response = await fetch(url, {
        method: 'DELETE',
    });
    console.log(response.status)
};

//Method
DELETE http://localhost:8080/api/flashcards/{{id}}
```

### _Read Flashcards_

Este endpoint retorna todos os flashcards criados pelo usuário.

```javascript
async function getUserFlashcards(areaId) {
    let url = `http://localhost/api/flashcards&areaId=${encodeURIComponent(areaId)}`;

    let response = await fetch(url, {
        method: 'GET',
    });
    console.log(response.status)
};

//Method
GET http://localhost:8080/api/flashcards?

```
