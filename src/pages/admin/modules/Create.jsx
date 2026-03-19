// src/pages/module/Create.js

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import * as FeatherIcons from "react-feather";

import LayoutWrapper from "../components/LayoutWrapper";
import moduleService from "../../../services/moduleService";

import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Collapse,
} from "react-bootstrap";

import { SkeletonLayout, SkeletonForm } from "../../../components/Skeleton";
import iconNames from "../../../utils/reactFeatherIcons.json";

const ModuleCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);

  const parentIdFromUrl = Number(searchParams.get("parentId") || 0);

  // form setup
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, touchedFields, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      is_sub_module: parentIdFromUrl !== 0 ? "Y" : "N",
      parent_id: parentIdFromUrl,
      status: "active",
      is_permission: "N",
    },
  });

  const isSubModule = watch("is_sub_module");
  const selectedIcon = watch("icon");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const renderIcon = (name) => {
    const IconComponent = FeatherIcons[name] || FeatherIcons.Grid;
    return <IconComponent size={16} />;
  };

  // Skeleton loading behavior
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, []);

  // Fetch modules for parent dropdown
  useEffect(() => {
    const loadModules = async () => {
      try {
        const res = await moduleService.getList();
        if (res?.data?.status) {
          setModules(res?.data?.data || []);
        }
      } catch {
        toast.error("Failed to load modules");
      }
    };
    loadModules();
  }, []);

  useEffect(() => {
    if (parentIdFromUrl !== 0) {
      setValue("is_sub_module", "Y");
      setValue("parent_id", String(parentIdFromUrl), { shouldValidate: true });
    }
  }, [parentIdFromUrl, setValue, modules]);

  // Submit Handler
  const saveModule = async (formData) => {
    try {
      const payload = {
        ...formData,
        parent_id:
          formData.is_sub_module === "Y" && formData.parent_id
            ? Number(formData.parent_id)
            : null,
        icon: formData.is_sub_module === "Y" ? null : formData.icon,
      };

      const response = await moduleService.create(payload);

      if (response?.data?.status) {
        toast.success(response?.data?.message || "Module created successfully");

        if (payload.is_sub_module === "Y" && payload.parent_id) {
          navigate(`/module/${payload.parent_id}`, { replace: true });
        } else {
          navigate("/module", { replace: true });
        }
      }
    } catch (error) {
      if (error.response?.status === 422) {
        const errs = error.response.data.errors;
        Object.entries(errs).forEach(([key, message]) => {
          setError(key, { type: "server", message: message[0] });
        });
      }
    }
  };

  return (
    <LayoutWrapper title="Create Module">
      {loading ? (
        <SkeletonLayout>
          <SkeletonForm fields={7} />
        </SkeletonLayout>
      ) : (
        <>
          {/* Header */}
          <Row>
            <Col>
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">
                  {isSubModule === "Y" ? "Create Sub Module" : "Create Module"}
                </h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/module">Modules</Link>
                    </li>
                    <li className="breadcrumb-item active">Create</li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>

          {/* FORM */}
          <Form onSubmit={handleSubmit(saveModule)} noValidate>
            <Row>
              <Col lg={12}>
                <Card className="shadow-sm">
                  <Card.Body>
                    {/* NAME */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Name<span className="text-danger ms-1">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter module name"
                        isInvalid={!!errors.name}
                        isValid={touchedFields.name && !errors.name}
                        {...register("name", { required: "Module name is required" })}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* IS SUB MODULE (hide if forced via URL) */}
                    {parentIdFromUrl === 0 && (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Is Sub Module<span className="text-danger ms-1">*</span>
                        </Form.Label>

                        <Form.Select
                          isInvalid={!!errors.is_sub_module}
                          isValid={touchedFields.is_sub_module && !errors.is_sub_module}
                          {...register("is_sub_module", { required: "Please select" })}
                        >
                          <option value="N">No</option>
                          <option value="Y">Yes</option>
                        </Form.Select>

                        <Form.Control.Feedback type="invalid">
                          {errors.is_sub_module?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    {/* PARENT MODULE */}
                    {isSubModule === "Y" && (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Parent Module<span className="text-danger ms-1">*</span>
                        </Form.Label>

                        <Form.Select
                          disabled={parentIdFromUrl !== 0}
                          isInvalid={!!errors.parent_id}
                          isValid={touchedFields.parent_id && !errors.parent_id}
                          {...register("parent_id", {
                            validate: (value) => {
                              if (isSubModule === "Y" && !value) {
                                return "Parent module required";
                              }
                              return true;
                            }
                          })}
                        >
                          <option value="">Select parent module</option>
                          {modules.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </Form.Select>

                        <Form.Control.Feedback type="invalid">
                          {errors.parent_id?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    )}

                    {/* ROUTE */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Route<span className="text-danger ms-1">*</span>
                      </Form.Label>

                      <Form.Control
                        type="text"
                        placeholder="Enter route (e.g. /module)"
                        isInvalid={!!errors.url}
                        isValid={touchedFields.url && !errors.url}
                        {...register("url", { required: "Route is required" })}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.url?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* ICON (only for main modules) */}
                    {isSubModule === "N" && (
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Icon<span className="text-danger ms-1">*</span>
                        </Form.Label>

                        <Form.Control
                          type="text"
                          placeholder="Enter icon name"
                          list="module-icon-list"
                          isInvalid={!!errors.icon}
                          isValid={touchedFields.icon && !errors.icon}
                          {...register("icon", { required: "Icon is required" })}
                        />
                        <datalist id="module-icon-list">
                          {iconNames.map((name) => (
                            <option key={name} value={name} />
                          ))}
                        </datalist>

                        <Form.Control.Feedback type="invalid">
                          {errors.icon?.message}
                        </Form.Control.Feedback>

                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => setShowIconPicker((v) => !v)}
                          >
                            {showIconPicker ? "Hide icon picker" : "Show icon picker"}
                          </Button>

                          <Collapse in={showIconPicker} mountOnEnter unmountOnExit>
                            <div className="mt-2 d-flex flex-wrap gap-2" style={{ maxHeight: 220, overflow: "auto" }}>
                              {iconNames.map((name) => (
                                <Button
                                  key={name}
                                  type="button"
                                  size="sm"
                                  variant={selectedIcon === name ? "primary" : "light"}
                                  className="d-flex align-items-center gap-2"
                                  onClick={() => setValue("icon", name, { shouldValidate: true, shouldTouch: true })}
                                >
                                  {renderIcon(name)}
                                  <span>{name}</span>
                                </Button>
                              ))}
                            </div>
                          </Collapse>
                        </div>
                      </Form.Group>
                    )}

                    {/* SEQUENCE NO */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Sequence No<span className="text-danger ms-1">*</span>
                      </Form.Label>

                      <Form.Control
                        type="number"
                        placeholder="Enter sequence number"
                        isInvalid={!!errors.seq_no}
                        isValid={touchedFields.seq_no && !errors.seq_no}
                        {...register("seq_no", { required: "Sequence number is required" })}
                      />

                      <Form.Control.Feedback type="invalid">
                        {errors.seq_no?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* PERMISSION */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Permission Required?<span className="text-danger ms-1">*</span>
                      </Form.Label>

                      <Form.Select
                        isInvalid={!!errors.is_permission}
                        isValid={touchedFields.is_permission && !errors.is_permission}
                        {...register("is_permission", { required: "Please select" })}
                      >
                        <option value="N">No</option>
                        <option value="Y">Yes</option>
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {errors.is_permission?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* STATUS */}
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Status<span className="text-danger ms-1">*</span>
                      </Form.Label>

                      <Form.Select
                        isInvalid={!!errors.status}
                        isValid={touchedFields.status && !errors.status}
                        {...register("status", { required: "Status is required" })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Select>

                      <Form.Control.Feedback type="invalid">
                        {errors.status?.message}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* ACTION BUTTONS */}
                    <div className="text-end py-2">
                      <Button type="submit" variant="success" disabled={isSubmitting}>
                        {isSubmitting && <Spinner size="sm" className="me-1" />}
                        Submit
                      </Button>

                      <Button
                        as={Link}
                        to={
                          parentIdFromUrl !== 0
                            ? `/module/${parentIdFromUrl}`
                            : "/module"
                        }
                        variant="secondary"
                        className="ms-2"
                      >
                        Cancel
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

export default ModuleCreate;
