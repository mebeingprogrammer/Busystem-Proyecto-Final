// App.js
import React from "react";
import BusManager from "./components/BusManager";
import RouteManager from "./components/RouteManager";
import ScheduleManager from "./components/ScheduleManager";
import ReservationManager from "./components/ReservationManager";  

function App() {
  return (
    <div>
      <BusManager />
      <RouteManager />
      <ScheduleManager />
      <ReservationManager />
    </div>
  );
}

export default App;
