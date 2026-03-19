import { useEffect, useState } from 'react';
import api from '../services/api'; // Your custom axios instance

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // This call triggers your interceptor!
                const res = await api.get('/projects'); 
                setProjects(res.data);
            } catch (err) {
                console.error("Fetch failed", err.response?.status);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div>
            <h1>User Dashboard</h1>
            {/* Render your projects here later */}
        </div>
    );
};
export default Dashboard;