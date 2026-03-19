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
  Form
} from "react-bootstrap";

const ClientForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    clearErrors,
  } = useForm({ mode: "onBlur" });

  /** Submit */
  const onSubmit = async (data) => {
    clearErrors();
    try {
      const response = await http.post("client/forgot-password", data);

      if (response.data.success) {
        toast.success(response?.data?.message);
        navigate("/client/login");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          setError(key, { type: "server", message: value[0] });
        });
      }
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <Container fluid>
        <Row className="min-vh-100">

          {/* LEFT PANEL */}
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
                alt="Illustration"
                className="img-fluid mb-4"
                style={{ maxHeight: "330px" }}
              />

              <h2 className="fw-bold text-primary">Reset Your Password</h2>
              <p className="text-muted fs-5">
                A secure process to help you regain access to your account.
              </p>
            </motion.div>
          </Col>

          {/* RIGHT FORM PANEL */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%", maxWidth: "480px" }}
            >
              <Card className="shadow border-0 rounded-4 p-4">
                <Card.Body>

                  {/* HEADER */}
                  <div className="text-center mb-4">
                    <img
                      src="/assets/images/logo-dark.png"
                      alt="Logo"
                      height={38}
                    />
                    <h3 className="fw-bold mt-3 text-primary">Forgot Password?</h3>
                    <p className="text-muted">
                      Enter your email and we’ll send reset instructions.
                    </p>
                  </div>

                  {/* FORM */}
                  <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* EMAIL */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>

                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
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

                    {/* SUBMIT BUTTON */}
                    <div className="d-grid">
                      <Button
                        type="submit"
                        size="lg"
                        variant="primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        )}
                        Send Reset Link
                      </Button>
                    </div>
                  </Form>

                  {/* FOOTER */}
                  <div className="text-center mt-4">
                    <p className="text-muted m-0">
                      Remember your password?{" "}
                      <Link
                        to="/client/login"
                        className="text-primary fw-semibold"
                      >
                        Login here
                      </Link>
                    </p>
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

export default ClientForgotPassword;
