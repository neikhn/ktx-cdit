const UserRoles = {
  ADMINISTRATOR: 1,
  MANAGER: 2,
  SHIFT_SUPERVISOR: 3,
  STUDENT: 4,
};

const roleHierarchy = {
  [UserRoles.ADMINISTRATOR]: 1,
  [UserRoles.MANAGER]: 2,
  [UserRoles.SHIFT_SUPERVISOR]: 3,
  [UserRoles.STUDENT]: 4,
};

const roleHelper = {
  // if userRole has permission over targetRole
  hasPermissionOver: (userRole, targetRole) => {
    return roleHierarchy[userRole] < roleHierarchy[targetRole];
  },

  // if user has minimum required role
  hasMinimumRole: (userRole, requiredRole) => {
    return roleHierarchy[userRole] <= roleHierarchy[requiredRole];
  },

  getRoleName: (roleId) => {
    switch (roleId) {
      case UserRoles.ADMINISTRATOR:
        return "Administrator";
      case UserRoles.MANAGER:
        return "Manager";
      case UserRoles.SHIFT_SUPERVISOR:
        return "Shift Supervisor";
      case UserRoles.STUDENT:
        return "Student";
      default:
        return "Unknown Role";
    }
  },
};

module.exports = {
  UserRoles,
  roleHelper,
};
