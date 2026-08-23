import { useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import AdminLayout from "../components/AdminLayout";
import AdminJobForm from "../components/AdminJobForm";

export default function AdminJobNew() {
  const navigate = useNavigate();

  const handleSubmit = async (job) => {
    await adminApi.createJob(job);
    navigate("/admin");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Add Job</h1>
      <AdminJobForm onSubmit={handleSubmit} submitLabel="Publish" />
    </AdminLayout>
  );
}
