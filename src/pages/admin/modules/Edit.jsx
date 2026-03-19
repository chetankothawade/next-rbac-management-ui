// src/pages/module/Edit.js
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
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
  Collapse
} from "react-bootstrap";

import { SkeletonLayout, SkeletonForm } from "../../../components/Skeleton";
import iconNames from "../../../utils/reactFeatherIcons.json";

const EditModule = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const parentIdFromUrl = Number(searchParams.get("parentId") || 0);

  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors, touchedFields, isSubmitting }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      is_sub_module: "N",
      parent_id: 0,
      status: "active",
      is_permission: "N",
    },
  });

  const isSubModule = watch("is_sub_module");
  const parentId = watch("parent_id");
  const selectedIcon = watch("icon");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const renderIcon = (name) => {
    const IconComponent = FeatherIcons[name] || FeatherIcons.Grid;
    return <IconComponent size={16} />;
  };

  /** Fetch modules for parent dropdown */
  const fetchModules = useCallback(async () => {
    try {
      const response = await moduleService.getList();
      if (response?.data?.status) {
        setModules(response?.data?.data || []);
      }
    } catch {
      toast.error("Failed to load modules");
    }
  }, []);

  /** Fetch module details */
  const fetchModule = useCallback(async () => {
    try {
      const response = await moduleService.get(uuid);

      if (!response?.data?.status) {
        toast.error("Module not found");
        return navigate("/module");
      }

      const m = response.data.data;
      ["name", "url", "icon", "seq_no", "is_permission", "is_sub_module"].forEach((field) =>
        setValue(field, m[field])
      );
      setValue("parent_id", m.parent_id ?? 0);
      setValue("status", m.status || "active");

    } catch (err) {
      toast.error("Failed to fetch module data");
    } finally {
      setLoading(false);
    }
  }, [uuid, navigate, setValue]);

  useEffect(() => {
    fetchModules();
    fetchModule();
  }, [fetchModules, fetchModule]);

  /** Update Module */
  const updateModule = async (formData) => {
    try {
      const payload = {
        ...formData,
        parent_id:
          formData.is_sub_module === "Y" && formData.parent_id
            ? Number(formData.parent_id)
            : null,
        icon: formData.is_sub_module === "Y" ? null : formData.icon,
      };

      const response = await moduleService.update(uuid, payload);

      if (response?.data?.status) {
        toast.success(response?.data?.message || "Module updated successfully");

        // Redirect after update
        const redirectUrl =
          payload.is_sub_module === "Y" && payload.parent_id
            ? `/module/${payload.parent_id}`
            : `/module?page=${page}`;

        navigate(redirectUrl, { replace: true });
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

  if (loading) {
    return (
      <LayoutWrapper>
        <SkeletonLayout>
          <SkeletonForm fields={6} />
        </SkeletonLayout>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper title="Edit Module">
      <Row>
        <Col>
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">
              {isSubModule === "Y" ? "Edit Sub Module" : "Edit Module"}
            </h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={`/module?page=${page}`}>Module</Link>
                </li>
                <li className="breadcrumb-item active">Edit</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit(updateModule)} noValidate>
        <Row>
          <Col lg={12}>
            <Card className="shadow-sm">
              <Card.Body>

                {/* NAME */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Name <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    isInvalid={!!errors.name}
                    isValid={touchedFields.name && !errors.name}
                    {...register("name", { required: "Name is required" })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* IS SUB MODULE */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Is Sub Module <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Select
                    isInvalid={!!errors.is_sub_module}
                    isValid={touchedFields.is_sub_module && !errors.is_sub_module}
                    disabled={!!parentIdFromUrl}
                    {...register("is_sub_module", {
                      required: "Please select",
                    })}
                  >
                    <option value="N">No</option>
                    <option value="Y">Yes</option>
                  </Form.Select>

                  <Form.Control.Feedback type="invalid">
                    {errors.is_sub_module?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* PARENT MODULE */}
                {isSubModule === "Y" && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Parent Module <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Select
                      isInvalid={!!errors.parent_id}
                      isValid={touchedFields.parent_id && !errors.parent_id}
                      disabled={!!parentIdFromUrl}
                      {...register("parent_id", { required: "Parent module is required" })}
                    >
                      <option value="">Select parent</option>
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
                    Route <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter route"
                    isInvalid={!!errors.url}
                    isValid={touchedFields.url && !errors.url}
                    {...register("url", { required: "Route is required" })}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.url?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* ICON (only for main modules) */}
                {isSubModule === "N" && (parentId === 0 || parentId === null) && (
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Icon <span className="text-danger">*</span>
                    </Form.Label>

                    <Form.Control
                      type="text"
                      placeholder="Enter icon"
                      list="module-icon-list"
                      isInvalid={!!errors.icon}
                      isValid={touchedFields.icon && !errors.icon}
                      {...register("icon", {
                        required: "Icon is required",
                      })}
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

                {/* SEQ NO */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Sequence No <span className="text-danger">*</span>
                  </Form.Label>

                  <Form.Control
                    type="number"
                    placeholder="Enter sequence"
                    isInvalid={!!errors.seq_no}
                    isValid={touchedFields.seq_no && !errors.seq_no}
                    {...register("seq_no", { required: "Sequence no is required" })}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.seq_no?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* PERMISSION */}
                <Form.Group className="mb-3">
                  <Form.Label>
                    Permission Required?<span className="text-danger">*</span>
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
                    Status <span className="text-danger">*</span>
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
                    Save Changes
                  </Button>
                  <Button
                    as={Link}
                    to={
                      isSubModule === "Y"
                        ? `/module/${parentId}`
                        : `/module?page=${page}`
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
    </LayoutWrapper>
  );
};

export default EditModule;
