const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY || '';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const EMAIL_REMITENTE = import.meta.env.VITE_EMAIL_REMITENTE || 'noreply@tallerjpl.com';
const NOMBRE_REMITENTE = 'Taller JPL';

async function enviarEmail(destinatario, asunto, htmlContent) {
  if (!BREVO_API_KEY) {
    console.warn('Brevo API Key no configurada. Email no enviado.');
    return { success: false, message: 'API Key no configurada' };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: NOMBRE_REMITENTE,
          email: EMAIL_REMITENTE
        },
        to: [
          {
            email: destinatario,
            name: destinatario
          }
        ],
        subject: asunto,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      throw new Error(`Error al enviar email: ${response.status}`);
    }

    return { success: true, message: 'Email enviado correctamente' };
  } catch (error) {
    console.error('Error al enviar email:', error);
    return { success: false, message: error.message };
  }
}

function emailConfirmacionCita(cita, usuario) {
  const asunto = `Confirmación de Cita - Taller JPL`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; color: #e74c3c; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #e74c3c; }
        .codigo { background: #e74c3c; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
        .btn { background: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Taller JPL</h1>
          <p>Confirmación de Cita</p>
        </div>
        <div class="content">
          <p>Hola <strong>${cita.nombre}</strong>,</p>
          <p>Tu cita ha sido agendada exitosamente. A continuación los detalles:</p>

          <div class="info-box">
            <p><strong>Servicio:</strong> ${cita.servicio}</p>
            <p><strong>Fecha:</strong> ${cita.fecha || 'Por confirmar'}</p>
            <p><strong>Hora:</strong> ${cita.hora || 'Por confirmar'}</p>
            <p><strong>Teléfono:</strong> ${cita.telefono}</p>
            ${cita.mensaje ? `<p><strong>Mensaje:</strong> ${cita.mensaje}</p>` : ''}
          </div>

          <p><strong>Código de Confirmación:</strong></p>
          <div class="codigo">${cita.codigoConfirmacion}</div>

          <p>Guarda este código para cualquier consulta o cambio en tu cita.</p>

          <p>Si necesitas modificar o cancelar tu cita, contáctanos.</p>
        </div>
        <div class="footer">
          <p>Taller JPL - Puntarenas, Costa Rica</p>
          <p>¿Necesitas ayuda? Contáctanos</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return enviarEmail(cita.email, asunto, html);
}

function emailRegistroUsuario(usuario, passwordTemporal = null) {
  const asunto = `Bienvenido a Taller JPL`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; color: #e74c3c; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #27ae60; }
        .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
        .destacado { background: #fff3cd; padding: 10px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Taller JPL</h1>
          <p>Bienvenido a nuestra familia motociclista</p>
        </div>
        <div class="content">
          <p>Hola <strong>${usuario.nombre}</strong>,</p>
          <p>Tu cuenta ha sido creada exitosamente en Taller JPL.</p>

          <div class="info-box">
            <p><strong>Nombre:</strong> ${usuario.nombre}</p>
            <p><strong>Email:</strong> ${usuario.email}</p>
            <p><strong>Teléfono:</strong> ${usuario.telefono}</p>
            <p><strong>Cédula:</strong> ${usuario.cedula}</p>
          </div>

          ${passwordTemporal ? `
            <div class="destacado">
              <p><strong>Contraseña temporal:</strong> ${passwordTemporal}</p>
              <p style="font-size: 14px; color: #856404;">Por favor, cambia tu contraseña al iniciar sesión.</p>
            </div>
          ` : ''}

          <p>Ahora puedes:</p>
          <ul>
            <li>Agendar citas para el mantenimiento de tu moto</li>
            <li>Ver el historial de tus servicios</li>
            <li>Descargar tickets de tus citas</li>
            <li>Dejar comentarios sobre nuestros servicios</li>
          </ul>

          <p>Gracias por confiar en nosotros para el cuidado de tu motocicleta.</p>
        </div>
        <div class="footer">
          <p>Taller JPL - Puntarenas, Costa Rica</p>
          <p>Más de 15 años cuidando tu moto</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return enviarEmail(usuario.email, asunto, html);
}

function emailCambioEstadoCita(cita, nuevoEstado) {
  const estadoTexto = {
    pendiente: 'Pendiente',
    completada: 'Completada',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada'
  };

  const asunto = `Actualización de Cita - ${estadoTexto[nuevoEstado]}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; color: #e74c3c; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #f39c12; }
        .estado { padding: 10px 20px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 6px; margin: 20px 0; }
        .estado.completada { background: #27ae60; color: white; }
        .estado.finalizada { background: #8e44ad; color: white; }
        .estado.pendiente { background: #f39c12; color: white; }
        .estado.cancelada { background: #e74c3c; color: white; }
        .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Taller JPL</h1>
          <p>Actualización de Estado</p>
        </div>
        <div class="content">
          <p>Hola <strong>${cita.nombre}</strong>,</p>
          <p>El estado de tu cita ha sido actualizado:</p>

          <div class="estado ${nuevoEstado}">${estadoTexto[nuevoEstado]}</div>

          <div class="info-box">
            <p><strong>Código de Confirmación:</strong> ${cita.codigoConfirmacion}</p>
            <p><strong>Servicio:</strong> ${cita.servicio}</p>
            <p><strong>Fecha:</strong> ${cita.fecha || 'Por confirmar'}</p>
          </div>

          ${nuevoEstado === 'completada' || nuevoEstado === 'finalizada' ? `
            <p>Tu servicio ha sido completado. Gracias por confiar en nosotros.</p>
            <p>Puedes dejarnos un comentario sobre tu experiencia.</p>
          ` : ''}

          ${nuevoEstado === 'cancelada' ? `
            <p>Tu cita ha sido cancelada. Si tienes alguna pregunta, contáctanos.</p>
          ` : ''}
        </div>
        <div class="footer">
          <p>Taller JPL - Puntarenas, Costa Rica</p>
          <p>¿Necesitas ayuda? Contáctanos</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return enviarEmail(cita.email, asunto, html);
}

function emailRecordatorioCita(cita) {
  const asunto = `Recordatorio de Cita - Taller JPL`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; color: #e74c3c; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; border-left: 4px solid #3498db; }
        .recordatorio { background: #3498db; color: white; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Taller JPL</h1>
          <p>Recordatorio de Cita</p>
        </div>
        <div class="content">
          <p>Hola <strong>${cita.nombre}</strong>,</p>

          <div class="recordatorio">Tu cita es próximamente</div>

          <p>Te recordamos que tienes una cita agendada con nosotros:</p>

          <div class="info-box">
            <p><strong>Servicio:</strong> ${cita.servicio}</p>
            <p><strong>Fecha:</strong> ${cita.fecha}</p>
            <p><strong>Hora:</strong> ${cita.hora || 'Por confirmar'}</p>
            <p><strong>Código:</strong> ${cita.codigoConfirmacion}</p>
          </div>

          <p>Te esperamos en nuestro taller. Si necesitas reprogramar, contáctanos con anticipación.</p>

          <p><strong>Recomendaciones:</strong></p>
          <ul>
            <li>Llega 10 minutos antes de tu cita</li>
            <li>Trae tu moto con el tanque lleno</li>
            <li>Menciona tu código de confirmación</li>
          </ul>
        </div>
        <div class="footer">
          <p>Taller JPL - Puntarenas, Costa Rica</p>
          <p>Ubicación: [Dirección del taller]</p>
          <p>Teléfono: [Teléfono del taller]</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return enviarEmail(cita.email, asunto, html);
}

function emailCodigoVerificacion(email, codigo, nombre) {
  const asunto = `Código de Verificación - Taller JPL`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2c3e50; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; color: #e74c3c; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .codigo { background: #3498db; color: white; padding: 20px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 8px; border-radius: 8px; margin: 25px 0; }
        .footer { text-align: center; padding: 20px; color: #7f8c8d; font-size: 14px; }
        .importante { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Taller JPL</h1>
          <p>Verificación de Correo Electrónico</p>
        </div>
        <div class="content">
          <p>Hola <strong>${nombre}</strong>,</p>
          <p>Gracias por registrarte en Taller JPL. Para completar tu registro, necesitamos verificar tu correo electrónico.</p>

          <p style="text-align: center; margin: 25px 0; font-size: 16px;">
            <strong>Tu código de verificación es:</strong>
          </p>

          <div class="codigo">${codigo}</div>

          <p style="text-align: center;">Ingresa este código en la página de registro para continuar.</p>

          <div class="importante">
            <p style="margin: 0;"><strong>Importante:</strong></p>
            <p style="margin: 5px 0 0 0;">Este código expira en 10 minutos. Si no solicitaste este registro, ignora este mensaje.</p>
          </div>
        </div>
        <div class="footer">
          <p>Taller JPL - Puntarenas, Costa Rica</p>
          <p>Este es un mensaje automático, por favor no respondas a este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return enviarEmail(email, asunto, html);
}

export default {
  emailConfirmacionCita,
  emailRegistroUsuario,
  emailCambioEstadoCita,
  emailRecordatorioCita,
  emailCodigoVerificacion
};