import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "../../../lib/framer-motion";

import http from "../../../utils/http";

import {
  emailPattern,
  passwordPattern,
} from "../../../utils/helpers";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    clearErrors,
    setValue,
  } = useForm({ mode: "onBlur" });

  const passwordValue = watch("password");

  useEffect(() => {
    setValue("role", "admin"); // Auto-assign admin role
  }, [setValue]);

  /** Submit register form */
  const onSubmit = async (data) => {
    clearErrors();

    try {
      const result = await http.post("register", data);

      if (result.data.status) {
        toast.success(result.data.message);
        navigate("/register-success");
      }
    } catch (error) {
      if (error.response?.status === 422 && error.response.data.errors) {
        Object.entries(error.response.data.errors).forEach(([key, value]) =>
          setError(key, { type: "server", message: value[0] })
        );
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

              <h2 className="fw-bold mt-4">Create admin access</h2>
              <p className="opacity-75">
                Set up your secure account to manage documents and approvals.
              </p>
              <div className="mt-4 d-flex justify-content-center gap-3 small">
                <span>🔒 Secure</span>
                <span>⚖️ Compliant</span>
                <span>⚡ Fast</span>
              </div>
            </motion.div>
          </Col>

          <Col md={6} className="d-flex align-items-center justify-content-center p-4">
            <motion.div
              style={{ width: "100%", maxWidth: "480px" }}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-4 border-0 rounded-4 shadow-sm">
                <Card.Body>
                  <div className="text-center mb-4">
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
                      Create your account
                    </h3>

                    <div
                      style={{
                        width: "60px",
                        height: "3px",
                        background: "linear-gradient(90deg, #00AEEF, #F9A825, #00C853)",
                        margin: "10px auto",
                        borderRadius: "10px",
                      }}
                    />

                    <p className="text-muted mb-0">
                      Start managing your secure workspace
                    </p>
                  </div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: {
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                  >
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <input type="hidden" {...register("role")} value="admin" />

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label>Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter full name"
                            isInvalid={!!errors.name}
                            isValid={touchedFields.name && !errors.name}
                            {...register("name", { required: "Name is required" })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.name?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </motion.div>

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
                            autoComplete="email"
                            isInvalid={!!errors.email}
                            isValid={touchedFields.email && !errors.email}
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: emailPattern,
                                message: "Invalid email format",
                              },
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </motion.div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter password"
                              autoComplete="new-password"
                              isInvalid={!!errors.password}
                              isValid={touchedFields.password && !errors.password}
                              {...register("password", {
                                required: "Password is required",
                                pattern: {
                                  value: passwordPattern,
                                  message: "Must be 8+ chars, include upper/lower/digit",
                                },
                              })}
                            />
                            <Button
                              variant="outline-secondary"
                              onClick={() => setShowPassword((p) => !p)}
                            >
                              <i className={showPassword ? "ri-eye-off-fill" : "ri-eye-fill"} />
                            </Button>
                          </InputGroup>
                          <Form.Control.Feedback type="invalid" className="d-block">
                            {errors.password?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </motion.div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm password"
                            autoComplete="new-password"
                            isInvalid={!!errors.confirmPassword}
                            isValid={touchedFields.confirmPassword && !errors.confirmPassword}
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === passwordValue || "Passwords do not match",
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </motion.div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Check
                          className="mb-3"
                          type="checkbox"
                          label={(
                            <>
                              I agree to the{" "}
                              <a href="/terms" style={{ color: "#00AEEF" }}>
                                Terms & Conditions
                              </a>
                            </>
                          )}
                          isInvalid={!!errors.terms}
                          {...register("terms", { required: "You must accept the terms" })}
                        />
                        {errors.terms && (
                          <div className="invalid-feedback d-block">
                            {errors.terms?.message}
                          </div>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <div className="d-grid mt-2">
                          <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            style={{
                              background: "linear-gradient(135deg, #00AEEF, #00C853)",
                              border: "none",
                              color: "#fff",
                            }}
                            className="rounded-3"
                          >
                            {isSubmitting && (
                              <span className="spinner-border spinner-border-sm me-2"></span>
                            )}
                            Sign Up
                          </Button>
                        </div>
                      </motion.div>
                    </Form>
                  </motion.div>

                  <div className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/login" style={{ color: "#00AEEF" }}>
                      Sign In
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

export default Register;
