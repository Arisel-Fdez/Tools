import { Routes, Route} from "react-router-dom";
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Recoverpass from './Recoverpass.jsx';
import Index from "./Index.jsx";
import NotFound from "./NotFound.jsx";

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/Signup" element={<Signup/>} />
                <Route path="/Recoverpass" element={<Recoverpass/>} />
                <Route path="/Index" element={<Index/>} />
                <Route path="/*" element={<NotFound/>} />
            </Routes>
        </div>
    );
}

export default App;