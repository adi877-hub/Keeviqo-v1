import { Request, Response, NextFunction } from 'express';

export enum UserRole {
  FREE = 'free',
  PREMIUM = 'premium',
  ADMIN = 'admin'
}

export enum PermissionLevel {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}

const rolePermissions: Record<UserRole, Record<string, PermissionLevel>> = {
  [UserRole.FREE]: {
    'categories': PermissionLevel.READ,
    'subcategories': PermissionLevel.READ,
    'features': PermissionLevel.READ,
    'documents': PermissionLevel.READ,
    'reminders': PermissionLevel.READ,
    'forms': PermissionLevel.READ,
    'emergency-data': PermissionLevel.READ,
    'custom-categories': PermissionLevel.READ,
  },
  [UserRole.PREMIUM]: {
    'categories': PermissionLevel.READ,
    'subcategories': PermissionLevel.READ,
    'features': PermissionLevel.READ,
    'documents': PermissionLevel.WRITE,
    'reminders': PermissionLevel.WRITE,
    'forms': PermissionLevel.WRITE,
    'emergency-data': PermissionLevel.WRITE,
    'custom-categories': PermissionLevel.WRITE,
    'analytics': PermissionLevel.READ,
    'advanced-search': PermissionLevel.READ,
    'ai-assistant': PermissionLevel.READ,
  },
  [UserRole.ADMIN]: {
    'categories': PermissionLevel.ADMIN,
    'subcategories': PermissionLevel.ADMIN,
    'features': PermissionLevel.ADMIN,
    'documents': PermissionLevel.ADMIN,
    'reminders': PermissionLevel.ADMIN,
    'forms': PermissionLevel.ADMIN,
    'emergency-data': PermissionLevel.ADMIN,
    'custom-categories': PermissionLevel.ADMIN,
    'analytics': PermissionLevel.ADMIN,
    'advanced-search': PermissionLevel.ADMIN,
    'ai-assistant': PermissionLevel.ADMIN,
    'user-management': PermissionLevel.ADMIN,
    'system-settings': PermissionLevel.ADMIN,
  }
};

export const featureLimits: Record<UserRole, Record<string, number>> = {
  [UserRole.FREE]: {
    'documents': 10,
    'reminders': 5,
    'forms': 3,
    'emergency-contacts': 2,
    'custom-categories': 3,
  },
  [UserRole.PREMIUM]: {
    'documents': 100,
    'reminders': 50,
    'forms': 30,
    'emergency-contacts': 10,
    'custom-categories': 20,
  },
  [UserRole.ADMIN]: {
    'documents': -1, // unlimited
    'reminders': -1, // unlimited
    'forms': -1, // unlimited
    'emergency-contacts': -1, // unlimited
    'custom-categories': -1, // unlimited
  }
};

export function requirePermission(resource: string, requiredLevel: PermissionLevel) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRole = user.role as UserRole || UserRole.FREE;
    const userPermission = rolePermissions[userRole][resource] || PermissionLevel.READ;
    
    const hasPermission = checkPermissionLevel(userPermission, requiredLevel);
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        requiredRole: getMinimumRoleForPermission(resource, requiredLevel)
      });
    }
    
    next();
  };
}

function checkPermissionLevel(userLevel: PermissionLevel, requiredLevel: PermissionLevel): boolean {
  if (userLevel === PermissionLevel.ADMIN) return true;
  if (userLevel === PermissionLevel.WRITE && requiredLevel === PermissionLevel.READ) return true;
  return userLevel === requiredLevel;
}

function getMinimumRoleForPermission(resource: string, level: PermissionLevel): UserRole {
  for (const [role, permissions] of Object.entries(rolePermissions)) {
    if (checkPermissionLevel(permissions[resource] || PermissionLevel.READ, level)) {
      return role as UserRole;
    }
  }
  return UserRole.ADMIN; // Default to admin if no role has the permission
}

export function checkFeatureLimit(feature: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const userRole = user.role as UserRole || UserRole.FREE;
    const limit = featureLimits[userRole][feature];
    
    if (limit === -1) {
      return next();
    }
    
    try {
      const count = 0; // Placeholder, implement actual count
      
      if (count >= limit) {
        return res.status(403).json({ 
          error: `You have reached the limit for ${feature}`,
          limit,
          upgradeRequired: userRole !== UserRole.PREMIUM
        });
      }
      
      next();
    } catch (error) {
      console.error(`Error checking ${feature} limit:`, error);
      next(); // Proceed anyway to avoid blocking user on error
    }
  };
}
