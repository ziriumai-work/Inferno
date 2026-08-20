/**
 * Security Audit Logging Utility
 * Ensures structured logging of security-sensitive operations while redacting sensitive fields.
 */

export type SecurityLogLevel = "INFO" | "WARN" | "ERROR" | "AUDIT";

export interface SecurityLogPayload {
  eventType: string;
  level: SecurityLogLevel;
  userEmail?: string | null;
  userId?: string | null;
  ip?: string;
  action?: string;
  details?: Record<string, unknown>;
}

const SENSITIVE_KEYS = ["password", "token", "secret", "authorization", "apiKey", "access_token", "refresh_token"];

function sanitizeDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!details) return undefined;
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    const isSensitive = SENSITIVE_KEYS.some((sensitive) => key.toLowerCase().includes(sensitive));
    if (isSensitive) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeDetails(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function logSecurityEvent(payload: SecurityLogPayload): void {
  const timestamp = new Date().toISOString();
  const entry = {
    timestamp,
    eventType: payload.eventType,
    level: payload.level,
    userEmail: payload.userEmail || "anonymous",
    userId: payload.userId || null,
    ip: payload.ip || "unknown",
    action: payload.action || undefined,
    details: sanitizeDetails(payload.details),
  };

  const formattedLog = `[SECURITY Audit] [${entry.timestamp}] [${entry.level}] [${entry.eventType}] User: ${entry.userEmail} | Action: ${entry.action || "N/A"}`;

  switch (payload.level) {
    case "ERROR":
      console.error(formattedLog, entry.details || "");
      break;
    case "WARN":
      console.warn(formattedLog, entry.details || "");
      break;
    case "AUDIT":
    case "INFO":
    default:
      console.log(formattedLog, entry.details || "");
      break;
  }
}
