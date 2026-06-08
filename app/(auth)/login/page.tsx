import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoginComponent from "@/components/auth/login/LoginComponent";
import RegisterComponent from "@/components/auth/register/RegisterComponent";

const LoginPage = () => {
  return (
    <AuthSplitLayout
      activeSide="login"
      loginForm={<LoginComponent />}
      registerForm={<RegisterComponent />}
    />
  );
};

export default LoginPage;
