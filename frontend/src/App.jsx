import {BrowserRouter, Routes, Navigate, Route} from "react-router-dom";
import {useAuth} from "./context/AuthContext";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./pages/ProjectDetails";

function App(){
  const {token} = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element= {token ? <Navigate to="/dashboard"/> : <Navigate to="/login"/>}/>
        <Route path="/login" element={token ? <Navigate to="/dashboard"/> : <LoginPage/>}/>
        <Route path="/dashboard" element={token ? <Dashboard/> : <Navigate to="/login"/>}/>
        <Route path ="/project/:id" element = {token? <ProjectDetails/>: <Navigate to ="/login"/>}/>
      </Routes>
    </BrowserRouter>
  );
}
export default App;