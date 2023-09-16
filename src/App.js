import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

const api = {
  key: "9af52dfa5cf1961a935773ba14520c71",
  base: "https://api.openweathermap.org/data/2.5/",
};
const locationApi =
  "https://ipapi.co/json?access_key=8e18f8d8f1da438b5dec2dec2d60c839";

function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [modalVisibility, setModalVisibility] = useState([]);

  const openModal = (index, date, data) => {
    setSelectedDate(date);

    setSelectedData(data);
    const updatedModalVisibility = [...modalVisibility];
    updatedModalVisibility[index] = true; // Open the modal at the specified index
    setModalVisibility(updatedModalVisibility);
  };

  const closeModal = () => {
    const updatedModalVisibility = new Array(modalVisibility.length).fill(
      false
    ); // Close all modals
    setModalVisibility(updatedModalVisibility);
  };
  useEffect(() => {
    // Initialize modal visibility array based on the number of items in the list
    if (weather.list) {
      setModalVisibility(new Array(weather.list.length).fill(false));
    }
  }, [weather]);

  useEffect(() => {
    if (localStorage.getItem("locationObj") !== null) {
      fetch(locationApi)
        .then((response) => {
          if (response.status >= 200 && response.status <= 299) {
            return response.json();
          } else {
            throw Error(response.statusText);
          }
        })
        .then((result) => {
          const temp = JSON.parse(localStorage.getItem("weatherObj"));
          if (result.city === temp.city.name) {
            setWeather(temp);
          } else {
            alert("Object in Local Storage is not accurate");
          }
        })
        .catch((ex) => {
          alert(
            ex +
              " during useEffect Fetch.\n(Getting last object from the local storage.)"
          );
          setWeather(JSON.parse(localStorage.getItem("weatherObj")));
        });
    } else if (
      localStorage.getItem("locationObj") === null &&
      localStorage.getItem("weatherObj") !== null
    ) {
      setWeather(JSON.parse(localStorage.getItem("weatherObj")));
    }
  }, [search]);

  const shiftString = (string) => {
    const original = string.split("").reverse();
    let clone = [];
    clone[0] = original[1];
    clone[1] = original[0];
    clone[2] = original[2];
    clone[3] = original[4];
    clone[4] = original[3];
    clone[5] = original[5];
    clone[6] = original[9];
    clone[7] = original[8];
    clone[8] = original[7];
    clone[9] = original[6];

    clone.join();
    return clone;
  };

  const handleClick = () => {
    localStorage.removeItem("locationObj");
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
          localStorage.setItem("weatherObj", JSON.stringify(result));
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

          if (localStorage.getItem("weatherObj")) {
            alert(error + "\n Setting last object from local storage");
            const temp = JSON.parse(localStorage.getItem("weatherObj"));
            if (temp.city === search) {
              setWeather(temp);
            } else {
              alert(`No Object with city ${search} found`);
              setWeather("");
            }
          } else {
            alert(error.message);
            setWeather("");
          }
        });
    }
    // console.log(weather);
    // console.log(JSON.parse(localStorage.getItem("weatherObj")));
    // console.log(search);
  };
  // const handleLocation = () => {
  //   navigator.geolocation.getCurrentPosition(
  //     (success) => {
  //       fetch(
  //         `${api.base}forecast?lat=${success.coords.latitude}&lon=${success.coords.longitude}&appid=${api.key}`
  //       )
  //         .then((response) => {
  //           if (response.status >= 200 && response.status <= 299) {
  //             return response.json();
  //           } else {
  //             throw Error(response.statusText);
  //           }
  //         })
  //         .catch((ex) => {
  //           alert(ex);
  //         })
  //         .then((weather) => {
  //           setWeather(weather);
  //           console.log(weather);
  //         });
  //     },
  //     (error) => {
  //       alert(error);
  //     }
  //   );
  // };
  const handleClear = () => {
    if (weather === "") {
      alert("Already Cleared.");
    } else {
      setWeather("");
      localStorage.removeItem("weatherObj");
      localStorage.removeItem("locationObj");
    }
  };
  const handleLocation = () => {
    fetch(locationApi)
      .then((response) => {
        if (response.status >= 200 && response.status <= 299) {
          return response.json();
        } else {
          throw Error(response.statusText);
        }
      })
      .then((result) => {
        localStorage.setItem("locationObj", JSON.stringify(result));
        fetch(
          `${api.base}forecast?q=${result.city}&units=metric&APPID=${api.key}`
        )
          .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
              return response.json();
            } else {
              throw Error(response.statusText);
            }
          })
          .then((result) => {
            localStorage.setItem("weatherObj", JSON.stringify(result));
            setWeather(result);
          })
          .catch((ex) => {
            alert(ex + "\n(While fetching Forcast through Location)");
          });
      })
      .catch((ex) => {
        if (localStorage.getItem("locationObj") !== null) {
          alert(
            ex +
              "\n(While Fetching Location) \nLoading previous object from local storage."
          );
          setWeather(JSON.parse(localStorage.getItem("weatherObj")));
        } else {
          alert(
            ex +
              "\n(While Fetching Location)\nNo object present in local storage as well"
          );
          setWeather("");
        }
      });
  };
  function isEven(number) {
    if (number % 2 === 0) return true;
    return false;
  }
  return (
    <div>
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
            <div className="mt-5">
              <button
                className="col-4 btn rounded m-1 btn-primary "
                onClick={handleClick}>
                Search
              </button>
              <button
                className={
                  weather === ""
                    ? "col-3 btn btn-danger m-1 disabled"
                    : "col-3 btn btn-danger m-1 "
                }
                onClick={handleClear}>
                Clear
              </button>
              <button
                className="col-4 btn btn-primary  m-1 rounded "
                onClick={handleLocation}>
                Current Location
              </button>
            </div>
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
                  {weather === "" ? "----------" : weather.list[0].main.temp} 'C
                </p>
                <p className="rounded bg-primary text-white  mt-3">
                  Humidity :{" "}
                  {weather === ""
                    ? "----------"
                    : weather.list[0].main.humidity}{" "}
                  %
                </p>
                <p className="rounded bg-primary text-white  mt-3">
                  Wind Speed :{" "}
                  {weather === "" ? "----------" : weather.list[0].wind.speed}{" "}
                  m/s
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
          <div className="mt-5">
            <table className="table ">
              {weather === "" ? (
                ""
              ) : (
                <thead>
                  <tr>
                    <th className="text-primary">
                      <u>
                        <b>Date</b>
                      </u>{" "}
                    </th>
                    <th className="text-primary">
                      <u>
                        <b>Temp</b>
                      </u>{" "}
                    </th>
                    <th className="text-primary">
                      <u>
                        <b>Wind Speed</b>
                      </u>{" "}
                    </th>
                    <th className="text-primary">
                      <u>
                        <b>Humidity</b>
                      </u>{" "}
                    </th>
                    <th className="text-primary">
                      <u>
                        <b>Weather Description</b>
                      </u>{" "}
                    </th>
                  </tr>
                </thead>
              )}
              <tbody>
                {weather === ""
                  ? ""
                  : weather.list.map((value, index) => {
                      if (index % 8 === 0) {
                        const date = shiftString(value.dt_txt.slice(0, 10));
                        return (
                          <tr key={index}>
                            <td
                              className={
                                isEven(index / 8) ? " bg-primary" : ""
                              }>
                              <button
                                onClick={() => {
                                  openModal(index, date, value);
                                }}
                                style={{ border: 0 }}
                                className={
                                  isEven(index / 8)
                                    ? " bg-primary text-white"
                                    : " bg-white text-primary"
                                }>
                                {date}
                              </button>
                            </td>
                            <td
                              className={
                                isEven(index / 8)
                                  ? "text-white bg-primary"
                                  : "text-primary"
                              }>
                              {value.main.temp} 'C
                            </td>
                            <td
                              className={
                                isEven(index / 8)
                                  ? "text-white bg-primary"
                                  : "text-primary"
                              }>
                              {value.wind.speed} m/s
                            </td>
                            <td
                              className={
                                isEven(index / 8)
                                  ? "text-white bg-primary"
                                  : "text-primary"
                              }>
                              {value.main.humidity} %
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
              {modalVisibility.map((isVisible, index) => (
                <Modal
                  key={index}
                  show={isVisible}
                  onHide={closeModal}
                  centered>
                  <Modal.Header className="bg-black text-white" closeButton>
                    <Modal.Title>{selectedDate}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ul className="list-group">
                      <li className="list-group-item bg-secondary text-white">
                        <b>Temp: </b>
                        {selectedData !== "" ? selectedData.main.temp : ""} 'C
                      </li>
                      <li className="list-group-item">
                        <b>Today feels Like: </b>
                        {selectedData !== ""
                          ? selectedData.main.feels_like
                          : ""}
                        'C
                      </li>
                      <li className="list-group-item bg-secondary text-white">
                        <b>Minimum Temperature: </b>
                        {selectedData !== ""
                          ? selectedData.main.temp_min
                          : ""}{" "}
                        'C
                      </li>
                      <li className="list-group-item ">
                        <b>Maximum Temperature: </b>
                        {selectedData !== ""
                          ? selectedData.main.temp_max
                          : ""}{" "}
                        'C
                      </li>
                      <li className="list-group-item bg-secondary text-white">
                        <b>Pressure: </b>
                        {selectedData !== ""
                          ? selectedData.main.pressure
                          : ""}{" "}
                        hPa
                      </li>
                      <li className="list-group-item">
                        <b>SeaLevel: </b>
                        {selectedData !== ""
                          ? selectedData.main.sea_level
                          : ""}{" "}
                        m
                      </li>
                      <li className="list-group-item bg-secondary text-white">
                        <b>Humidity: </b>
                        {selectedData !== ""
                          ? selectedData.main.humidity
                          : ""}{" "}
                        %
                      </li>
                      <li className="list-group-item">
                        <b>Ground Level: </b>
                        {selectedData !== ""
                          ? selectedData.main.grnd_level
                          : ""}{" "}
                        m
                      </li>
                      <li className="list-group-item bg-secondary text-white">
                        <b>Weather Description: </b>{" "}
                        {selectedData !== ""
                          ? selectedData.weather[0].description
                          : ""}{" "}
                      </li>
                      <li className="list-group-item ">
                        <b>Wind Speed: </b>
                        {selectedData !== "" ? selectedData.wind.speed : ""} m/s
                      </li>
                      <li className="list-group-item bg-secondary text-white">
                        <b>Wind Direction: </b>
                        {selectedData !== "" ? selectedData.wind.deg : ""} deg
                      </li>
                      <li className="list-group-item">
                        <b>Wind Gust: </b>
                        {selectedData !== "" ? selectedData.wind.gust : ""} m/s
                      </li>
                    </ul>
                  </Modal.Body>
                  <Modal.Footer>
                    <button className="btn btn-dark" onClick={closeModal}>
                      Close
                    </button>
                  </Modal.Footer>
                </Modal>
              ))}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
