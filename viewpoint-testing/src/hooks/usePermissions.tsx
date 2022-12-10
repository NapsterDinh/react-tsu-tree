export const usePermissions = () => {
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const checkPermission = (permissions) => {
    // if (!permissions || !user || !user?.permissions) {
    //   return false;
    // }
    // let match = false;
    // const permissionsArr = Array.isArray(permissions)
    //   ? permissions
    //   : [permissions];
    // if (permissionsArr.length === 0) {
    //   match = true;
    // } else {
    //   match = permissionsArr.some((p) => user.permissions.includes(p));
    // }
    return true;
  };

  const checkUserLogin = () => {
    if (localStorage.getItem("token")) {
      return true;
    }
    return false;
  };

  if (!user) {
    return { checkPermission, checkUserLogin, permissions: [] };
  }

  return { checkPermission, checkUserLogin, permissions: user?.permissions };
};
