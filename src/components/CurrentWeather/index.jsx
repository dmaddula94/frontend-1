import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentWeather,
  getWeatherState,
  getDefinedState,
  toFahrenheit,
} from "../../utils/weather";
import { setWeather, setBackground } from "../../redux/reducers/weatherSlice";
import { startLoader, stopLoader } from "../../redux/reducers/loadingSlice";
import "./index.scss";

function CurrentWeather() {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location);
  const weather = useSelector((state) => state.weather);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (location.name && !weather?.current) {
      dispatch(startLoader());
      getCurrentWeather(location.name)
        .then((weather) => {
          dispatch(stopLoader());
          if (weather) {
            const temp = weather?.data?.values;
            temp.time = weather?.data?.time;
            console.log("STATE", getWeatherState(temp?.weatherCode));
            temp.weatherState = getWeatherState(temp?.weatherCode);
            temp.temperatureFahrenheit = Math.round(
              toFahrenheit(temp?.temperature)
            );

            dispatch(
              setWeather({
                current: temp,
              })
            );

            dispatch(
              setBackground({
                background: getDefinedState(temp?.weatherCode),
              })
            );
          }
        })
        .catch((err) => {
          dispatch(stopLoader());
          console.log(err);
        });
    }
  });

  return (
    <>
      {weather?.current && (
        <div className="glassbackground current-weather col-5">
          <h1>{`Hello, ${user?.user?.firstName}`}</h1>
          <h2>
            <span>{location.name}</span>{" - "}
            <span>{`${
              weather?.current?.temperatureFahrenheit
                ? weather?.current?.temperatureFahrenheit + "°F"
                : ""
            } `}</span>
          </h2>
          <h3>{weather?.current?.weatherState}</h3>
        </div>
      )}
    </>
  );
}

export default CurrentWeather;
