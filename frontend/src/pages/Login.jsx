import API from "../services/api";

import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { useAppContext } from "../context/AppContext";
import { Lock, Mail, User } from "lucide-react";
import "./Login.css";

// ================= 3D Background =================
const FloatingShape = ({ position, color, type }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh position={position} ref={meshRef}>
        {type === "box" && <boxGeometry args={[1, 1, 1]} />}
        {type === "torus" && <torusGeometry args={[0.8, 0.2, 16, 100]} />}
        {type === "tetrahedron" && <tetrahedronGeometry args={[1.2]} />}
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

const Background3D = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f0ff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0055" />

        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />

        <FloatingShape position={[-4, 2, 0]} color="#00f0ff" type="torus" />
        <FloatingShape
          position={[4, -2, -2]}
          color="#ff0055"
          type="tetrahedron"
        />
        <FloatingShape position={[0, 0, -4]} color="#8a2be2" type="box" />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

// ================= MAIN COMPONENT =================
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAppContext();
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔥 REAL AUTH LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email.includes("@")) {
      setError("Enter valid email");
      return;
    }

    setIsLoading(true);

    try {
      let res;

      if (isLogin) {
        // LOGIN
        res = await API.post("/auth/login", {
          email: credentials.email,
          password: credentials.password,
        });
      } else {
        // REGISTER
        res = await API.post("/auth/register", {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
        });
      }

      // save token
      localStorage.setItem("token", res.data.token);

      // optional context
      login(credentials.email, credentials.password);

      // redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Background3D />

      <div className="auth-wrapper">
        <div className="glass-panel auth-card">
          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={credentials.name}
                onChange={handleChange}
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={credentials.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
            </button>
          </form>

          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Create account" : "Already have account?"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
