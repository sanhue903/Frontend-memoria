import { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    fetch('/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        navigate('/students');
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
  
  return (
    <div>
      <h1 className="titulo">Bienvenid@ al botiquín de las emociones</h1>
      <div className="login-form">
        <h2>Inicio de sesión</h2>
        <input type="text" placeholder="Email" value={ email } onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={ password } onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Ingresar</button>
      </div>
    </div>
  );
}

export default Login;
