export const forecastWeather = async (req, res) => {
    const city = req.params.city;
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${process.env.API_KEY}&days=14&q=${city}`);
        if (!response.ok) {
            throw new Error("Failed to fetch forecast");
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (err) {
        console.error("An error occurred while fetching forecast:", err);
        res.status(500).json({ error: "An error occurred while fetching forecast" });
    }
};