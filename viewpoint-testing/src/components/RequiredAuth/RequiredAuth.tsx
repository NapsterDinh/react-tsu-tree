import { usePermissions } from "@hooks/usePermissions";
import type { LocationState } from "@models/type";
import { Navigate, Outlet, useLocation } from "react-router-dom";
export const RequiredPermission = ({ allowedPermission }) => {
  const { checkPermission, checkUserLogin } = usePermissions();
  const location = useLocation();
  if (checkUserLogin()) {
    if (checkPermission(allowedPermission)) {
      return <Outlet />;
    }
    return (
      <Navigate to="/forbidden" state={{ from: location.pathname }} replace />
    );
  }
  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

export const PublicRoute = () => {
  const { checkUserLogin } = usePermissions();
  const location = useLocation();
  const { from } = (location.state as LocationState) ?? { from: "/" };

  if (!checkUserLogin()) {
    return <Outlet />;
  }
  return <Navigate to={from} replace />;
};

export default RequiredPermission;
