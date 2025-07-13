
import { useRoutes } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import publicRoutes from "./publicRoutes";

const Routes = () => {
  const element = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: publicRoutes,
    },
    
  ]);

  return element;
};

export default Routes;
