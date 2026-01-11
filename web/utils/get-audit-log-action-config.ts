import { AuditLogAction } from "@/enums/audit-action";

const auditLogActionConfigs: Record<AuditLogAction, string> = {
  [AuditLogAction.LOGIN]: "Login",
  [AuditLogAction.SIGNUP]: "Novo Cadastro",
  [AuditLogAction.VERIFY_EMAIL]: "Verificação de E-mail",
  [AuditLogAction.RESEND_VERIFICATION]: "Reenvio de Verificação",
  [AuditLogAction.RECOVER_PASSWORD]: "Recuperação de Senha",
  [AuditLogAction.RESET_PASSWORD]: "Redefinição de Senha",
  [AuditLogAction.REFRESH_TOKEN]: "Atualização de Token",
  [AuditLogAction.VALIDATE_TOKEN]: "Validação de Token",
};

export const getAuditLogActionConfigs = (action: string): string => {
  return (
    auditLogActionConfigs[action as AuditLogAction] ||
    action.replace("_", " ").toUpperCase()
  );
};
