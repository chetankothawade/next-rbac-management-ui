// src/pages/admin/users/Edit.js
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import toast from "react-hot-toast";
import Select from "react-select";
import { useTranslation } from "react-i18next";

import LayoutWrapper from "../components/LayoutWrapper";
import userService from "../../../services/userService";
import { useAuthContext } from "../../../redux/hooks/useAuthContext";
import { useDispatch } from "react-redux";
import { useAuthHandlers } from "../../../redux/authHelpers";
import FormField from "../../../components/FormFields/FormField";

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

import {
  isValidPhone,
  emailPattern,
  passwordPattern,
} from "../../../utils/helpers";

const Edit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { authUuid } = useAuthContext();
  const isOwnProfile = String(authUuid) === String(uuid);

  const dispatch = useDispatch();
  const { handleLoginAuth } = useAuthHandlers();

  const [loading, setLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);


  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    mode: "onChange",
  });

  /* -----------------------------
     FETCH USER
  ----------------------------- */
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.get(uuid);

      if (response?.data?.status) {
        const user = response.data.data;

        ["name", "email", "phone", "role", "status"].forEach((field) =>
          setValue(field, user[field])
        );

        setValue("client_id", user.client?.id || "");

      } else {
        toast.error(t("toast.user_not_found"));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.message ||
        t("toast.fetch_failed")
      );
    } finally {
      setLoading(false);
    }
  }, [uuid, setValue, t]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /* -----------------------------
     UPDATE USER
  ----------------------------- */
  const updateUser = async (formData) => {
    clearErrors();
    try {
      const response = await userService.update(uuid, formData);

      if (response?.data?.status) {
        if (isOwnProfile) {
          handleLoginAuth(
            dispatch,
            response.data.data,
            null,
            response.data.data.role
          );
        }

        toast.success(t("toast.user_updated"));

        setTimeout(() => {
          navigate(`/user?page=${page}`);
        }, 500);
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const serverErrors = error.response.data.errors || {};
        Object.keys(serverErrors).forEach((field) => {
          setError(field, {
            type: "server",
            message: serverErrors[field][0],
          });
        });
      }
    }
  };


  return (
    <LayoutWrapper>
      {loading ? (
        <SkeletonLayout>
          <SkeletonForm fields={6} />
        </SkeletonLayout>
      ) : (
        <>
          {/* HEADER */}
          <Row>
            <Col>
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-0">{t("user.edit_title")}</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">
                        {t("breadcrumb.dashboard")}
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={`/user?page=${page}`}>
                        {t("breadcrumb.users")}
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {t("breadcrumb.edit")}
                    </li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>

          {/* FORM */}
          <Form onSubmit={handleSubmit(updateUser)} noValidate>
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

                    {/* PASSWORD TOGGLE */}
                    <div className="mb-3">
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() =>
                          setShowPasswordFields(!showPasswordFields)
                        }
                      >
                        {showPasswordFields
                          ? t("button.cancel_password_change")
                          : t("button.change_password")}
                      </Button>
                    </div>

                    {/* PASSWORD FIELDS */}
                    {showPasswordFields && (
                      <>
                        {/* ===================== PASSWORD ===================== */}
                        <FormField
                          field={{
                            type: "password",
                            name: "password",
                            label: t("form.new_password"),
                            placeholder: t("placeholder.new_password"),
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
                              validate: (v) => v === getValues("password") || t("validation.password_mismatch"),
                            },
                          }}
                          {...{ control, register, errors, touchedFields }}
                        />
                      </>
                    )}

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


                    {/* ACTIONS */}
                    <div className="text-end py-2">
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
                        {t("button.save_changes")}
                      </Button>

                      <Button
                        as={Link}
                        to={`/user?page=${page}`}
                        variant="secondary"
                      >
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

export default Edit;
