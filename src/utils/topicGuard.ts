type Policy = { topicPattern: string; roles: string[]; attributes?: Record<string, any> };

const policies: Policy[] = [
  { topicPattern: '^/admin/.*', roles: ['admin'] },
  { topicPattern: '^/user/.*', roles: ['admin', 'user'] },
];

export function topicGuard(destination: string, userRole: string, attributes?: Record<string, any>): boolean {
  for (const policy of policies) {
    if (new RegExp(policy.topicPattern).test(destination)) {
      if (!policy.roles.includes(userRole)) return false;
      // Here you can add attribute checks if needed
    }
  }
  return true;
}