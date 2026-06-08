import ResetPassword from "@/components/auth/resetPassword/ResetPassword";
import { verifyForgetPassToken } from "@/service/authService";

const SetNewPasswordPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { token } = await searchParams;
  const result = await verifyForgetPassToken(token as string);
  const isVerified = result?.success;
  return (
    <section className="min-h-screen flex items-center justify-center">
      <ResetPassword token={token as string} isVerified={isVerified} />
    </section>
  );
};

export default SetNewPasswordPage;
