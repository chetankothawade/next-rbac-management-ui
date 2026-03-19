import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import http from "../../../utils/http";
import { motion } from "../../../lib/framer-motion";

import { passwordPattern, emailPattern } from "../../../utils/helpers";

import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    InputGroup,
} from "react-bootstrap";

const ClientResetPassword = () => {
    const { token: routeToken, email: routeEmail } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const token = routeToken || searchParams.get("token") || "";
    const email = routeEmail || searchParams.get("email") || "";

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        watch,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm({ mode: "onBlur" });

    const passwordValue = watch("password");


    /** Pre-fill email + token */
    useEffect(() => {
        if (token) setValue("token", token);
        if (email) setValue("email", email);
    }, [token, email, setValue]);

    /** Submit new password (ADMIN style API) */
    const onSubmit = async (data) => {
        clearErrors();
        try {
            // ADMIN resets use POST "reset-password"
            const response = await http.post("client/reset-password", data);

            if (response?.data?.status) {
                toast.success(response?.data?.message);
                navigate("/client/login");
            }
        } catch (error) {
            if (error.response?.status === 422 && error.response.data.errors) {
                Object.entries(error.response.data.errors).forEach(([field, message]) =>
                    setError(field, { type: "server", message: message[0] })
                );
            }
        }
    };

    return (
        <div className="min-vh-100 bg-light d-flex align-items-center">
            <Container fluid>
                <Row className="min-vh-100">

                    {/* LEFT SIDE */}
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
                                alt="Reset Illustration"
                                className="img-fluid mb-4"
                                style={{ maxHeight: "330px" }}
                            />
                            <h2 className="fw-bold text-primary">Reset Your Password</h2>
                            <p className="text-muted fs-5">
                                Create a strong password to secure your client account.
                            </p>
                        </motion.div>
                    </Col>

                    {/* RIGHT FORM */}
                    <Col md={6} className="d-flex justify-content-center align-items-center p-4">
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
                                        <img src="/assets/images/logo-dark.png" alt="Logo" height={38} />
                                        <h3 className="fw-bold mt-3 text-primary">Create New Password</h3>
                                        <p className="text-muted">
                                            Choose a secure password different from your old one.
                                        </p>
                                    </div>

                                    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                                        {/* REQUIRED HIDDEN FIELDS */}
                                        <input type="hidden" {...register("token")} />
                                        <input
                                            type="hidden"
                                            {...register("email", {
                                                pattern: { value: emailPattern, message: "Invalid email" },
                                            })}
                                        />

                                        {/* PASSWORD */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>New Password</Form.Label>

                                            <InputGroup>
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter new password"
                                                    autoComplete="new-password"
                                                    isInvalid={!!errors.password}
                                                    isValid={touchedFields.password && !errors.password}
                                                    {...register("password", {
                                                        required: "Password is required",
                                                        pattern: {
                                                            value: passwordPattern,
                                                            message: "Must include upper, lower, number & 8+ chars",
                                                        },
                                                    })}
                                                />

                                                <Button
                                                    variant="outline-secondary"
                                                    onClick={() => setShowPassword((v) => !v)}
                                                >
                                                    <i className={showPassword ? "ri-eye-off-fill" : "ri-eye-fill"} />
                                                </Button>
                                            </InputGroup>

                                            {errors.password && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.password.message}
                                                </div>
                                            )}
                                        </Form.Group>

                                        {/* CONFIRM PASSWORD */}
                                        <Form.Group className="mb-3">
                                            <Form.Label>Confirm Password</Form.Label>

                                            <Form.Control
                                                type="password"
                                                placeholder="Confirm password"
                                                autoComplete="new-password"
                                                isInvalid={!!errors.password_confirmation}
                                                isValid={
                                                    touchedFields.password_confirmation &&
                                                    !errors.password_confirmation
                                                }
                                                {...register("password_confirmation", {
                                                    required: "Please confirm your password",
                                                    validate: (value) =>
                                                        value === passwordValue || "Passwords do not match",
                                                })}
                                            />

                                            {errors.password_confirmation && (
                                                <div className="invalid-feedback d-block">
                                                    {errors.password_confirmation.message}
                                                </div>
                                            )}
                                        </Form.Group>

                                        {/* SUBMIT */}
                                        <div className="d-grid mt-3">
                                            <Button type="submit" size="lg" variant="primary" disabled={isSubmitting}>
                                                {isSubmitting && (
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                )}
                                                Reset Password
                                            </Button>
                                        </div>
                                    </Form>

                                    {/* FOOTER */}
                                    <div className="text-center mt-4">
                                        <p className="mb-0 text-muted">
                                            Wait! I remember my password?
                                            <Link
                                                to="/client/login"
                                                className="fw-semibold text-primary text-decoration-underline ms-1"
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

export default ClientResetPassword;
