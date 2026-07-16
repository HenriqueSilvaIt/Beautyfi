// Este arquivo foi simplificado — a lógica de pacotes agora é gerenciada
// via API real (usePackageMutation + package.service.ts).
// Mantido apenas para compatibilidade de importações existentes.

export interface PackageProps {
  id: number;
  name: string;
  price: string;
  duration: string;
  description: string;
  imgUrl?: string;
  servicesIncluded?: string;
  active?: boolean;
  companyId?: number;
}
