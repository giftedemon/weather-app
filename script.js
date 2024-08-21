const form = document.querySelector("form");
const cityBlock = document.querySelector(".city");
const temperatureBlock = document.querySelector(".temperature");
const conditionBlock = document.querySelector(".condition");
const sunriseBlock = document.querySelector(".sunrise");
const sunsetBlock = document.querySelector(".sunset");
const img = document.querySelector("img");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    img.src = "./loading.gif";

    const city = form.querySelector("input").value;

    try {
        const allWeatherData = await getWeather(city);
        const requiredWeatherData = getRequiredData(allWeatherData);
        await getGif(requiredWeatherData.conditions);
        fillDetails(requiredWeatherData);
    } catch (error) {
        handleError(error);
    }
});

const getWeather = async (city) => {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=7DGBYMTAP3FN2Z7Z9KVGA4ALC&contentType=json`,
            {
                mode: "cors",
                method: "GET",
            }
        );

        if (!response.ok) throw new Error(`Error status: ${response.status}`);

        const data = await response.json();

        return data;
    } catch (error) {
        throw error;
    }
};

const getRequiredData = (data) => {
    const { address } = data;
    let { conditions, temp, sunrise, sunset } = data.currentConditions;

    temp = (5 / 9) * (temp - 32);
    temp = temp.toFixed(1);

    return { address, conditions, temp, sunrise, sunset };
};

const getGif = async (condition) => {
    try {
        const response = await fetch(
            `https://api.giphy.com/v1/gifs/translate?api_key=bb2006d9d3454578be1a99cfad65913d&s=weather-${condition}`,
            { method: "GET" }
        );

        if (!response.ok) throw new Error("Error in handling fetch");

        const data = await response.json();

        if (data.data.length === 0) throw new Error("GIF was not found");

        img.src = data.data.images.original.url;
    } catch (error) {
        throw error;
    }
};

const fillDetails = ({ temp, address, conditions, sunrise, sunset }) => {
    temperatureBlock.textContent = `${temp}C`;
    cityBlock.textContent = address;
    conditionBlock.textContent = conditions;
    sunriseBlock.textContent = sunrise;
    sunsetBlock.textContent = sunset;
};

const handleError = (error) => {
    console.error(error);
    img.src = "./error.png";
};

getGif("Hello");
