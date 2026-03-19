/**
 * Dashboard Page
 * -------------------------------------------------
 * Displays invoice KPIs, revenue chart, invoices,
 * top clients, and currency-based summaries.
 */

import React, { useEffect, useState, useCallback } from "react";
import { Card, Row, Col, Button, Table, Form, Spinner, InputGroup, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import CountUp from "react-countup";
import toast from "react-hot-toast";

import LayoutWrapper from "../components/LayoutWrapper";

import { DashboardSkeleton } from "../../../components/Skeleton";
import dashboardService from "../../../services/dashboardService";
import { formatDateDDMMYYYY } from "../../../utils/helpers";

import { useAuthContext } from "../../../redux/hooks/useAuthContext";

const STORAGE_KEY = "dashboard_currency";
const DEFAULT_CURRENCY = "INR";


const Currency = React.memo(({ value, symbol, duration = 1.2 }) => (
  <CountUp
    start={0}
    end={Number(value)}
    duration={duration}
    decimals={2}
    separator=","
    prefix={`${symbol} `}
  />
));


const StatCount = React.memo(({ value }) => (
  <CountUp start={0} end={Number(value)} duration={1.2} separator="," />
));


const Dashboard = () => {
  /* -----------------------------------------------------------
   * Loading States
   * --------------------------------------------------------- */
  const [loading, setLoading] = useState(true);
  const [currencyLoading, setCurrencyLoading] = useState(false);

  /* -----------------------------------------------------------
   * Currency State
   * --------------------------------------------------------- */
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  /* -----------------------------------------------------------
   * Dashboard State
   * --------------------------------------------------------- */
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    overdueInvoices: 0,
    cancelledInvoices: 0,
    revenueThisMonth: 0,
    outstandingAmount: 0,
  });

  const [recentInvoices, setRecentInvoices] = useState([]);
  const [upcomingInvoices, setUpcomingInvoices] = useState([]);

  /** 🔐 Auth Context */
  const { authUuid } = useAuthContext();


  /* -----------------------------------------------------------
   * Fetch Currency List
   * --------------------------------------------------------- */
  const fetchCurrencies = useCallback(async () => {
    try {
      setCurrencyLoading(true);

      const res = await dashboardService.currencyList();
      const list = res?.data?.data ?? [];

      if (!list.length) return;

      setCurrencies(list);

      const savedCode = localStorage.getItem(STORAGE_KEY) || DEFAULT_CURRENCY;
      const defaultCurrency =
        list.find(c => c.currency_code === savedCode) ||
        list.find(c => c.currency_code === DEFAULT_CURRENCY) ||
        list[0];

      setSelectedCurrency(defaultCurrency);
    } catch {
      toast.error("Failed to load currencies");
    } finally {
      setCurrencyLoading(false);
    }
  }, []);

  /* -----------------------------------------------------------
   * Fetch Dashboard Summary
   * --------------------------------------------------------- */
  const loadDashboard = useCallback(async (currencyCode) => {
    try {
      setLoading(true);

      const res = await dashboardService.getSummary({ currency: currencyCode, userUuid: authUuid });
      const d = res?.data.data ?? {};

      setStats({
        totalInvoices: d.cards?.total_invoices ?? 0,
        paidInvoices: d.cards?.paid_invoices ?? 0,
        pendingInvoices: d.cards?.pending_invoices ?? 0,
        overdueInvoices: d.cards?.overdue_invoices ?? 0,
        cancelledInvoices: d.cards?.cancelled_invoices ?? 0,
        revenueThisMonth: d.cards?.revenue_this_month ?? 0,
        outstandingAmount: d.cards?.outstanding_amount ?? 0,
        paidAmount: d.cards?.paid_amount ?? 0,
        totalAmount: d.cards?.total_amount ?? 0,
        cancelledAmount: d.cards?.cancelled_amount ?? 0,
        overdueAmount: d.cards?.overdue_amount ?? 0,
      });

      setRecentInvoices(
        (d.recent_invoices ?? []).map(inv => ({
          id: inv.uuid,
          invoice_number: inv.invoice_number,
          client: inv.client?.name ?? "Unknown",
          amount: inv.total,
          dueDate: inv.date_issued,
          status: inv.status,
        }))
      );

      setUpcomingInvoices(
        (d.upcoming_invoices ?? []).map(inv => ({
          id: inv.uuid,
          invoice_number: inv.invoice_number,
          client: inv.client ?? "Unknown",
          amount: inv.amount,
          dueDate: inv.date_issued,
          daysLeft: inv.days_left,
        }))
      );

    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [authUuid]);

  /* -----------------------------------------------------------
   * Initial Load
   * --------------------------------------------------------- */
  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    if (selectedCurrency?.currency_code) {
      loadDashboard(selectedCurrency.currency_code);
    }
  }, [selectedCurrency, loadDashboard]);



  /* -----------------------------------------------------------
 * Invoice Percentage Calculations
 * --------------------------------------------------------- */
  const totalInvoices = stats.totalInvoices || 0;

  const percent = (value) => totalInvoices ? Math.round((value / totalInvoices) * 100) : 0;

  const paidPercent = percent(stats.paidInvoices);
  const pendingPercent = percent(stats.pendingInvoices);
  const cancelledPercent = percent(stats.cancelledInvoices);


  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <span className="badge badge-soft-success">Paid</span>;
      case "cancelled":
        return <span className="badge badge-soft-danger">Cancelled</span>;
      default:
        return <span className="badge badge-soft-warning">Pending</span>;
    }
  };


  const invoiceStatusCards = [
    {
      key: "total",
      title: "Total Invoices",
      amount: stats.totalAmount,
      count: stats.totalInvoices,
      percent: 100,
      color: "info",
      icon: "ri ri-file-list-3-line",
      label: "Invoices",
    },
    {
      key: "paid",
      title: "Paid Invoices",
      amount: stats.paidAmount,
      count: stats.paidInvoices,
      percent: paidPercent,
      color: "success",
      icon: "ri-checkbox-circle-line",
      label: "Paid",
    },
    {
      key: "pending",
      title: "Pending Invoices",
      amount: stats.outstandingAmount,
      count: stats.pendingInvoices,
      percent: pendingPercent,
      color: "warning",
      icon: "ri-time-line",
      label: "Pending",
    },
    {
      key: "cancelled",
      title: "Cancelled Invoices",
      amount: stats.cancelledAmount,
      count: stats.cancelledInvoices,
      percent: cancelledPercent,
      color: "danger",
      icon: "ri-close-circle-line",
      label: "Cancelled",
    },
  ];

  /* -----------------------------------------------------------
   * Skeleton Loader
   * --------------------------------------------------------- */
  if (loading) {
    return (
      <LayoutWrapper>
        <div className="mt-3">
          <DashboardSkeleton />
        </div>
      </LayoutWrapper>
    );
  }

  /* -----------------------------------------------------------
   * Render UI (UNCHANGED)
   * --------------------------------------------------------- */
  return (
    <LayoutWrapper>
      {/* ======================================================
      PAGE HEADER
  ====================================================== */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">Dashboard</h4>
            <div className="page-title-right">
              <div className="d-flex align-items-center gap-2">
                <Form.Group>
                  <InputGroup size="sm">
                    <Form.Select
                      aria-label="Select dashboard currency"
                      value={selectedCurrency?.currency_code}
                      disabled={currencyLoading}
                      onChange={(e) => {
                        const code = e.target.value;
                        const currency = currencies.find(
                          (c) => c.currency_code === code
                        );

                        if (!currency) return;

                        setSelectedCurrency(currency);
                        localStorage.setItem(STORAGE_KEY, code);
                      }}
                    >
                      {currencies.map(c => (
                        <option key={c.currency_code} value={c.currency_code}>
                          {c.symbol} {c.currency_code} - {c.currency_name}
                        </option>
                      ))}
                    </Form.Select>
                    {currencyLoading && (
                      <InputGroup.Text>
                        <Spinner size="sm" />
                      </InputGroup.Text>
                    )}
                  </InputGroup>
                </Form.Group>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
      DASHBOARD CONTENT
  ====================================================== */}
      <div className="mt-0">
        {/* ================= KPI CARDS ================= */}
        <Row className="g-3">
          {invoiceStatusCards.map(
            ({ key, title, amount, count, percent, color, icon, label }) => (
              <Col xl={3} md={4} sm={6} key={key}>
                <Card className="shadow-sm card-height-100 card-animate">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    {/* Header */}
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1">

                        <Card.Title className="text-uppercase fw-medium text-muted mb-0">
                          {title}
                        </Card.Title>

                      </div>
                      <div className="flex-shrink-0">
                        <h5 className={`text-${color} fs-14 mb-0`}>
                          <i className="ri-arrow-right-up-line fs-13 align-middle" />{" "}
                          {percent}%
                        </h5>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="d-flex align-items-end justify-content-between mt-4">
                      <div>
                        <h4 className="fs-22 fw-semibold ff-secondary mb-3">
                          <Currency
                            value={amount}
                            symbol={selectedCurrency?.symbol || "₹"}
                          />
                        </h4>

                        <span className={`badge bg-${color} me-1`}>
                          <StatCount value={count} />
                        </span>
                        <span className="text-muted"> {label}</span>
                      </div>

                      <div className="avatar-sm flex-shrink-0">
                        <span className="avatar-title bg-light rounded fs-3">
                          <i className={`${icon} text-${color}`} />
                        </span>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )
          )}
        </Row>

        {/* ================= REVENUE + STATUS ================= */}

        {/* Outstanding */}
        <Card className="shadow-sm mb-4">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <div className="h6 text-muted mb-1">Outstanding Amount</div>
              <h2 className="text-danger fw-bold">
                <Currency value={stats.outstandingAmount} symbol={selectedCurrency?.symbol || "₹"} />
              </h2>
            </div>


          </Card.Body>
        </Card>

        {/* ================= RECENT INVOICES + SIDEBAR ================= */}
        <Row className="g-3 mb-3">
          <Col xl={12}>
            {/* RECENT INVOICES */}
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between mb-4">
                  <Card.Title><h2 className="h6 text-muted">Recent Invoices</h2></Card.Title>
                  <Button
                    as={Link}
                    to="/client/invoice"
                    size="sm"
                    variant="outline-primary"
                  >
                    View All
                  </Button>
                </div>

                <div className="table-responsive table-card">
                  <Table hover size="sm" className="align-middle  mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Invoice #</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={6}>
                            <div className="text-center text-muted py-4">
                              No recent invoices found
                            </div>
                          </td>
                        </tr>
                      ) : (
                        recentInvoices.map((inv) => (
                          <tr key={inv.id}>
                            <td>{inv.invoice_number}</td>
                            <td className="fw-semibold text-success">
                              <Currency value={inv.amount} symbol={selectedCurrency?.symbol || "₹"} />
                            </td>
                            <td>{formatDateDDMMYYYY(inv.dueDate)}</td>
                            <td>{renderStatusBadge(inv.status)}</td>
                            <td>
                              <Button
                                as={Link}
                                to={`/client/invoice/view/${inv.id}`}
                                size="sm"
                                variant="link"
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                  </Table>
                </div>
              </Card.Body>
            </Card>

            {/* Upcoming Due Invoices */}
            <Card className="shadow-sm">
              {/* Header */}
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h6 className="text-muted mb-0">Upcoming Due Invoices</h6>
                <Badge bg="light" text="dark">Next 7 Days</Badge>
              </Card.Header>

              {/* Body */}
              <Card.Body className="p-0">
                {upcomingInvoices?.length === 0 ? (
                  /* Empty State */
                  <div className="text-center py-5 text-muted">
                    <i className="ri-calendar-check-line fs-2 mb-2 d-block" />
                    <div className="fw-medium">No invoices due soon</div>
                    <small>You're all caught up 🎉</small>
                  </div>
                ) : (
                  <Table hover responsive className="mb-0 align-middle">
                    <tbody>
                      {upcomingInvoices.slice(0, 5).map((inv) => {
                        const isCritical = inv.daysLeft <= 3;

                        return (
                          <tr key={inv.id}>
                            {/* Client */}
                            <td>
                              <div className="fw-medium text-truncate">
                                {inv.client}
                              </div>
                              <small className="text-muted">
                                #{inv.invoice_number}
                              </small>
                            </td>

                            {/* Amount & Due */}
                            <td className="text-end">
                              <div className="fw-semibold">
                                <Currency
                                  value={inv.amount}
                                  symbol={selectedCurrency?.symbol || "₹"}
                                />
                              </div>
                              <Badge bg={isCritical ? "danger" : "warning"} className="mt-1">
                                Due in {inv.daysLeft} day{inv.daysLeft > 1 && "s"}
                              </Badge>
                            </td>

                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                )}
              </Card.Body>

              {/* Footer */}
              {upcomingInvoices?.length > 0 && (
                <Card.Footer className="text-center bg-light">
                  <Link to="/client/invoice?status=new" className="fw-medium">
                    View All Upcoming Invoices →
                  </Link>
                </Card.Footer>
              )}
            </Card>


          </Col>


        </Row>

      </div>
    </LayoutWrapper >

  );
};

export default Dashboard;
