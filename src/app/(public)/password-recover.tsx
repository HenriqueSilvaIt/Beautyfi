import { PasswordRecoverView } from "@/viewModel/Login/PasswordRecover/PasswordRecoverView";
import { usePasswordRecoverViewModel } from "@/viewModel/Login/PasswordRecover/usePasswordRecoverViewModel";

export default function PasswordRecover() {

    const props = usePasswordRecoverViewModel();
  return (
      <PasswordRecoverView  {...props}/>
  );
}
