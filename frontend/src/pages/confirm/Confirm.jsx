import "./confirm.css";
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';


const Confirm = () => {
    const location = useLocation();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_PROD_URL ? process.env.REACT_APP_PROD_URL : process.env.REACT_APP_LOCAL_URL}/api/confirm-email${location.pathname}`, { method: 'PATCH' });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'An error happened when confirming email.');
                }
            } catch (error) {
                alert('An error happened when confirming email:', error.message);
            }
            alert('Email has been confirmed.');
            window.location.href = '/';
        };
        confirmEmail();
    }, [location.pathname]);

    return (
        <div>
            <h1>Weather Dashboard</h1>
            <div className="container">
            </div>
        </div>
    )
};

export default Confirm;