import { useState } from 'react';
import { asyncLogin } from '../../../services';

export const LoginPage = () => {
  const [state, setState] = useState<{ userId: string; password: string }>({
    userId: '',
    password: '',
  });
  const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    asyncLogin(state.userId, state.password)
      .then(() => {
        alert('Login success');
        window.location.href = '/';
      })
      .catch((error) => {
        console.error(error);
        alert('Login failed');
      });
  };
  return (
    <div className="login">
      <input
        placeholder="user id"
        type="text"
        value={state.userId}
        onChange={(e) => setState({ ...state, userId: e.target.value })}
      />
      <input
        placeholder="user password"
        type="password"
        value={state.password}
        onChange={(e) => setState({ ...state, password: e.target.value })}
      />
      <button onClick={(e) => onSubmit(e)}> Login </button>
    </div>
  );
};
