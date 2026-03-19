// src/pages/users/Create.js
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Select from "react-select";
import { useTranslation } from "react-i18next";

import LayoutWrapper from "../components/LayoutWrapper";
import userService from "../../../services/userService";
import FormField from "../../../components/FormFields/FormField";

import {
  isValidPhone,
  emailPattern,
  passwordPattern,
} from "../../../utils/helpers";

import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import {
  SkeletonLayout,
  SkeletonForm,
} from "../../../components/Skeleton";

import { useState, useEffect } from "react";

const Create = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm({ mode: "onChange" });

  const password = watch("password");

  /* -----------------------------
     CREATE USER
  ----------------------------- */
  const createUser = async (formData) => {
    clearErrors();
    try {
      const response = await userService.create(formData);
      if (response?.data?.status) {
        toast.success(t("toast.user_created"));
        reset();
        setTimeout(() => navigate("/user"), 500);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors || {};
        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages[0] });
        });
      }
    }
  };



  return (
    <LayoutWrapper>
      {loading ? (
        <SkeletonLayout>
          <SkeletonForm fields={7} />
        </SkeletonLayout>
      ) : (
        <>
          {/* PAGE TITLE */}
          <Row>
            <Col>
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-0">{t("user.create_title")}</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">{t("breadcrumb.dashboard")}</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/user">{t("breadcrumb.users")}</Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {t("breadcrumb.create")}
                    </li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>

          {/* FORM */}
          <Form onSubmit={handleSubmit(createUser)} noValidate>
            <Row>
              <Col lg={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    {/* ===================== NAME ===================== */}
                    <FormField
                      field={{
                        type: "text",
                        name: "name",
                        label: t("form.name"),
                        placeholder: t("placeholder.name"),
                        rules: {
                          required: t("validation.name_required"),
                        },
                      }}
                      {...{ control, register, errors, touchedFields }}
                    />

                    {/* ===================== EMAIL ===================== */}
                    <FormField
                      field={{
                        type: "email",
                        name: "email",
                        label: t("form.email"),
                        placeholder: t("placeholder.email"),
                        rules: {
                          required: t("validation.email_required"),
                          pattern: {
                            value: emailPattern,
                            message: t("validation.email_invalid"),
                          },
                        },
                      }}
                      {...{ control, register, errors, touchedFields }}
                    />

                    {/* ===================== PHONE ===================== */}
                    <FormField
                      field={{
                        type: "phone",
                        name: "phone",
                        label: t("form.phone"),
                        placeholder: t("placeholder.phone"),
                        rules: {
                          required: t("validation.phone_required"),
                          validate: (v) => isValidPhone(v) || t("validation.phone_invalid"),
                        },
                       }}
                      {...{ control, register, errors, touchedFields }}
                    />

                    {/* ===================== PASSWORD ===================== */}
                    <FormField
                      field={{
                        type: "password",
                        name: "password",
                        label: t("form.password"),
                        placeholder: t("placeholder.password"),
                        rules: {
                          required: t("validation.password_required"),
                          pattern: {
                            value: passwordPattern,
                            message: t("validation.password_pattern"),
                          },
                        },
                      }}
                      {...{ control, register, errors, touchedFields }}
                    />

                    {/* ===================== CONFIRM PASSWORD ===================== */}
                    <FormField
                      field={{
                        type: "password",
                        name: "confirmPassword",
                        label: t("form.confirm_password"),
                        placeholder: t("placeholder.confirm_password"),
                        rules: {
                          required: t("validation.confirm_password_required"),
                          validate: (v) => v === password || t("validation.password_mismatch"),
                        },
                      }}
                      {...{ control, register, errors, touchedFields }}
                    />

                    {/* ===================== STATUS ===================== */}
                    <FormField
                      field={{
                        type: "select",
                        name: "status",
                        label: t("form.status"),
                        rules: {
                          required: t("validation.status_required"),
                        },
                        options: [
                          { value: "active", label: t("status.active") },
                          { value: "inactive", label: t("status.inactive") },
                        ],
                      }}
                      {...{ control, register, errors, touchedFields }}
                    />

                    {/* ===================== ROLE ===================== */}
                    <FormField
                      field={{
                        type: "select",
                        name: "role",
                        label: t("form.role"),
                        rules: {
                          required: t("validation.role_required"),
                        },
                        options: [
                          { value: "admin", label: t("role.admin") },
                          // { value: "editor", label: t("role.editor") },
                        ],
                      }}
                      {...{ control, register, errors, touchedFields }}
                    />

         
                    {/* ACTION BUTTONS */}
                    <div className="position-sticky bottom-0 py-2 text-end border-top bg-body border-body-tertiary">
                      <Button
                        type="submit"
                        variant="success"
                        disabled={isSubmitting}
                        className="me-2"
                      >
                        {isSubmitting && (
                          <Spinner
                            as="span"
                            size="sm"
                            animation="border"
                            className="me-1"
                          />
                        )}
                        {isSubmitting
                          ? t("button.submitting")
                          : t("button.submit")}
                      </Button>

                      <Button as={Link} to="/user" variant="secondary">
                        {t("button.cancel")}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>


              </Col>
            </Row>
          </Form>
        </>
      )}
    </LayoutWrapper>
  );
};

export default Create;
