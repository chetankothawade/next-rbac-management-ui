import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
    Row, Col, Card, Form, Button, Table,
    OverlayTrigger, Tooltip
} from "react-bootstrap";

import LayoutWrapper from "../components/LayoutWrapper";
import Pagination from "../../../components/Pagination";
import { SkeletonLayout, SkeletonTable } from "../../../components/Skeleton";

// Services
import moduleService from "../../../services/moduleService";

// Hooks
import UsePagination from "../../../hooks/UsePagination";
import UseSearchTable from "../../../hooks/UseSearchTable";
import UseSortableTable from "../../../hooks/UseSortableTable";
import UseAccess from "../../../hooks/UseAccess";

const ModuleList = () => {

    const { uuid: parentId } = useParams(); // parent module id for sub-modules
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    /* ----------------- Local State ----------------- */
    const [loading, setLoading] = useState(false);
    const [modules, setModules] = useState([]);
    const [pagination, setPagination] = useState({
        perPage: 10,
        currentPage: 1,
        totalPages: 0,
    });

    /* ----------------- URL Defaults ----------------- */
    const initialPage = Number(searchParams.get("page")) || 1;
    const initialSearch = searchParams.get("search") || "";
    const initialSortedField = searchParams.get("sortedField") || "id";
    const initialSortedBy = searchParams.get("sortedBy") || "desc";

    /* ----------------- Hooks ----------------- */
    const { page, setPage, handlePageClick } = UsePagination(initialPage);
    const { search, setSearch, debouncedSearch } = UseSearchTable(800, initialSearch);
    const { sortedField, sortedBy, handleSortByColumn, renderSortingIcon } =
        UseSortableTable(initialSortedField, initialSortedBy, setPage);

    /* ----------------- Permissions ----------------- */
    const canCreate = UseAccess("Modules", "create");
    const canEdit = UseAccess("Modules", "edit");
    const canDelete = UseAccess("Modules", "delete");
    const canStatus = UseAccess("Modules", "status");
    const canView = UseAccess("Modules", "view");


    /* ---------------------------------------------------------
       FETCH MODULES  (SERVICE)
    --------------------------------------------------------- */
    const fetchModules = useCallback(async () => {
        setLoading(true);

        try {
            const params = {
                page,
                search: debouncedSearch,
                sortedField,
                sortedBy,
            };

            const response = await moduleService.list(parentId, params);

            if (response?.data?.status) {
                const { data = [], pagination: pag = {} } = response.data;

                setModules(data);
                setPagination({
                    perPage: pag.perPage ?? 10,
                    currentPage: pag.currentPage ?? 1,
                    totalPages: pag.lastPage ?? 1,
                });
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch modules");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, sortedField, sortedBy, parentId]);

    useEffect(() => {
        fetchModules();
    }, [fetchModules]);

    /* ----------------- Sync URL With Params ----------------- */
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
       DELETE MODULE (SERVICE)
    --------------------------------------------------------- */
    const deleteModule = useCallback(
        async (id) => {
            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: "This action cannot be undone!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete!",
            });

            if (!confirm.isConfirmed) return;

            try {
                const response = await moduleService.delete(id);

                if (response?.data?.status) {
                    toast.success("Module deleted");
                    fetchModules();
                }

            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete module");
            }
        },
        [fetchModules]
    );

    /* ---------------------------------------------------------
       TOGGLE STATUS (SERVICE)
    --------------------------------------------------------- */
    const toggleStatus = useCallback(
        async (id, status) => {
            const next = status === "active" ? "inactive" : "active";

            const confirm = await Swal.fire({
                title: "Are you sure?",
                text: `Mark module as ${next}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
            });

            if (!confirm.isConfirmed) return;

            try {
                const response = await moduleService.updateStatus(id, next);

                if (response?.data?.status) {
                    toast.success(`Module marked as ${next}`);
                    fetchModules();
                }

            } catch (error) {
                toast.error(error.message || "Failed to update status");
            }
        },
        [fetchModules]
    );

    /* =========================================================
       RENDER UI
    ========================================================= */
    return (
        <LayoutWrapper>
            {loading ? (
                <SkeletonLayout headerActions>
                    <SkeletonTable rows={10} columnCount={4} />
                </SkeletonLayout>
            ) : (
                <>
                    {/* Page Header */}
                    <Row>
                        <Col>
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0">
                                    {parentId ? "Sub Modules" : "Modules"}
                                </h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">
                                            {parentId ? "Sub Modules" : "Modules"}
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Search + Add */}
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

                                        <Col sm="auto" className="ms-auto d-flex gap-2">

                                            {canCreate && (
                                                <Link
                                                    to={
                                                        parentId
                                                            ? `/module/create?parentId=${parentId}`
                                                            : "/module/create"
                                                    }
                                                    className="btn btn-soft-success"
                                                >
                                                    <i className="ri-add-line me-1 align-bottom" />
                                                    {parentId ? "Add Sub Module" : "Add Module"}
                                                </Link>
                                            )}

                                            {parentId && (
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => navigate("/module")}
                                                >
                                                    <i className="ri-arrow-go-back-line me-1" />
                                                    Back
                                                </Button>
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
                                                        { label: "Name", field: "name", width: "20%" },
                                                        { label: "Route", field: "url", width: "20%" },
                                                        { label: "Icon", field: "icon", width: "12%" },
                                                        { label: "Sequence", field: "seq_no", width: "10%" },
                                                        { label: "Created", field: "created_at", width: "15%" },
                                                    ].map((col) => (
                                                        <th
                                                            key={col.field}
                                                            className="sort"
                                                            onClick={() => handleSortByColumn(col.field)}
                                                        >
                                                            {col.label} {renderSortingIcon(col.field)}
                                                        </th>
                                                    ))}

                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {modules.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={8} className="text-center text-muted py-5">
                                                            No modules found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    modules.map((m, i) => (
                                                        <tr key={m.uuid}>
                                                            <td>
                                                                {pagination.perPage * (pagination.currentPage - 1) +
                                                                    (i + 1)}
                                                            </td>

                                                            <td>{m.name}</td>
                                                            <td>{m.url}</td>
                                                            <td>{m.icon}</td>
                                                            <td>{m.seq_no}</td>
                                                            <td>{m.created_at}</td>

                                                            <td>
                                                                <span
                                                                    className={`text-uppercase badge ${m.status === "active"
                                                                        ? "badge-soft-primary"
                                                                        : "badge-soft-secondary"
                                                                        }`}
                                                                >
                                                                    {m.status}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <div className="d-flex gap-2">

                                                                    {/* STATUS */}
                                                                    {canStatus && (
                                                                        <OverlayTrigger
                                                                            placement="top"
                                                                            overlay={
                                                                                <Tooltip>
                                                                                    {m.status === "active" ? "Deactivate Module" : "Activate Module"}
                                                                                </Tooltip>
                                                                            }
                                                                        >
                                                                            <Button
                                                                                size="sm"
                                                                                variant={m.status === "active" ? "soft-success" : "soft-secondary"}
                                                                                onClick={() => toggleStatus(m.uuid, m.status)}
                                                                            >
                                                                                <i
                                                                                    className={
                                                                                        m.status === "active"
                                                                                            ? "ri-checkbox-circle-line"
                                                                                            : "ri-close-circle-line"
                                                                                    }
                                                                                />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    )}

                                                                    {/* VIEW */}
                                                                    {canView && (
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>View Module</Tooltip>}>
                                                                            <Button
                                                                                size="sm"
                                                                                className="btn-soft-info"
                                                                                onClick={() => navigate(`/module/view/${m.uuid}?page=${page}`)}
                                                                            >
                                                                                <i className="ri-eye-fill" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    )}

                                                                    {/* EDIT */}
                                                                    {canEdit && (
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Edit Module</Tooltip>}>
                                                                            <Button
                                                                                size="sm"
                                                                                className="btn-soft-warning"
                                                                                onClick={() =>
                                                                                    navigate(
                                                                                        parentId
                                                                                            ? `/module/edit/${m.uuid}?page=${page}&parentId=${parentId}`
                                                                                            : `/module/edit/${m.uuid}?page=${page}`
                                                                                    )
                                                                                }
                                                                            >
                                                                                <i className="ri-pencil-fill" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    )}

                                                                    {/* DELETE */}
                                                                    {canDelete && (
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete Module</Tooltip>}>
                                                                            <Button
                                                                                size="sm"
                                                                                className="btn-soft-danger"
                                                                                onClick={() => deleteModule(m.uuid)}
                                                                            >
                                                                                <i className="ri-delete-bin-fill" />
                                                                            </Button>
                                                                        </OverlayTrigger>
                                                                    )}

                                                                    {/* SUB-MODULE LIST */}
                                                                    {!parentId && m.is_sub_module === "N" && (
                                                                        <OverlayTrigger placement="top" overlay={<Tooltip>View Sub-Modules</Tooltip>}>
                                                                            <Button
                                                                                size="sm"
                                                                                className="btn-soft-primary"
                                                                                onClick={() => navigate(`/module/${m.id}`)}
                                                                            >
                                                                                <i className="ri-file-list-2-line" />
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

export default ModuleList;
