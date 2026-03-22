import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../assets/Axios";
import AnalyticsDisplay from "../components/AnalyticsDisplay";

const Analytics = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/analytics/yourUrl/${id}`).then((res) => setData(res.data.data));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <main className="min-h-screen p-8 bg-yellow-200 pt-28">
      <div className="max-w-4xl mx-auto">
        <AnalyticsDisplay
          analytics={data.analytics}
          shortUrl={`http://localhost:8000/${data.shortUrl}`}
        />
      </div>
    </main>
  );
};

export default Analytics;
