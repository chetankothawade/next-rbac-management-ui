import React, { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    Row,
    Col,
    Card,
    Form,
    Table
} from "react-bootstrap";

import LayoutWrapper from "../components/LayoutWrapper";
import Pagination from "../../../components/Pagination";
import { SkeletonLayout, SkeletonTableList } from "../../../components/Skeleton";

// Hooks
import UsePagination from "../../../hooks/UsePagination";
import UseSearchTable from "../../../hooks/UseSearchTable";
import UseSortableTable from "../../../hooks/UseSortableTable";
import UseAccess from "../../../hooks/UseAccess";

import { formatDateTimeDDMMYYYY_12H, formatString } from "../../../utils/helpers";

// Service
import activityLogService from "../../../services/activityLogService";

const ActivityLogList = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [loading, setLoading] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);

    const [pagination, setPagination] = useState({
        perPage: 10,
        currentPage: 1,
        totalPages: 0,
    });

    /** URL defaults **/
    const initialPage = Number(searchParams.get("page")) || 1;
    const initialSearch = searchParams.get("search") || "";
    const initialSortedField = searchParams.get("sortedField") || "id";
    const initialSortedBy = searchParams.get("sortedBy") || "desc";

    /** Hooks **/
    const { page, setPage, handlePageClick } = UsePagination(initialPage);
    const { search, setSearch, debouncedSearch } = UseSearchTable(1000, initialSearch);
    const { sortedField, sortedBy, handleSortByColumn, renderSortingIcon } =
        UseSortableTable(initialSortedField, initialSortedBy, setPage);

    /** Permissions **/
    const canView = UseAccess("Activity Logs", "view");

    /* ---------------------------------------------------------
       FETCH ACTIVITY LOGS (via service)
    --------------------------------------------------------- */
    const fetchActivityLogs = useCallback(async () => {
        setLoading(true);

        try {
            const params = {
                page,
                perPage: pagination.perPage,
                search: debouncedSearch,
                sortedField,
                sortedBy,
            };

            const response = await activityLogService.list(params);

            if (response?.data?.status) {
                const { data = [], pagination: pag = {} } = response.data;

                setActivityLogs(data);

                setPagination({
                    perPage: pag.perPage ?? 10,
                    currentPage: pag.currentPage ?? 1,
                    totalPages: pag.lastPage ?? 1,
                });
            } else {
                toast.error("Failed to load activity logs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch activity logs");
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, sortedField, sortedBy, pagination.perPage]);

    useEffect(() => {
        fetchActivityLogs();
    }, [fetchActivityLogs]);

    /** Sync URL parameters **/
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

    /* =========================================================
       RENDER UI
    ========================================================= */
    return (
        <LayoutWrapper>
            {loading ? (
                <SkeletonLayout headerActions>
                    <SkeletonTableList rows={10} columns={7} />
                </SkeletonLayout>
            ) : (
                <>
                    {/* Header */}
                    <Row>
                        <Col>
                            <div className="page-title-box d-flex align-items-center justify-content-between">
                                <h4 className="mb-0">Activity Logs</h4>

                                <div className="page-title-right">
                                    <ol className="breadcrumb m-0">
                                        <li className="breadcrumb-item">
                                            <Link to="/dashboard">Dashboard</Link>
                                        </li>
                                        <li className="breadcrumb-item active">Activity Logs</li>
                                    </ol>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Search */}
                    <Row>
                        <Col>
                            <Card className="shadow-sm">
                                <Card.Header className="border-0">
                                    <Row className="g-4 align-items-center">
                                        <Col sm={3}>
                                            <div className="search-box">
                                                <Form.Control
                                                    value={search}
                                                    onChange={(e) => {
                                                        setSearch(e.target.value);
                                                        setPage(1);
                                                    }}
                                                    placeholder="Search by log name..."
                                                    disabled={!canView}
                                                />
                                                <i className="ri-search-line  search-icon" />
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Header>

                                {/* Table */}
                                <Card.Body>
                                    <div className="table-responsive table-card">
                                        <Table hover className="align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ width: "4%" }}>#</th>
                                                    {[
                                                        { label: "Log Name", field: "log_name", width: "10%" },
                                                        { label: "Event", field: "event", width: "8%" },
                                                        { label: "Description", field: "description", width: "15%" },
                                                        { label: "Subject Type", field: "subject_type", width: "15%" },
                                                        { label: "Causer", field: "causer_id", width: "15%" },
                                                        { label: "Created At", field: "created_at", width: "13%" },
                                                    ].map((col) => (
                                                        <th
                                                            key={col.field}
                                                            className="sort"
                                                            style={{ width: col.width }}
                                                            onClick={() => handleSortByColumn(col.field)}
                                                        >
                                                            {col.label} {renderSortingIcon(col.field)}
                                                        </th>
                                                    ))}
                                                    <th style={{ width: "20%" }}>Properties</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {activityLogs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={'100%'} className="text-center py-5">
                                                            No activity logs found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    activityLogs.map((log, i) => {
                                                        const causerName = log?.causer?.name || log?.causer?.email || "-";
                                                        const causerLabel = log?.causer_id
                                                            ? `${causerName} (${log.causer_id})`
                                                            : causerName;
                                                        const properties = log?.properties || null;
                                                        const renderObjectList = (obj) => {
                                                            if (!obj || typeof obj !== "object") return "-";
                                                            const entries = Object.entries(obj);
                                                            if (!entries.length) return "-";
                                                            return (
                                                                <ul className="mb-0 ps-3">
                                                                    {entries.map(([key, value]) => (
                                                                        <li key={key}>
                                                                            <span className="fw-medium">{formatString(key)}:</span>{" "}
                                                                            {typeof value === "object" && value !== null
                                                                                ? JSON.stringify(value)
                                                                                : String(value)}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            );
                                                        };

                                                        return (
                                                            <tr key={log.id}>
                                                                <td>
                                                                    {pagination.perPage * (pagination.currentPage - 1) + (i + 1)}
                                                                </td>
                                                                <td className="fw-medium text-uppercase">
                                                                    {log.log_name || "-"}
                                                                </td>
                                                                <td className="text-capitalize">{log.event || "-"}</td>
                                                                <td>{log.description || "-"}</td>
                                                                <td className="text-muted">{log.subject_display || "-"}</td>
                                                                <td>{causerLabel}</td>
                                                                <td className="text-muted">{formatDateTimeDDMMYYYY_12H(log.created_at) || "-"}</td>
                                                                <td className="text-muted" style={{ maxWidth: 320 }}>
                                                                    {properties ? (
                                                                        <details>
                                                                            <summary className="text-decoration-none cursor-pointer">
                                                                                <i className="ri-arrow-right-s-line me-1" />
                                                                                View Properties
                                                                            </summary>
                                                                            {properties?.attributes || properties?.old ? (
                                                                                <div className="mt-2">
                                                                                    <div className="fw-medium">Attributes</div>
                                                                                    {renderObjectList(properties?.attributes)}
                                                                                    <div className="fw-medium mt-2">Old</div>
                                                                                    {renderObjectList(properties?.old)}
                                                                                </div>
                                                                            ) : (
                                                                                <div className="mt-2">
                                                                                    {renderObjectList(properties)}
                                                                                </div>
                                                                            )}
                                                                        </details>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
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

export default ActivityLogList;
