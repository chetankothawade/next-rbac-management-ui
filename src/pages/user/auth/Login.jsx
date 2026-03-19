import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "../../../lib/framer-motion";
import http from "../../../utils/http";
import { useAuthHandlers } from "../../../redux/authHelpers";
import {
  emailPattern,
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

const ClientLogin = () => {

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

  /** Load remembered login */
  useEffect(() => {
    const remembered = localStorage.getItem("remembered_user");
    if (remembered) {
      const { email, password } = JSON.parse(remembered);
      setValue("email", email);
      setValue("password", atob(password));
      setValue("remember", true);
    }
  }, [setValue]);

  /** Handle Login */
  const onSubmit = async (data) => {
    clearErrors();
    try {
      const result = await http.post("client/login", data);

      if (result.data.status) {
        toast.success(result.data.message);

        const { user, token } = result.data.data;
        handleLogin(dispatch, user, token, 'user');

        if (data.remember) {
          localStorage.setItem(
            "remembered_user",
            JSON.stringify({
              email: data.email,
              password: btoa(data.password),
            })
          );
        } else {
          localStorage.removeItem("remembered_user");
        }


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
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <Container fluid>
        <Row className="min-vh-100">

          {/* LEFT SIDE GRAPHIC */}
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
                alt="Client Portal"
                className="img-fluid mb-4"
                style={{ maxHeight: "360px" }}
              />

              <h2 className="fw-bold mb-2" style={{ color: "#00A3E0" }}>
                Welcome Back to NACK Portal
              </h2>

              <p className="text-muted fs-5">
                Log in to access invoices, payments & more.
              </p>
            </motion.div>
          </Col>

          {/* RIGHT LOGIN FORM */}
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ width: "100%", maxWidth: "480px" }}
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

                    <h3 className="mt-3 fw-bold text-primary">Welcome Back</h3>
                    <p className="text-muted m-0">Sign in to continue</p>
                  </div>

                  {/* LOGIN FORM */}
                  <Form onSubmit={handleSubmit(onSubmit)}>

                    {/* EMAIL */}
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>

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

                    {/* PASSWORD */}
                    <Form.Group className="mb-3">
                      <div className="d-flex justify-content-between">
                        <Form.Label>Password</Form.Label>

                        <Link
                          to="/client/forgot-password"
                          className="small fw-semibold text-primary"
                        >
                          Forgot password?
                        </Link>
                      </div>

                      <InputGroup>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          isInvalid={!!errors.password}
                          isValid={touchedFields.password && !errors.password}
                          {...register("password", {
                            required: "Password is required"
                          })}
                        />

                        <Button
                          variant="outline-secondary"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          <i
                            className={
                              showPassword ? "ri-eye-off-fill" : "ri-eye-fill"
                            }
                          />
                        </Button>
                      </InputGroup>

                      <Form.Control.Feedback type="invalid" className="d-block">
                        {errors.password?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {/* REMEMBER ME */}
                    <Form.Check
                      {...register("remember")}
                      type="checkbox"
                      label="Remember me"
                      className="mb-3"
                    />
                    {/* SUBMIT BUTTON */}
                    <div className="d-grid mb-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting && (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        )}
                        Login
                      </Button>
                    </div>
                  </Form>

                  {/* FOOTER */}
                  <div className="text-center mt-3">
                    Don’t have an account?{" "}
                    <Link to="/client/register" className="text-primary fw-semibold">
                      Create Account
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

export default ClientLogin;
