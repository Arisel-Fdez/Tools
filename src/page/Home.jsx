import { BrowserRouter } from "react-router-dom";
import App from "../components/App";

function Home() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

export default Home;