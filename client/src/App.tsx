import { Route } from "wouter";
import Home from "./Home";
import Countdown from "./Countdown";

function App() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        flexDirection: "column",
      }}
    >
      <Route path="/">
        <Home />
      </Route>
      <Route path="/countdown">
        <Countdown />
      </Route>
    </div>
  );
}

export default App;
