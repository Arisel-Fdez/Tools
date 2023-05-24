import React from "react";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase.js';
import "../asset/style/Recover_pass.css";

function Recover_pass() {
  const { handleSubmit, register, formState: { errors } } = useForm();

  const onSubmit = values => {
    const { email } = values;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log(`Password reset email sent to ${email}`);
        Swal.fire(
          'Enviado!',
          'Por favor revisa tu email para restablecer tu contraseña.',
          'success'
        )
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
        Swal.fire(
          'Error!',
          '' + error.message,
          'error'
        )
      });
  }

  return (
    <div className="container w-75 mt-5 bg-light rounder shadow">
      <div className="row align-items-stretch">
        <div className="col bg1 d-none d-lg-block col-md-5 col-lg-10 col-xl-6 rounder">

        </div>


        <div className="col p-5 rounder-end">
          <div className="text-end">
            <h2>Fdez</h2>
          </div>
          <h2 className="fw-bold text-center py-5">Recuperar Password</h2>
          <p>Te enviaremos un correo para poder restablecer tu nueva Contraseña</p>
          <form className="was-validated" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="form-label">Escribe Tu Correo</label>
              <input type="text" className="form-control" placeholder="Email" required  {...register("email", {
                required: {
                  value: true,
                  message: "El campo requerido",
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalido email"
                }
              })}></input>
              {errors.email && <span className="text-danger">{errors.email.message}</span>}
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Restablecer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Recover_pass;