import React, { useState } from 'react';

const FormularioLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estados para Login
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Estados para Cadastro
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Função para Login - CORRIGIDA
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Resposta não é JSON. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `Erro ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Login bem-sucedido
      console.log('Login bem-sucedido:', data);

      setMessage('Login realizado com sucesso!');

      // Aqui você pode redirecionar o usuário
      // setTimeout(() => navigate('/dashboard'), 1500);

    } catch (error) {
      console.error('Erro no login:', error.message);
      setMessage(` Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para Cadastro - CORRIGIDA
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validações básicas
    if (registerData.password !== registerData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setMessage(' A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      // MUDANÇA 4: URL consistente com proxy (remover localhost:8080)
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password
        }),
      });

      // MUDANÇA 5: Mesma verificação de JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Resposta não é JSON. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || `Erro ${response.status} - ${response.statusText}`;
        throw new Error(errorMessage);
      }

      // Cadastro bem-sucedido
      console.log('Cadastro bem-sucedido:', data);
      setMessage('✅ Cadastro realizado com sucesso! Faça login para continuar.');

      // Limpa o formulário e volta para login
      setRegisterData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      setTimeout(() => {
        setIsLogin(true);
        setMessage('');
      }, 2000);

    } catch (error) {
      console.error('Erro no cadastro:', error.message);
      setMessage(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para alternar entre login e cadastro
  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 400px;
          margin: 50px auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }

        .title {
          text-align: center;
          margin-bottom: 30px;
          color: #333;
          font-size: 24px;
          font-weight: 600;
        }

        .input {
          width: 100%;
          padding: 12px;
          margin: 8px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
          background-color: #fff;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }

        .button {
          width: 100%;
          padding: 12px;
          margin: 16px 0;
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .button:enabled {
          background-color: #007bff;
        }

        .button:enabled:hover {
          background-color: #0056b3;
        }

        .button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .message {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-size: 14px;
          text-align: center;
        }

        .message-success {
          background-color: #e8f5e8;
          color: #2e7d32;
          border: 1px solid #4caf50;
        }

        .message-error {
          background-color: #ffebee;
          color: #c62828;
          border: 1px solid #f44336;
        }

        .toggle-link {
          text-align: center;
          margin-top: 20px;
          color: #007bff;
          cursor: pointer;
          text-decoration: underline;
          font-size: 14px;
        }

        .toggle-link:hover {
          color: #0056b3;
        }

        .form {
          display: flex;
          flex-direction: column;
        }
      `}</style>

      <h1 className="title">
        {isLogin ? 'Fazer Login' : 'Criar Conta'}
      </h1>

      {message && (
        <div className={`message ${message.includes('❌') || message.includes('Erro') ? 'message-error' : 'message-success'}`}>
          {message}
        </div>
      )}

      {isLogin ? (
        // FORMULÁRIO DE LOGIN
        <div className="form">
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Senha"
            className="input"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            required
            minLength={6}
            disabled={loading}
          />

          <button
            className="button"
            onClick={handleLogin}
            disabled={loading || !loginData.email || !loginData.password}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      ) : (
        // FORMULÁRIO DE CADASTRO
        <div className="form">
          <input
            type="text"
            placeholder="Nome completo"
            className="input"
            value={registerData.name}
            onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
            required
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={registerData.email}
            onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Senha (mínimo 6 caracteres)"
            className="input"
            value={registerData.password}
            onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
            required
            minLength={6}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Confirmar senha"
            className="input"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
            required
            minLength={6}
            disabled={loading}
          />

          <button
            className="button"
            onClick={handleRegister}
            disabled={loading || !registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword}
          >
            {loading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </div>
      )}

      <div
        className="toggle-link"
        onClick={toggleForm}
      >
        {isLogin
          ? 'Não tem uma conta? Cadastre-se aqui'
          : 'Já tem uma conta? Faça login aqui'
        }
      </div>
    </div>
  );
};

export default FormularioLogin;