import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import http from "../../../utils/http";
import { motion } from "../../../lib/framer-motion";

import { emailPattern } from "../../../utils/helpers";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
} from "react-bootstrap";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    clearErrors,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    clearErrors();

    try {
      const response = await http.post("forgot-password", data);

      if (response?.data?.status) {
        toast.success(response?.data?.message);
        navigate("/login");
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

              <h2 className="fw-bold mt-4">Recover your account</h2>
              <p className="opacity-75">
                Enter your email and we will send secure reset instructions.
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
                      Forgot password
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
                      Enter your email and we will send reset instructions
                    </p>
                  </div>

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
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 },
                        }}
                      >
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            isInvalid={!!errors.email}
                            isValid={touchedFields.email && !errors.email}
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: emailPattern,
                                message: "Invalid email address",
                              },
                            })}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                          </Form.Control.Feedback>
                        </Form.Group>
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
                            Send Reset Link
                          </Button>
                        </div>
                      </motion.div>
                    </Form>
                  </motion.div>

                  <div className="text-center mt-4">
                    <span className="text-muted">Remember your password?</span>{" "}
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

export default ForgotPassword;
