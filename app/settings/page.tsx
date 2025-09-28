import AccountSettings from "@/components/AccountSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function page() {
  return (
    <ProtectedRoute>
      <AccountSettings />
    </ProtectedRoute>
  );
}

export default page;
