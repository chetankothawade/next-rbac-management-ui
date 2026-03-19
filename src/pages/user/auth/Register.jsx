import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { motion } from "../../../lib/framer-motion";
import http from "../../../utils/http";

import {
  emailPattern,
  passwordPattern
} from "../../../utils/helpers";

import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup
} from "react-bootstrap";

const ClientRegister = () => {
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
    setValue("role", "client"); // auto assign for API
  }, [setValue]);

  /** Submit handler */
  const onSubmit = async (data) => {
    clearErrors();

    try {
      const result = await http.post("client/register", data);

      if (result.data.status) {
        toast.success("Registration successful!");
        navigate("/client/register-success");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        Object.entries(error.response.data.errors).forEach(([key, value]) =>
          setError(key, { type: "server", message: value[0] })
        );
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container fluid>
        <Row className="min-vh-100">

          {/* LEFT ILLUSTRATION PANEL */}
          <Col
            md={6}
            className="d-none d-md-flex align-items-center justify-content-center p-5"
            style={{ background: "#F7FAFC" }}
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <img
                src="/assets/images/client-portal.svg"
                alt="Client Illustration"
                className="img-fluid mb-4"
                style={{ maxHeight: "360px" }}
              />

              <h2 className="fw-bold mb-2" style={{ color: "#00A3E0" }}>
                Welcome to NACK Client Portal
              </h2>
              <p className="text-muted fs-5">
                Create your client account to access invoices & payment history.
              </p>
            </motion.div>
          </Col>

          {/* RIGHT REGISTRATION FORM */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%", maxWidth: "500px" }}
            >
              <Card className="p-4 shadow border-0 rounded-4">
                <Card.Body>

                  {/* HEADER */}
                  <div className="text-center mb-4">
                    <motion.img
                      src="/assets/images/logo-light.png"
                      height={40}
                      alt="Logo"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                    />

                    <h3 className="mt-3 fw-bold text-primary m-0">
                      Create Your Account
                    </h3>

                    <p className="text-muted">Join the NACK client portal today.</p>
                  </div>

                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" {...register("role")} value="client" />

                    {/* FULL NAME */}
                    <Form.Group className="mb-2">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        isInvalid={!!errors.name}
                        isValid={touchedFields.name && !errors.name}
                        {...register("name", {
                          required: "Name is required"
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* EMAIL */}
                    <Form.Group className="mb-2">
                      <Form.Label>Email</Form.Label>
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
                            message: "Invalid email format"
                          }
                        })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* PASSWORD */}
                    <Form.Group className="mb-2">
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
                              message:
                                "Must be 8+ chars with upper/lower/digit"
                            }
                          })}
                        />

                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          <i className={showPassword ? "ri-eye-off-fill" : "ri-eye-fill"} />
                        </Button>
                      </InputGroup>

                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* CONFIRM PASSWORD */}
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
                            value === passwordValue || "Passwords do not match"
                        })}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* TERMS & CONDITIONS */}
                    <Form.Check
                      className="mb-3"
                      type="checkbox"
                      label={
                        <>
                          I agree to the{" "}
                          <a href="/terms" className="text-primary fw-semibold">
                            Terms & Conditions
                          </a>
                        </>
                      }
                      isInvalid={!!errors.terms}
                      {...register("terms", {
                        required: "You must accept the terms"
                      })}
                    />

                    {errors.terms && (
                      <div className="invalid-feedback d-block">
                        {errors.terms?.message}
                      </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <div className="d-grid mt-3">
                      <Button
                        type="submit"
                        size="lg"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        )}
                        Create Account
                      </Button>
                    </div>
                  </Form>

                  {/* FOOTER */}
                  <div className="text-center mt-4">
                    Already have an account?{" "}
                    <Link to="/client/login" className="text-primary fw-semibold">
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

export default ClientRegister;
