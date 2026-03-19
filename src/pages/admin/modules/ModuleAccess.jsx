import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Row, Col, Card, Form, Table, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import Select from 'react-select'

import LayoutWrapper from "../components/LayoutWrapper";
import http from "../../../utils/http";

import { SkeletonDropdown, SkeletonTableList } from "../../../components/Skeleton";


const ModuleAccess = () => {
  const [users, setUsers] = useState([]);
  const [modules, setModules] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);

  const { uuid } = useParams();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 0;

  const [selectedUser, setSelectedUser] = useState("");


  /* -------------------------------------------------------------------------- */
  /*              Fetch Modules + Permissions For Selected User                 */
  /* -------------------------------------------------------------------------- */
  const fetchModules = useCallback(async (userUuid) => {

    try {
      setLoadingModules(true);
      const { data } = await http.get(`user-permissions/${userUuid}/getAll`);

      if (data?.status) {
        setModules(data.data.modules || []);
        setUserPermissions(data.data.userPermissions || []);
      }
    } catch {
      toast.error("Failed to load modules");
    } finally {
      setLoadingModules(false);
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                               Fetch Users List                             */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await http.get("users/getList");

        if (data?.status) {
          setUsers(data.data || []);

          if (uuid && data.data.some((u) => u.uuid === uuid)) {
            setSelectedUser(uuid);
            fetchModules(uuid);
          }
        }
      } catch {
        toast.error("Failed to load users");
      }

      setLoadingUsers(false);
    };

    fetchUsers();
  }, [uuid, fetchModules]);



  const handleUserChange = (value) => {
    const userUuid = value;
    setSelectedUser(userUuid);

    if (!userUuid) {
      setModules([]);
      setUserPermissions([]);
      return;
    }

    fetchModules(userUuid);
  };


  const handlePermissionToggle = async (modulePermissionId, isChecked) => {
    if (!selectedUser) {
      toast.error("Please select a user first.");
      return;
    }

    try {
      const { data } = await http.post("user-permissions/toggle", {
        userUuid: selectedUser,
        modulePermissionId,
        isChecked,
      });

      if (data?.status) {
        toast.success("Permission updated!");
        fetchModules(selectedUser);
      } else {
        toast.error("Failed to update permission");
      }
    } catch {
      toast.error("Error updating permission");
    }
  };

  const permissionHeaders = useMemo(
    () => (modules.length > 0 ? modules[0].permissions : []),
    [modules]
  );

  const userOptions = users.map((u) => ({
    value: u.uuid,
    label: u.name
  }));
  /* -------------------------------------------------------------------------- */
  /*                                  Render                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <LayoutWrapper>
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-0">Module Access Permissions</h4>
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Module Access Permissions</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <Col sm={3}>
                {loadingUsers ? (
                  <SkeletonDropdown />
                ) : (
                  <Select
                    options={[{ value: "", label: "Select User" }, ...userOptions]}
                    value={userOptions.find((opt) => opt.value === selectedUser) || null}
                    onChange={(option) => handleUserChange(option?.value)}
                    placeholder="Select User"
                    className="nack-react-select"
                    classNamePrefix="nack-rs"
                  />
                )}
              </Col>
            </Card.Header>

            <Card.Body>
              {/* TABLE LOADING SKELETON */}
              {loadingModules ? (
                <SkeletonTableList rows={6} cols={6} />
              ) : !selectedUser ? (
                <div className="text-muted">Please select a user to view permissions.</div>
              ) : (
                <Table bordered hover className="align-middle text-center">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "20%" }}>Module</th>
                      {permissionHeaders.map((p, i) => (
                        <th key={i}>
                          {p.action.charAt(0).toUpperCase() + p.action.slice(1)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {modules.length === 0 ? (
                      <tr>
                        <td colSpan={permissionHeaders.length + 1} className="text-muted py-4">
                          No modules found
                        </td>
                      </tr>
                    ) : (
                      modules.map((mod) => (
                        <tr key={mod.uuid}>
                          <td className="text-start">{mod.displayName}</td>

                          {mod.permissions.map((perm) => {
                            const checked = userPermissions.includes(
                              perm.modulePermissionId
                            );

                            return (
                              <td key={perm.modulePermissionId}>
                                <Form.Check
                                  type="checkbox"
                                  checked={checked}
                                  onChange={(e) =>
                                    handlePermissionToggle(
                                      perm.modulePermissionId,
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

          {page > 0 && (
            <div className="text-end mb-4">
              <Button as={Link} to={`/user?page=${page}`} variant="secondary">
                Back to List
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </LayoutWrapper>
  );
};

export default ModuleAccess;
