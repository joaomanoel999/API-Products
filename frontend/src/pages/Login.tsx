import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { authService } from '../services/authService';

interface LoginProps {
  onLogin: () => void;
  onGoToRegister: () => void; // NOVO
}

export default function Login({ onLogin, onGoToRegister }: LoginProps) { // ALTERADO
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ username, password });
      onLogin();
    } catch (err) {
      if (isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Usuário ou senha inválidos.');
        } else if (!err.response) {
          setError('Não foi possível conectar ao servidor.');
        } else {
          setError('Erro no servidor. Tente novamente.');
        }
      } else {
        setError('Erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Entrar</h1>

      <label>
        Usuário
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>

      <label>
        Senha
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>

      {/* NOVO: leva pra tela de criar conta */}
      <button type="button" onClick={onGoToRegister}>
        Criar conta
      </button>
    </form>
  );
}