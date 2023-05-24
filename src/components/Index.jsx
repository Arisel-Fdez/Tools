import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase.js';
import TelegramWidget from './TelegramWidget';

function Index() {

    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // El usuario ha iniciado sesión
                setUserEmail(user.email);
            } else {
                // El usuario no ha iniciado sesión
                setUserEmail('');
            }
        });

        // Limpia el listener cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        const auth = getAuth();
        auth.signOut().then(() => {
            // Redirige al usuario a la página de inicio de sesión o a donde prefieras
            window.location.href = "/";
        }).catch((error) => {
            // Manejo de errores en caso de que ocurra alguno durante el deslogueo
            console.log(error);
        });
    };





    //parte de las card

    const [data1, setData1] = useState([]);

    useEffect(() => {
        const db = getDatabase(app);
        const dataRef = ref(db, 'sensortime'); // Ajusta la ruta según sea necesario

        // Leemos los datos de Firebase
        onValue(dataRef, (snapshot) => {
            // Actualizamos el estado con los nuevos datos
            setData1(snapshot.val());
        });
    }, []);



    const [data2, setData2] = useState({});
    const [error, setError] = useState('');

    const handleFormSubmit = (event) => {
        event.preventDefault();

        const searchDate = event.target.elements.searchDate.value;

        const db = getDatabase(app);
        const dataRef = ref(db, `sensorfecha/${searchDate}`);

        onValue(dataRef, (snapshot) => {
            const snapshotValue = snapshot.val();
            if (snapshotValue) {
                setData2(snapshotValue);
                setError('');
            } else {
                setData2({});
                setError('No se encontraron datos para la fecha seleccionada');
            }
        });
    };


    const [data, setData] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const dataRef = ref(db, 'sensortime');

        onValue(dataRef, (snapshot) => {
            const newData = snapshot.val();
            const newDataPoint = {
                temperature: parseFloat(newData.temperature),
                humidity: parseFloat(newData.humidity),
                voltage: parseFloat(newData.voltage),
                time: newData.time
            };
            setData(prevData => [...prevData, newDataPoint]);
        });
    }, []);

    const temperatureOptions = {
        title: {
            text: 'Temperature'
        },
        xAxis: {
            categories: data.map((item, index) => index)
        },
        series: [
            {
                name: 'Temperature',
                data: data.map(item => item.temperature)
            }
        ],
    };

    const humidityOptions = {
        title: {
            text: 'Humidity'
        },
        xAxis: {
            categories: data.map((item, index) => index)
        },
        series: [
            {
                name: 'Humidity',
                data: data.map(item => item.humidity)
            }
        ],
    };

    const voltageOptions = {
        title: {
            text: 'Voltage'
        },
        xAxis: {
            categories: data.map((item, index) => index)
        },
        series: [
            {
                name: 'Voltage',
                data: data.map(item => item.voltage)
            }
        ],
    };






    return (
        <div class="container-xxl w-100 mt-5 d-lg-block col-md-5 col-lg-7 col-xl-6 bg-light rounder shadow">
            <div class="container-xxl w-100 mt-5 d-lg-block col-md-5 col-lg-7 col-xl-6 bg-light rounder shadow">
                <nav class="navbar navbar-ligh bg-light">
                    <div class="container-fluid">
                        <a class="navbar-brand text-primary" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16">
                                <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z" />
                            </svg>
                            Fdez <small className="text-black">Dev</small>
                        </a>
                        <a class="navbar-brand text-primary" href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                            </svg>
                            <small className="text-black"> {data1.time}</small>
                        </a>
                        <div className="dropdown">
                            <button className="btn btn-outline-primary dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="24" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                                </svg>
                                {userEmail}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <li><button className="dropdown-item" onClick={handleLogout}><i class="bi bi-box-arrow-right"></i> Cerrar Sesión</button></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
            <div class="container-xxl w-100 mt-5 d-lg-block col-md-5 col-lg-7 col-xl-6 bg-light rounder shadow">
                <div class="row align-items-center">
                    <div class="col">
                        <div class="card bg-info" >
                            <div class="card-body">
                                <h5 class="card-title">Temperatura</h5>
                                <h1><i class="bi bi-thermometer-snow">{data1.temperature}</i> °C</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body bg-danger">
                                <h5 class="card-title">Humedad</h5>
                                <h1><i class="bi bi-droplet-half">{data1.humidity}</i> %</h1>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body bg-warning">
                                <h5 class="card-title">Voltage</h5>
                                <h1><i class="bi bi-lightning-charge-fill">{data1.voltage}</i> V</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-xxl w-100 mt-5 d-lg-block col-md-5 col-lg-7 col-xl-6 bg-light rounder shadow">
                <nav class="navbar navbar-light bg-light">
                    <div class="container-fluid">
                        <a class="navbar-brand"><TelegramWidget /></a>
                        {error && <p>{error}</p>}
                        <form onSubmit={handleFormSubmit}>
                            <input type="date" name="searchDate" />
                            <button class="btn btn-outline-success" type="submit"><i class="bi bi-search"></i> Buscar</button>
                        </form>

                    </div>
                </nav>
            </div>
            <div class="container-xxl w-100 mt-5 d-lg-block col-md-5 col-lg-7 col-xl-6 bg-light rounder shadow">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Temperatura</th>
                            <th scope="col">Humedad</th>
                            <th scope="col">Voltage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data2).map(([time, data]) => (
                            <tr key={time}>
                                <th scope="row">{data.time}</th>
                                <td class="table-primary">{data.temperature}</td>
                                <td class="table-danger">{data.humidity}</td>
                                <td class="table-warning">{data.voltage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            <div class="container-xxl w-100 mt-5 d-lg-block col-md-5 col-lg-7 col-xl-6 bg-light rounder shadow">
                <div class="row align-items-center">
                    <div class="col">
                        <div class="card" >
                            <div class="card-body bg-info">
                                <h5 class="card-title">Temperatura <i class="bi bi-thermometer-snow"></i></h5>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={temperatureOptions}
                                />
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body bg-danger">
                                <h5 class="card-title">Humedad <i class="bi bi-droplet-half"></i></h5>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={humidityOptions}
                                />

                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="card">
                            <div class="card-body bg-warning">
                                <h5 class="card-title">Voltage <i class="bi bi-lightning-charge-fill"></i></h5>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={voltageOptions}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Index;
