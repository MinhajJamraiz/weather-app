import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";

const api = {
  key: "9af52dfa5cf1961a935773ba14520c71",
  base: "https://api.openweathermap.org/data/2.5/",
  base2: "http://api.openweathermap.org/geo/1.0/",
};
function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState("");

  const handleClick = () => {
    // console.log("Search Clicked");
    // fetch(`${api.base2}direct?q=${search}&limit=1&appid=${api.key}`)
    //   .then((res) => res.json())
    //   .then((location) => setLocation(location));
    // fetch(
    //   `${api.base}forecast?lat=${location[0].lat}&lon=${location[0].lon}&appid=${api.key}`
    // )
    //   .then((res) => res.json())
    //   .then((weather) => console.log(weather));
    if (search === "") {
      setWeather("");
      alert("Enter a city name.");
    } else {
      fetch(`${api.base}forecast?q=${search}&units=metric&APPID=${api.key}`)
        .then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
        })
        .then((result) => {
          setWeather(result);
        })
        .catch((error) => {
          // if (error.message === "Failed to fetch") {
          //   console.log(error.message);
          //   alert(
          //     "Could not fetch the data. \nMake sure you have an Internet Connection"
          //   );
          // } else {
          //   alert("City not Found.");
          // }
          alert(error.message);
          setWeather("");
        });
    }
    // console.log(location);
    // console.log(search);
  };
  function isEven(number) {
    if (number % 2 === 0) return true;
    return false;
  }
  return (
    <div>
      <div className="container bg-white text-center">
        <div>
          <h1 className=" text-primary m-5">Weather App</h1>
          <div className="input-group rounded overflow-hidden ">
            <input
              className="form-control "
              type="text"
              placeholder="Enter City"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <button
            className="btn rounded-top-right mt-4 mb-2 btn-primary "
            onClick={handleClick}>
            Search
          </button>
          {weather === "" ? (
            ""
          ) : (
            <div className="bg-white ">
              <p className="rounded bg-primary text-white  mt-3">
                {" "}
                Location : {weather === "" ? "----------" : weather.city.name}
              </p>
              <p className="rounded bg-primary text-white  mt-3">
                Temperature :{" "}
                {weather === "" ? "----------" : weather.list[0].main.temp}
              </p>
              <p className="rounded bg-primary text-white  mt-3">
                Humidity :{" "}
                {weather === "" ? "----------" : weather.list[0].main.humidity}
              </p>
              <p className="rounded bg-primary text-white  mt-3">
                Wind Speed :{" "}
                {weather === "" ? "----------" : weather.list[0].wind.speed}
              </p>
              <p className="rounded bg-primary text-white  mt-3">
                Weather Description :{" "}
                {weather === ""
                  ? "----------"
                  : weather.list[0].weather[0].description}
              </p>
            </div>
          )}
        </div>
        <div className="bg-primary">
          <table className="table ">
            {weather === "" ? (
              ""
            ) : (
              <thead>
                <tr>
                  <th className="text-primary">Date </th>
                  <th className="text-primary">Temp </th>
                  <th className="text-primary">Wind Speed </th>
                  <th className="text-primary">Humidity </th>
                  <th className="text-primary">Weather Description </th>
                </tr>
              </thead>
            )}
            <tbody>
              {weather === ""
                ? ""
                : weather.list.map((value, index) => {
                    if (index % 8 === 0) {
                      return (
                        <tr key={index}>
                          <td
                            className={
                              isEven(index / 8)
                                ? "text-white bg-primary"
                                : "text-primary"
                            }>
                            {value.dt_txt.slice(0, 10)}
                          </td>
                          <td
                            className={
                              isEven(index / 8)
                                ? "text-white bg-primary"
                                : "text-primary"
                            }>
                            {value.main.temp}
                          </td>
                          <td
                            className={
                              isEven(index / 8)
                                ? "text-white bg-primary"
                                : "text-primary"
                            }>
                            {value.wind.speed}
                          </td>
                          <td
                            className={
                              isEven(index / 8)
                                ? "text-white bg-primary"
                                : "text-primary"
                            }>
                            {value.main.humidity}
                          </td>
                          <td
                            className={
                              isEven(index / 8)
                                ? "text-white bg-primary"
                                : "text-primary"
                            }>
                            {value.weather[0].description}
                          </td>
                        </tr>
                      );
                    }
                  })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
