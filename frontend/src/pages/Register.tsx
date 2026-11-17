import { useState } from 'react';
import type { FormEvent } from 'react';
import { isAxiosError } from 'axios';
import { authService } from '../services/authService';

interface RegisterProps {
  onBack: () => void;
}

export default function Register({ onBack }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('As senhas não conferem.');
      return;
    }

    setLoading(true);

    try {
      await authService.register({ username, password, role: 'USER' });
      setSuccess(true);
    } catch (err) {
      if (isAxiosError(err) && !err.response) {
        setError('Não foi possível conectar ao servidor.');
      } else if (isAxiosError(err) && err.response?.status === 400) {
        setError('Este usuário já existe.');
      } else {
        setError('Erro ao criar a conta.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div>
        <h1>Conta criada!</h1>
        <p>Agora você já pode entrar.</p>
        <button onClick={onBack}>Ir para o login</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Criar conta</h1>

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

      <label>
        Confirmar senha
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </label>

      {error && <p>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar conta'}
      </button>

      <button type="button" onClick={onBack}>
        Voltar
      </button>
    </form>
  );
}