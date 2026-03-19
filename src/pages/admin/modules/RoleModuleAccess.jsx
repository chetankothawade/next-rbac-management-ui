import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Table, Form } from "react-bootstrap";
import toast from "react-hot-toast";

import LayoutWrapper from "../components/LayoutWrapper";
import http from "../../../utils/http";
import { SkeletonTableList } from "../../../components/Skeleton";

const ModuleAccess = () => {
  const [modules, setModules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                              Fetch Matrix                                  */
  /* -------------------------------------------------------------------------- */
  const fetchMatrix = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await http.get("role-modules/matrix");
      const payload = data?.data;

      if (data?.status && payload) {
        setRoles(payload.roles || []);
        setModules(payload.modules || []);
      } else {
        setRoles([]);
        setModules([]);
        toast.error(data?.message || "Failed to load permission matrix");
      }
    } catch {
      toast.error("Failed to load permission matrix");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  /* -------------------------------------------------------------------------- */
  /*                           Toggle Permission                                 */
  /* -------------------------------------------------------------------------- */
  const togglePermission = async (role, moduleId, enabled) => {
    try {
      await http.post("role-modules/toggle", {
        role,
        module_id: moduleId,
        enabled,
      });

      // Optimistic update
      setModules((prev) =>
        prev.map((m) =>
          m.id === moduleId
            ? {
              ...m,
              permissions: {
                ...m.permissions,
                [role]: enabled,
              },
            }
            : m
        )
      );
    } catch {
      toast.error("Failed to update permission");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                  Render                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <LayoutWrapper>
      {/* Header */}
      <div className="page-title-box d-sm-flex align-items-center justify-content-between">
        <h4 className="mb-0">Role Module Access</h4>
        <div className="page-title-right">
          <ol className="breadcrumb m-0">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Role Module Access</li>
          </ol>
        </div>
      </div>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              {loading ? (
                <SkeletonTableList rows={4} cols={roles.length + 1} />
              ) : (
                <Table bordered hover responsive className="text-center">
                  <thead className="table-light">
                    <tr>
                      <th className="text-start">Module</th>
                      {roles.map((role) => (
                        <th key={role}>
                          {role.replace("_", " ").toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {modules.map((module) => (
                      <tr key={module.id}>
                        <td className="text-start">{module.name}</td>

                        {roles.map((role) => (
                          <td key={role}>
                            <Form.Check
                              disabled={role === "super_admin" || module.name === "Dashboard"}
                              type="checkbox"
                              checked={Boolean(module?.permissions?.[role])}
                              onChange={(e) => togglePermission(role, module.id, e.target.checked)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </LayoutWrapper>
  );
};

export default ModuleAccess;
