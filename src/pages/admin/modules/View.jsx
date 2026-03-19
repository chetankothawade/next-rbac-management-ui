import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import LayoutWrapper from "../components/LayoutWrapper";
import { SkeletonLayout, SkeletonDetails } from "../../../components/Skeleton";

import { Row, Col, Card, Table, Button } from "react-bootstrap";
import moduleService from "../../../services/moduleService";

const ViewModule = () => {
  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [module, setModule] = useState(null);

  /** Fetch Module Details */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await moduleService.get(uuid);

      if (response?.data?.status && response.data.data) {
        setModule(response.data.data);
      } else {
        toast.error(response?.data?.message || "Module not found");
        navigate("/module");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong while fetching module.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [uuid, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <LayoutWrapper title="View Module">
      {/* Skeleton Like User View */}
      {loading ? (
        <SkeletonLayout>
          <SkeletonDetails fields={9} />
        </SkeletonLayout>
      ) : (
        <>
          {/* Page Header */}
          <Row className="mb-3">
            <Col>
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0">View Module</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to={`/module?page=${page}`}>Modules</Link>
                    </li>
                    <li className="breadcrumb-item active">View</li>
                  </ol>
                </div>
              </div>
            </Col>
          </Row>

          {/* Module Details */}
          <Row>
            <Col lg={12}>
             <Card className="shadow-sm">
                <Card.Body>
                  {module ? (
                    <Table bordered responsive className="mb-0">
                      <tbody>
                        <tr>
                          <th style={{ width: "25%" }}>Name</th>
                          <td>{module.name || "N/A"}</td>
                        </tr>

                        {module.parent_id && (
                          <tr>
                            <th>Parent Module</th>
                            <td>{module.parent?.name || "N/A"}</td>
                          </tr>
                        )}

                        <tr>
                          <th>Route</th>
                          <td>{module.url || "N/A"}</td>
                        </tr>

                        {!module.parent_id && (
                          <tr>
                            <th>Icon</th>
                            <td>{module.icon || "N/A"}</td>
                          </tr>
                        )}

                        <tr>
                          <th>Sequence No</th>
                          <td>{module.seq_no || "N/A"}</td>
                        </tr>

                        <tr>
                          <th>Permission</th>
                          <td>{module.is_permission === "Y" ? "Yes" : "No"}</td>
                        </tr>

                        <tr>
                          <th>Status</th>
                          <td>
                            <span
                              className={`badge ${module.status === "active" ? "bg-success" : "bg-danger"
                                }`}
                            >
                              {module.status || "N/A"}
                            </span>
                          </td>
                        </tr>

                        <tr>
                          <th>Created At</th>
                          <td>{module.created_at || "N/A"}</td>
                        </tr>

                        {module.updated_at && (
                          <tr>
                            <th>Updated At</th>
                            <td>{module.updated_at || "N/A"}</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted">No module data found</p>
                  )}
                </Card.Body>
              </Card>

              {/* Back Button */}
              <div className="text-end mt-3 mb-4">
                <Button
                  as={Link}
                  to={
                    module?.parent_id
                      ? `/module/${module.parent_id}`
                      : `/module?page=${page}`
                  }
                  variant="secondary"
                >
                  Back to List
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </LayoutWrapper>
  );
};

export default ViewModule;
