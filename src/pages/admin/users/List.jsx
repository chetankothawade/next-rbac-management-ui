import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import LayoutWrapper from "../components/LayoutWrapper";
import Pagination from "../../../components/Pagination";
import { SkeletonLayout, SkeletonTable } from "../../../components/Skeleton";

// Services
import userService from "../../../services/userService";

// Hooks
import UsePagination from "../../../hooks/UsePagination";
import UseSearchTable from "../../../hooks/UseSearchTable";
import UseSortableTable from "../../../hooks/UseSortableTable";
import UseAccess from "../../../hooks/UseAccess";

const List = () => {
  const { t } = useTranslation();

  const adminAuth = useSelector((state) => state.auth.admin);
  const userRole = adminAuth?.user?.role || "admin";

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ----------------- Local State ----------------- */
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    totalPages: 0,
  });

  /* ----------------- URL Default Params ----------------- */
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";
  const initialSortedField = searchParams.get("sortedField") || "id";
  const initialSortedBy = searchParams.get("sortedBy") || "desc";

  /* ----------------- Custom Hooks ----------------- */
  const { page, setPage, handlePageClick } = UsePagination(initialPage);
  const { search, setSearch, debouncedSearch } = UseSearchTable(1000, initialSearch);
  const { sortedField, sortedBy, handleSortByColumn, renderSortingIcon } =
    UseSortableTable(initialSortedField, initialSortedBy, setPage);

  /* ----------------- Permissions ----------------- */
  const canCreate = UseAccess("users", "create");
  const canEdit = UseAccess("users", "edit");
  const canDelete = UseAccess("users", "delete");
  const canApprove = UseAccess("users", "status");
  const canView = UseAccess("users", "view");

  /* ---------------------------------------------------------
     FETCH USERS
     --------------------------------------------------------- */
  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page,
        search: debouncedSearch,
        sortedField,
        sortedBy,
      };

      const response = await userService.list(params);

      if (response?.data?.status) {
        const { data = [], pagination: pag = {} } = response.data;

        setUsers(data);
        setPagination({
          perPage: pag.perPage ?? 10,
          currentPage: pag.currentPage ?? 1,
          totalPages: pag.lastPage ?? 1,
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("toast.fetch_failed")
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortedField, sortedBy, t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ----------------- Sync URL with parameters ----------------- */
  useEffect(() => {
    setSearchParams(
      {
        page,
        search: debouncedSearch,
        sortedField,
        sortedBy,
      },
      { replace: true }
    );
  }, [page, debouncedSearch, sortedField, sortedBy, setSearchParams]);

  /* ---------------------------------------------------------
     DELETE USER
     --------------------------------------------------------- */
  const deleteUser = useCallback(
    async (uuid) => {
      const confirm = await Swal.fire({
        title: t("swal.confirm_title"),
        text: t("swal.delete_text"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("swal.confirm_delete"),
      });

      if (!confirm.isConfirmed) return;

      try {
        const response = await userService.delete(uuid);

        if (response?.data?.status) {
          toast.success(
            response?.data?.message || t("toast.user_deleted")
          );
          fetchUsers();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || t("toast.delete_failed")
        );
      }
    },
    [fetchUsers, t]
  );

  /* ---------------------------------------------------------
     TOGGLE USER STATUS
     --------------------------------------------------------- */
  const toggleUserStatus = useCallback(
    async (uuid, status) => {
      const next = status === "active" ? "inactive" : "active";

      const confirm = await Swal.fire({
        title: t("swal.confirm_title"),
        text: t("swal.status_text", { status: t(`status.${next}`) }),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("swal.confirm"),
      });

      if (!confirm.isConfirmed) return;

      try {
        const response = await userService.updateStatus(uuid, next);

        if (response?.data?.status) {
          toast.success(
            t("toast.status_updated", { status: t(`status.${next}`) })
          );
          fetchUsers();
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || t("toast.status_failed")
        );
      }
    },
    [fetchUsers, t]
  );

  /* =========================================================
     RENDER UI
     ========================================================= */
  return (
    <LayoutWrapper>
      {loading ? (
        <SkeletonLayout headerActions>
          <SkeletonTable rows={10} columnCount={3} />
        </SkeletonLayout>
      ) : (
        <>
          {/* Page Header */}
          <Row>
            <Col>
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">{t("user.list_title")}</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">
                        {t("breadcrumb.dashboard")}
                      </Link>
                    </li>
                    <li className="breadcrumb-item active">
                      {t("breadcrumb.users")}
                    </li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>

          {/* Search + Buttons */}
          <Row>
            <Col>
              <Card className="shadow-sm">
                <Card.Header className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={4} md={3}>
                      <div className="search-box">
                        <Form.Control
                          value={search}
                          onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                          }}
                          placeholder="Search..."
                        />
                        <i className="ri-search-line  search-icon" />
                      </div>
                    </Col>

                    <Col sm="auto" className="ms-auto d-flex justify-content-end gap-2">
                      {canCreate && (
                        <Link
                          to="/user/create"
                          className="btn btn-soft-success"
                        >
                          <i className="ri-add-line me-1 align-bottom" />
                          {t("button.add_user")}
                        </Link>
                      )}
                    </Col>
                  </Row>
                </Card.Header>

                {/* Table */}
                <Card.Body>
                  <div className="table-responsive table-card">
                    <Table hover className="align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{ width: "3%" }}>#</th>

                          {[
                            { label: t("table.name"), field: "name", width: "15%" },
                            { label: t("table.email"), field: "email", width: "20%" },
                            { label: t("table.phone"), field: "phone", width: "12%" },
                            { label: t("table.role"), field: "role", width: "10%" },
                            { label: t("table.created_at"), field: "created_at", width: "15%" },
                          ].map((col) => (
                            <th
                              key={col.field}
                              className="sort"
                              style={{ cursor: "pointer", width: col.width }}
                              onClick={() => handleSortByColumn(col.field)}
                            >
                              {col.label} {renderSortingIcon(col.field)}
                            </th>
                          ))}

                          <th style={{ width: "10%" }}>
                            {t("table.status")}
                          </th>
                          <th style={{ width: "15%" }}>
                            {t("table.action")}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="text-center text-muted py-5">
                              <i className="ri-user-line fs-2 mb-2" />
                              <h5>{t("common.no_data")}</h5>
                            </td>
                          </tr>
                        ) : (
                          users.map((u, index) => (
                            <tr key={u.uuid}>
                              <td>
                                {pagination.perPage *
                                  (pagination.currentPage - 1) +
                                  (index + 1)}
                              </td>

                              <td className="fw-medium">{u.name}</td>
                              <td className="text-muted">{u.email}</td>
                              <td className="text-muted">{u.phone}</td>
                              <td className="text-muted text-uppercase">{u.role}</td>
                              <td className="text-muted">{u.created_at}</td>

                              <td>
                                <span
                                  className={`text-uppercase badge ${u.status === "active"
                                    ? "badge-soft-primary"
                                    : "badge-soft-secondary"
                                    }`}
                                >
                                  {t(`status.${u.status}`)}
                                </span>
                              </td>

                              <td>
                                <div className="d-flex gap-2">
                                  {/* STATUS TOGGLE */}
                                  {canApprove && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>
                                          {u.status === "active"
                                            ? t("tooltip.deactivate")
                                            : t("tooltip.activate")}
                                        </Tooltip>
                                      }
                                    >
                                      <Button
                                        size="sm"
                                        variant={
                                          u.status === "active"
                                            ? "soft-success"
                                            : "soft-secondary"
                                        }
                                        onClick={() =>
                                          toggleUserStatus(u.uuid, u.status)
                                        }
                                      >
                                        <i
                                          className={
                                            u.status === "active"
                                              ? "ri-checkbox-circle-line"
                                              : "ri-close-circle-line"
                                          }
                                        />
                                      </Button>
                                    </OverlayTrigger>
                                  )}

                                  {/* VIEW */}
                                  {canView && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>{t("tooltip.view")}</Tooltip>
                                      }
                                    >
                                      <Button
                                        size="sm"
                                        variant="info"
                                        className="btn-soft-info"
                                        onClick={() =>
                                          navigate(
                                            `/user/view/${u.uuid}?page=${page}`
                                          )
                                        }
                                      >
                                        <i className="ri-eye-fill" />
                                      </Button>
                                    </OverlayTrigger>
                                  )}

                                  {/* EDIT */}
                                  {canEdit && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>{t("tooltip.edit")}</Tooltip>
                                      }
                                    >
                                      <Button
                                        size="sm"
                                        variant="warning"
                                        className="btn-soft-warning"
                                        onClick={() =>
                                          navigate(
                                            `/user/edit/${u.uuid}?page=${page}`
                                          )
                                        }
                                      >
                                        <i className="ri-pencil-fill" />
                                      </Button>
                                    </OverlayTrigger>
                                  )}

                                  {/* DELETE */}
                                  {canDelete && (
                                    <OverlayTrigger
                                      placement="top"
                                      overlay={
                                        <Tooltip>{t("tooltip.delete")}</Tooltip>
                                      }
                                    >
                                      <Button
                                        size="sm"
                                        variant="danger"
                                        className="btn-soft-danger"
                                        onClick={() => deleteUser(u.uuid)}
                                      >
                                        <i className="ri-delete-bin-fill" />
                                      </Button>
                                    </OverlayTrigger>
                                  )}

                                  {/* MODULE PERMISSIONS */}
                                  {
                                    userRole === "super_admin" && (
                                      <OverlayTrigger
                                        placement="top"
                                        overlay={
                                          <Tooltip>
                                            {t("tooltip.module_permission")}
                                          </Tooltip>
                                        }
                                      >
                                        <Button
                                          size="sm"
                                          variant="primary"
                                          className="btn-soft-primary"
                                          onClick={() =>
                                            navigate(
                                              `/module/permission/${u.uuid}?page=${page}`
                                            )
                                          }
                                        >
                                          <i className="ri-settings-2-line" />
                                        </Button>
                                      </OverlayTrigger>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>

                    {/* Pagination */}
                    <Pagination
                      totalPages={pagination.totalPages}
                      page={page}
                      handlePageClick={handlePageClick}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </LayoutWrapper>
  );
};

export default List;
