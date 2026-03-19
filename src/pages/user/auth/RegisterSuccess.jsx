import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "../../../lib/framer-motion";
import { Button, Container, Row, Col, Card } from "react-bootstrap";

const ClientRegisterSuccess = () => {
    const navigate = useNavigate();

    // OPTIONAL: Redirect after 30 seconds
    useEffect(() => {
        const timer = setTimeout(() => navigate("/client/login"), 30000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-vh-100 d-flex align-items-center bg-light">
            <Container>
                <Row className="justify-content-center">
                    <Col md={6} lg={6}>
                        <Card className="shadow-lg border-0 rounded-4 text-center p-4">
                            <Card.Body>

                                {/* SUCCESS ICON */}
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                    className="mb-3"
                                >
                                    <div
                                        style={{
                                            width: "90px",
                                            height: "90px",
                                            borderRadius: "50%",
                                            margin: "0 auto",
                                            background: "#57B44720",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <motion.i
                                            className="ri-checkbox-circle-fill"
                                            style={{ fontSize: "60px", color: "#57B447" }}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, duration: 0.4 }}
                                        />
                                    </div>
                                </motion.div>

                                {/* TITLE */}
                                <h2 className="fw-bold text-success mb-2">
                                    Registration Successful!
                                </h2>

                                {/* MESSAGE */}
                                <p className="text-muted fs-5 mb-3">
                                    Your client account has been created successfully.
                                </p>

                                <p className="text-muted mb-4">
                                    Your account has not been activated. Please contact the system administrator to proceed with your account activation.
                                </p>


                                {/* BUTTON */}
                                <div className="d-grid">
                                    <Button
                                        size="lg"
                                        variant="primary"
                                        as={Link}
                                        to="/client/login"
                                        className="fw-semibold"
                                    >
                                        Go to Login
                                    </Button>
                                </div>

                                {/* AUTO REDIRECT NOTE */}
                                <p className="text-muted small mt-3">
                                    Redirecting automatically in 30 seconds...
                                </p>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ClientRegisterSuccess;
