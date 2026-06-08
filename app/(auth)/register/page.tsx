import AuthSplitLayout from "@/components/auth/AuthSplitLayout";
import LoginComponent from "@/components/auth/login/LoginComponent";
import RegisterComponent from "@/components/auth/register/RegisterComponent";

const RegistrationPage = () => {
  return (
    <AuthSplitLayout
      activeSide="register"
      loginForm={<LoginComponent />}
      registerForm={<RegisterComponent />}
    />
  );
};

export default RegistrationPage;
