import './App.css';
import {createBrowserRouter, RouterProvider, createRoutesFromElements, Route} from 'react-router-dom';

import ContextsWrapper from "./contexts/ContextsWrapper";
import AuthLayout from "./components/layouts/authLayout/AuthLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Clients from "./pages/clients/Clients";
import {routes} from "./routes/routes";
import DefaultLayout from "./components/layouts/defaultLayout/DefaultLayout";
import Login from "./pages/login/Login";
import Vehicles from './pages/vehicles/Vehicles';
import Reservations from './pages/reservations/Reservations';
import AddReservation from './pages/addReservation/AddReservation';
import Forbidden from './pages/forbidden/Forbidden';

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<ContextsWrapper><AuthLayout/></ContextsWrapper>}>
          <Route path='forbidden' element={<Forbidden/>}/>
          <Route index element={<Dashboard/>}/>
          <Route path={routes.CLIENTS.path} element={<Clients/>}/>
          <Route path={routes.VEHICLES.path} element={<Vehicles/>}/>
          <Route path={routes.RESERVATIONS.path} element={<Reservations/>}/>
          <Route path={routes.RESERVATIONS.addPath} element={<AddReservation/>}/>
        </Route>
        <Route path="/auth" element={<ContextsWrapper><DefaultLayout/></ContextsWrapper>}>
          <Route path="login" element={<Login/>}/>
        </Route>
        </>
    ))

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
