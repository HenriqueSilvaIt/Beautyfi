export interface UserProps {
  id: number;
  firstName: string;
  lastName?: string;
  avatarUrl: string;
  birthDate?: string;
  email: string;
  google_id?: string;
  appleId?: string;
  googleUser?: boolean;
  phone: string;
  roles: Roles[];
  stripeCustomerId?: string
  employeeId: number | null;
  askWhatsappConfirmation?: boolean;
  whatsappAskedOnce?: boolean;
  allowWhatsAppNotifications?: boolean;
  subscriptionExpired?: boolean;
}

export interface UserInterface {
  id?: number;
  firstName: string;
  birthDate?: string;
  avatarUrl?: string;
  phone: string;
  askWhatsappConfirmation?: boolean;
  whatsappAskedOnce?: boolean;
  allowWhatsAppNotifications?: boolean;
}

export interface UserChangePasswordInterface {
  currentPassword: string;
  password: string;
}

export interface Roles {
  id: number;
  authority: string;
}

export interface UpdateUserPreferencesInterface {
  allowWhatsAppNotifications?: boolean;
  askWhatsappConfirmation?: boolean;
  whatsappAskedOnce?: boolean;
}


export interface UpdateUserSignupInterface {
  phone: string
  birthDate: string
}