import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../firebase.js';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Recoverpass from './Recoverpass.jsx';
import Index from "./Index.jsx";
import NotFound from "./NotFound.jsx";

function App() {
    const [user, loading] = useAuthState(auth);

    const PrivateRoute = ({ element, path }) => {
        if (!loading) {
            if (user) {
                return element;
            } else {
                return <Navigate to="/" />;
            }
        }
        // Muestra un estado de carga mientras se verifica la autenticación
        return <div>Cargando...</div>;
    };

    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Recoverpass" element={<Recoverpass />} />
                <Route
                    path="/Index"
                    element={<PrivateRoute element={<Index />} />}
                />
                <Route path="/*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
