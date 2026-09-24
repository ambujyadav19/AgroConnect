import React, { useEffect, useState } from 'react';

const AgricultureSchemes = () => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSchemes = async () => {
        try {
            const response = await fetch(
            'https://api.data.gov.in/resource/9afdf346-16d7-4f17-a2e3-684540c59a77?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=10'
            );
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log("fetchAPIData: ",data.records[0].name_of_mission___scheme)
            setSchemes(data.records); // Access the records array in the response
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
        };

        fetchSchemes();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-6">Agriculture Schemes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme, index) => (
            <div key={index} className="border p-4 rounded shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-2">{scheme.name_of_mission___scheme}</h2>
                {/* <p><strong>State:</strong> {scheme.state}</p> */}
                {/* <p><strong>District:</strong> {scheme.district}</p> */}
                {/* <p><strong>Scheme Type:</strong> {scheme.scheme_type}</p> */}
            </div>
            ))}
        </div>
        </div>
    );
};
export default AgricultureSchemes;
