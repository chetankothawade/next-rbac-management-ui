// admin/auth/Login.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "../../../lib/framer-motion";

import { useAuthHandlers } from "../../../redux/authHelpers";
import { fetchModules } from "../../../redux/modulesSlice";
import { emailPattern } from "../../../utils/helpers";
import http from "../../../utils/http";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { handleLogin } = useAuthHandlers();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    clearErrors,
    setValue,
  } = useForm({
    mode: "onBlur",
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    const remembered = localStorage.getItem("remembered_admin");
    if (remembered) {
      const { email, password } = JSON.parse(remembered);
      setValue("email", email);
      setValue("password", atob(password));
      setValue("remember", true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    clearErrors();
    try {
      const result = await http.post("login", data);

      if (result.data.status) {
        toast.success(result.data.message);
        const { user, token } = result.data.data;

        handleLogin(dispatch, user, token, user.role);

        if (data.remember) {
          localStorage.setItem(
            "remembered_admin",
            JSON.stringify({
              email: data.email,
              password: btoa(data.password),
            })
          );
        } else {
          localStorage.removeItem("remembered_admin");
        }

        dispatch(fetchModules());
      }
    } catch (error) {
      if (error.response?.status === 422 && error.response.data.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key, { type: "server", message: value[0] });
        });
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #00AEEF10, #00C85310)",
      }}
    >
      <Container fluid>
        <Row className="min-vh-100">

          {/* LEFT PANEL */}
          <Col
            md={6}
            className="d-none d-md-flex align-items-center justify-content-center text-white"
            style={{
              background: "linear-gradient(135deg, #00AEEF, #00C853)",
            }}
          >
            <motion.div
              className="text-center px-5"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >

              {/* FLOATING SVG */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <svg width="260" height="200" viewBox="0 0 260 200">
                  <rect x="20" y="20" width="220" height="150" rx="12" fill="#ffffff" opacity="0.95" />
                  <line x1="40" y1="60" x2="200" y2="60" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="40" y1="90" x2="200" y2="90" stroke="#cbd5e1" strokeWidth="2" />
                  <line x1="40" y1="120" x2="140" y2="120" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M60 140 Q90 120 120 140 T180 140" stroke="#00AEEF" strokeWidth="3" fill="none" />
                  <circle cx="200" cy="140" r="12" fill="#00C853" />
                  <path d="M195 140 L200 145 L210 135" stroke="#fff" strokeWidth="2" fill="none" />
                </svg>
              </motion.div>

              <h2 className="fw-bold mt-4">Welcome to NACK</h2>

              <p className="opacity-75">
                Secure digital signing & smart investment platform.
              </p>

              <div className="mt-4 d-flex justify-content-center gap-3 small">
                <span>🔒 Secure</span>
                <span>⚖️ Compliant</span>
                <span>⚡ Fast</span>
              </div>
            </motion.div>
          </Col>

          {/* RIGHT PANEL */}
          <Col md={6} className="d-flex align-items-center justify-content-center p-4">
            <motion.div
              style={{ width: "100%", maxWidth: "480px" }}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-4 border-0 rounded-4 shadow-sm">
                <Card.Body>

                  {/* HEADER */}
                  <div className="text-center mb-4">

                    {/* LOGO */}
                    <motion.img
                      src="/assets/images/logo-light.png"
                      alt="NACK"
                      style={{ height: "40px" }}
                      className="mb-4"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />

                    <h3 className="fw-bold" style={{ color: "#00AEEF" }}>
                      Sign in to your account
                    </h3>

                    <div
                      style={{
                        width: "60px",
                        height: "3px",
                        background:
                          "linear-gradient(90deg, #00AEEF, #F9A825, #00C853)",
                        margin: "10px auto",
                        borderRadius: "10px",
                      }}
                    />

                    <p className="text-muted mb-0">
                      Access your secure dashboard
                    </p>
                  </div>

                  {/* FORM */}
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.12 },
                      },
                    }}
                  >
                    <Form onSubmit={handleSubmit(onSubmit)}>

                      {/* EMAIL */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            isInvalid={!!errors.email}
                            isValid={touchedFields.email && !errors.email}
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: emailPattern,
                                message: "Invalid email",
                              },
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </motion.div>

                      {/* PASSWORD */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Group className="mb-3">
                          <div className="d-flex justify-content-between">
                            <Form.Label>Password</Form.Label>
                            <Link to="/forgot-password" style={{ color: "#00AEEF" }}>
                              Forgot?
                            </Link>
                          </div>

                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              isInvalid={!!errors.password}
                              isValid={touchedFields.password && !errors.password}
                              {...register("password", {
                                required: "Password required",
                              })}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              👁
                            </Button>
                          </InputGroup>

                          <Form.Control.Feedback
                            type="invalid"
                            className="d-block"
                          >
                            {errors.password?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </motion.div>

                      {/* REMEMBER */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Check
                          {...register("remember")}
                          type="checkbox"
                          label="Remember me"
                          className="mb-3"
                        />
                      </motion.div>

                      {/* BUTTON */}
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <div className="d-grid">
                          <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            style={{
                              background:
                                "linear-gradient(135deg, #00AEEF, #00C853)",
                              border: "none",
                              color: "#fff",
                            }}
                            className="rounded-3"
                          >
                            {isSubmitting && (
                              <span className="spinner-border spinner-border-sm me-2"></span>
                            )}
                            Sign In
                          </Button>
                        </div>
                      </motion.div>

                    </Form>
                  </motion.div>

                  {/* TRUST */}
                  <div className="text-center mt-3 small text-muted">
                    🔒 Your data is encrypted & secure
                  </div>

                  {/* FOOTER */}
                  <div className="text-center mt-4">
                    Don’t have an account?{" "}
                    <Link to="/register" style={{ color: "#00AEEF" }}>
                      Signup
                    </Link>
                  </div>

                </Card.Body>
              </Card>
            </motion.div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default Login;
