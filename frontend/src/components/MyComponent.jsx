// frontend/src/components/MyComponent.jsx

import React, { useEffect, useState } from 'react';
import { djangoApi, fastApi } from '../api'; // Import your instances

const MyComponent = () => {
    const [userData, setUserData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        // Example: Get user profile from Django
        djangoApi.get('/users/profile/')
            .then(response => {
                setUserData(response.data);
            })
            .catch(error => console.error("Error fetching from Django:", error));

        // Example: Get some high-volume data from FastAPI
        fastApi.get('/dashboard/metrics/')
            .then(response => {
                setDashboardData(response.data);
            })
            .catch(error => console.error("Error fetching from FastAPI:", error));
    }, []);

    return (
        <div>
            {/* Render your data here */}
        </div>
    );
};