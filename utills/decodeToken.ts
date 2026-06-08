import { jwtDecode } from "jwt-decode";
export const decodeToken = (token: string) => {
  //   const accessToken = token.split(" ")[1];
  //   return jwtDecode(accessToken);
  return jwtDecode(token);
};
