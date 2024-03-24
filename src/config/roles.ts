const allRoles = {
  user: [],
  admin: [
    'getUsers',
    'manageUsers',
    'manageFAQs',
    'manageSettings',
    'manageTransactions',
    'manageOffers',
    'getAnalytics',
  ],
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
