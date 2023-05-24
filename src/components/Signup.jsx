import React from "react";
import "../asset/style/Log_in.css";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase.js';
import { createUserWithEmailAndPassword } from "firebase/auth";

function Sign_up(){
    const navigator = useNavigate()
    const { handleSubmit, register, formState: { errors } } = useForm();

    const onSubmit = values => {
        console.log(values);
        const { email, password } = values;

        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            Swal.fire(
                'Bienvenido!',
                'Cuenta Creada con Exito',
                'success'
            )
            console.log(user);
            navigator('/');
        })
        .catch((error) => {
            Swal.fire(
                'Error!',
                '' + error.message,
                'error'
            )
        });
    }


    return(
        <div className="container w-75 mt-5 bg-light rounder shadow">
            <div className="row align-items-stretch">
                <div className="col bg d-none d-lg-block col-md-5 col-lg-7 col-xl-6 rounder">
                    
                </div>


                <div className="col p-5 rounder-end">
                    <div className="text-end">
                        <h2>Fdez</h2>
                        
                    </div>
                    <h2 className="fw-bold text-center py-5">Registrate</h2>

                    <form className="was-validated" noValidate onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                            <label  className="form-label">Escribe Tu Nombre</label>
                            <input type="text" className="form-control"  placeholder="name" required {...register("name",{
                                required: {
                                    value: true,
                                    message: "El campo requerido",
                                }
                            })}></input>
                            {errors.name && <span className="text-danger">{errors.name.message}</span>}
                        </div>
                        <div className="mb-4">
                            <label  className="form-label">Escribe Tu Correo</label>
                            <input type="text" className="form-control"  placeholder="Email" required {...register("email",{
                                required: {
                                    value: true,
                                    message: "El campo requerido",
                                },
                                pattern:{
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalido email"
                                }
                            })}></input>
                            {errors.email && <span className="text-danger">{errors.email.message}</span>}
                        </div>
                        <div className="mb-4">
                            <label  className="form-label">Escribe Tu Constraseña</label>
                            <input type="password" className="form-control"  placeholder="Password" required {...register("password",{
                                required: {
                                    value: true,
                                    message: "El campo requerido",
                                },
                                minLength:{
                                    value: 8,
                                    message: "La contraseña debe tener minimo 8 caracteres"
                                }
                            })}></input>
                            {errors.password && <span className="text-danger">{errors.password.message}</span>}
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary">Registrar</button>
                        </div>
                        <div className="my-3">
                            <span className="fw-bold">Tienes Cuenta? <a href="/">Login</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Sign_up;