import { Route, Redirect, useLocation } from "react-router-dom";
import { useSession } from "../contexts/AuthProvider";

export default function PrivateRoute({ children, ...rest }) {
  const { isAuthed } = useSession();
  const { pathname } = useLocation();

  return <Route {...rest}>{isAuthed ? children : <Redirect from={pathname} to="/" />}</Route>;
}
