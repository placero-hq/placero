import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../lib/adminApi";
import AdminLayout from "../components/AdminLayout";
import AdminJobForm from "../components/AdminJobForm";

export default function AdminJobEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    adminApi.getJob(id).then(setJob);
  }, [id]);

  const handleSubmit = async (updated) => {
    await adminApi.updateJob(id, updated);
    navigate("/admin");
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      {job ? <AdminJobForm initialJob={job} onSubmit={handleSubmit} submitLabel="Save Changes" /> : <p className="text-sm text-muted">Loading…</p>}
    </AdminLayout>
  );
}
