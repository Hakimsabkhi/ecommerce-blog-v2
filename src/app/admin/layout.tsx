import NavAdmin from "@/components/Admin/menu/NavAdmin";
import HeaderAdmin from "@/components/Admin/menu/HeaderAdmin";
import { ToastContainer } from "react-toastify";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
      <HeaderAdmin />
      <NavAdmin />
      {children}
    </>
  );
};

export default AdminLayout;
