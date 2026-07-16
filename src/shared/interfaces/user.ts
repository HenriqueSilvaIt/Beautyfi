export interface UserProps {
  id: number;
  firstName: string;
  lastName?: string;
  avatarUrl: string;
  birthDate?: string;
  companyId?: number;
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
  allowPushNotifications?: boolean;
  subscriptionExpired?: boolean;
  firstLogin?: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
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
  allowPushNotifications?: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
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
  allowPushNotifications?: boolean;
}


export interface UpdateUserSignupInterface {
  phone: string
  birthDate: string
}