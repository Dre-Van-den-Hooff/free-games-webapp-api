import React from "react";
import "./css/App.scss";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Favourites from "./components/Favourites";
import Account from "./components/Account";
import AddGame from "./components/AddGame";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import { GamesProvider } from "./contexts/GamesProvider";
import { AuthProvider } from "./contexts/AuthProvider";
import { ThemeProvider, theme } from "@chakra-ui/react/";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GamesProvider>
          <Router>
            <Switch>
              <Route exact path="/" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route path="/home" component={Home} />
              <PrivateRoute path="/favourites" component={Favourites} />
              <PrivateRoute path="/account" component={Account} />
              <Route path="/addgame" component={AddGame} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Router>
        </GamesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
