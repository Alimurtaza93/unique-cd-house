import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { getViewer } from "@/lib/auth";

export default async function LoginPage() {
  const viewer = await getViewer();
  if (viewer) redirect(viewer.profile?.role === "admin" ? "/admin" : "/account");
  return <main className="auth-page"><div className="auth-copy"><span className="eyebrow">Unique CD House account</span><h1>Login to manage your orders and account.</h1><p>Customers can view order history and tracking. Administrator accounts automatically open the store management dashboard.</p><div className="auth-benefits"><span>One secure login</span><span>Order history</span><span>Fast order tracking</span></div></div><LoginForm /></main>;
}
