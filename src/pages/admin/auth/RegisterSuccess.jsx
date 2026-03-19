import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "../../../lib/framer-motion";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const RegisterSuccess = () => {
    const navigate = useNavigate();

      useEffect(() => {
        const timer = setTimeout(() => navigate("/login"), 30000);
        return () => clearTimeout(timer);
      }, [navigate]);

    return (
        <div className="min-vh-100 d-flex align-items-center">

            <Container fluid>
                <Row className="min-vh-100">

                    {/* Left Side Illustration */}
                    <Col
                        md={6}
                        className="d-none d-md-flex align-items-center justify-content-center p-5 text-white"
                        style={{
                            background: "linear-gradient(140deg, #0d6efd 0%, #0bb783 100%)",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -60 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center"
                        >
                            <img
                                src="/assets/images/login-illustration.svg"
                                alt="Success Illustration"
                                className="img-fluid mb-4"
                                style={{ maxHeight: "320px" }}
                            />

                            <h2 className="fw-bold text-white">Account Created!</h2>
                            <p className="opacity-75 fs-5">
                                You're all set. Redirecting you to login...
                            </p>
                        </motion.div>
                    </Col>

                    {/* Right Side Card */}
                    <Col
                        md={6}
                        className="d-flex align-items-center justify-content-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            style={{ width: "100%", maxWidth: "450px" }}
                        >
                            <Card className="p-4 shadow-lg border-0 rounded-4 glass-card text-center">
                                <Card.Body>

                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="d-flex justify-content-center mb-3"
                                    >
                                        <div
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                borderRadius: "50%",
                                                background: "#0bb78322",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <i
                                                className="ri-checkbox-circle-fill"
                                                style={{ fontSize: "48px", color: "#0bb783" }}
                                            ></i>
                                        </div>
                                    </motion.div>

                                    <h3 className="fw-bold text-success">Registration Successful</h3>
                                    <p className="text-muted">
                                        Your account has not been activated. Please contact the system administrator to proceed with your account activation.
                                    </p>

                                    <Button
                                        variant="success"
                                        className="mt-3 fw-bold"
                                        onClick={() => navigate("/login")}
                                    >
                                        Go to Login
                                    </Button>

                                </Card.Body>
                            </Card>
                        </motion.div>
                    </Col>

                </Row>
            </Container>
        </div>
    );
};

export default RegisterSuccess;
