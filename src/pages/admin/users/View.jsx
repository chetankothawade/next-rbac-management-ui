// src/pages/admin/users/View.js
import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import LayoutWrapper from "../components/LayoutWrapper";
import userService from "../../../services/userService";

import { Card, Table, Row, Col, Button, Badge } from "react-bootstrap";
import { SkeletonLayout, SkeletonDetails } from "../../../components/Skeleton";

const View = () => {
  const { t } = useTranslation();

  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* -----------------------------
     FETCH USER
  ----------------------------- */
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.get(uuid);

      if (response?.data?.status) {
        setUser(response.data.data);
      } else {
        throw new Error();
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
  }, [uuid, t]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <LayoutWrapper title={t("user.view_title")}>
      {loading ? (
        <SkeletonLayout>
          <SkeletonDetails fields={9} />
        </SkeletonLayout>
      ) : (
        <>
          {/* HEADER */}
          <Row className="mb-3">
            <Col>
              <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                <h4 className="mb-0">{t("user.view_title")}</h4>

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
                      {t("breadcrumb.view")}
                    </li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>

          {/* DETAILS */}
          <Row>
            <Col lg={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  {user ? (
                    <Table bordered responsive className="mb-0">
                      <tbody>
                        <tr>
                          <th style={{ width: "20%" }}>
                            {t("table.name")}
                          </th>
                          <td>{user.name || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.email")}</th>
                          <td>{user.email || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.phone")}</th>
                          <td>{user.phone || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.role")}</th>
                          <td>{user.role || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.status")}</th>
                          <td>
                            <Badge
                              bg={
                                user.status === "active"
                                  ? "success"
                                  : "danger"
                              }
                            >
                              {t(`status.${user.status}`)}
                            </Badge>
                          </td>
                        </tr>

                        <tr>
                          <th>{t("table.created_at")}</th>
                          <td>{user.created_at || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.updated_at")}</th>
                          <td>{user.updated_at || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.last_login_at")}</th>
                          <td>{user.last_login_at || t("common.na")}</td>
                        </tr>

                        <tr>
                          <th>{t("table.last_login_ip")}</th>
                          <td>{user.last_login_ip || t("common.na")}</td>
                        </tr>
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted text-center mb-0">
                      {t("common.no_data")}
                    </p>
                  )}
                </Card.Body>
              </Card>

              {/* BACK BUTTON */}
              <div className="text-end mt-3 mb-4">
                <Button
                  as={Link}
                  to={`/user?page=${page}`}
                  variant="secondary"
                >
                  {t("button.back_to_list")}
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </LayoutWrapper>
  );
};

export default View;
