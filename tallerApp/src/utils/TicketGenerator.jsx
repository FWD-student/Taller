import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const TicketGenerator = {
  async generarTicket(cita, usuario) {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Colores del diseño
      const colorPrimario = [231, 76, 60]; // #e74c3c
      const colorSecundario = [44, 62, 80]; // #2c3e50
      const colorTexto = [52, 73, 94]; // #34495e

      // Encabezado con fondo rojo
      doc.setFillColor(...colorPrimario);
      doc.rect(0, 0, 210, 40, 'F');

      // Logo/Título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.setFont(undefined, 'bold');
      doc.text('TALLER DE MOTOS', 105, 18, { align: 'center' });

      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text('Comprobante de Cita', 105, 28, { align: 'center' });

      // Línea decorativa
      doc.setDrawColor(...colorSecundario);
      doc.setLineWidth(0.5);
      doc.line(20, 45, 190, 45);

      // Código de confirmación destacado
      doc.setFillColor(236, 240, 241);
      doc.roundedRect(20, 50, 170, 20, 3, 3, 'F');

      doc.setTextColor(...colorSecundario);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('CÓDIGO DE CONFIRMACIÓN:', 25, 58);

      doc.setFontSize(16);
      doc.setTextColor(...colorPrimario);
      doc.text(cita.codigoConfirmacion, 105, 65, { align: 'center' });

      // Información del cliente
      let yPos = 80;
      doc.setFillColor(...colorSecundario);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('DATOS DEL CLIENTE', 25, yPos + 5.5);

      yPos += 13;
      doc.setTextColor(...colorTexto);
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');

      doc.setFont(undefined, 'bold');
      doc.text('Nombre:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(cita.nombre || 'No especificado', 60, yPos);

      yPos += 7;
      doc.setFont(undefined, 'bold');
      doc.text('Email:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(cita.email || 'No especificado', 60, yPos);

      yPos += 7;
      doc.setFont(undefined, 'bold');
      doc.text('Teléfono:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(cita.telefono || 'No especificado', 60, yPos);

      // Detalles del servicio
      yPos += 15;
      doc.setFillColor(...colorSecundario);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('DETALLES DEL SERVICIO', 25, yPos + 5.5);

      yPos += 13;
      doc.setTextColor(...colorTexto);
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');

      doc.setFont(undefined, 'bold');
      doc.text('Servicio:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(this.formatearServicio(cita.servicio), 60, yPos);

      yPos += 7;
      doc.setFont(undefined, 'bold');
      doc.text('Fecha:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(this.formatearFecha(cita.fecha), 60, yPos);

      yPos += 7;
      doc.setFont(undefined, 'bold');
      doc.text('Hora:', 25, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(this.formatearHora(cita.hora), 60, yPos);

      yPos += 7;
      doc.setFont(undefined, 'bold');
      doc.text('Estado:', 25, yPos);
      doc.setFont(undefined, 'normal');
      const estadoColor = this.obtenerColorEstado(cita.estado);
      doc.setTextColor(...estadoColor);
      doc.text(cita.estado.toUpperCase(), 60, yPos);

      // Mensaje adicional
      if (cita.mensaje) {
        yPos += 10;
        doc.setTextColor(...colorTexto);
        doc.setFont(undefined, 'bold');
        doc.text('Mensaje:', 25, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        const mensajeLineas = doc.splitTextToSize(cita.mensaje, 160);
        doc.text(mensajeLineas, 25, yPos);
        yPos += mensajeLineas.length * 5;
      }

      // Generar código QR
      yPos += 10;
      const qrDataUrl = await QRCode.toDataURL(
        `CITA-${cita.codigoConfirmacion}-${cita.email}`,
        { width: 200, margin: 1 }
      );

      doc.addImage(qrDataUrl, 'PNG', 75, yPos, 60, 60);

      yPos += 65;
      doc.setFontSize(9);
      doc.setTextColor(149, 165, 166);
      doc.text('Escanea el código QR para verificar tu cita', 105, yPos, { align: 'center' });

      // Información de contacto del taller
      yPos += 10;
      doc.setDrawColor(...colorPrimario);
      doc.setLineWidth(0.3);
      doc.line(20, yPos, 190, yPos);

      yPos += 8;
      doc.setFillColor(248, 249, 250);
      doc.roundedRect(20, yPos, 170, 25, 2, 2, 'F');

      doc.setTextColor(...colorSecundario);
      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('INFORMACIÓN DE CONTACTO', 105, yPos + 5, { align: 'center' });

      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.text('📧 luisblocon15@gmail.com', 105, yPos + 11, { align: 'center' });
      doc.text('📱 +506 6348-0444', 105, yPos + 16, { align: 'center' });
      doc.text('📞 2663 6363', 105, yPos + 21, { align: 'center' });

      // Pie de página
      yPos += 35;
      doc.setFontSize(8);
      doc.setTextColor(149, 165, 166);
      doc.text('Este es un comprobante generado automáticamente', 105, yPos, { align: 'center' });
      doc.text(`Generado el ${new Date().toLocaleString('es-ES')}`, 105, yPos + 4, { align: 'center' });

      // Guardar el PDF
      const nombreArchivo = `Ticket_Cita_${cita.codigoConfirmacion}_${new Date().getTime()}.pdf`;
      doc.save(nombreArchivo);

      return true;
    } catch (error) {
      console.error('Error al generar ticket:', error);
      throw error;
    }
  },

  formatearFecha(fecha) {
    if (!fecha) return 'No especificada';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return fecha;
    }
  },

  formatearHora(hora) {
    if (!hora) return 'No especificada';
    try {
      const [horas, minutos] = hora.split(':');
      const horaNum = parseInt(horas);
      const ampm = horaNum >= 12 ? 'PM' : 'AM';
      const hora12 = horaNum > 12 ? horaNum - 12 : horaNum === 0 ? 12 : horaNum;
      return `${hora12}:${minutos} ${ampm}`;
    } catch {
      return hora;
    }
  },

  formatearServicio(servicio) {
    if (!servicio) return 'No especificado';
    const servicios = {
      'mantenimiento': 'Mantenimiento General',
      'revision': 'Revisión Técnica',
      'reparacion': 'Reparación',
      'cambio_aceite': 'Cambio de Aceite',
      'diagnostico': 'Diagnóstico',
      'emergencia': 'Emergencia'
    };
    return servicios[servicio] || servicio;
  },

  obtenerColorEstado(estado) {
    const colores = {
      'pendiente': [243, 156, 18],
      'confirmada': [52, 152, 219],
      'completada': [39, 174, 96],
      'finalizada': [39, 174, 96],
      'cancelada': [231, 76, 60]
    };
    return colores[estado] || [149, 165, 166];
  }
};

export default TicketGenerator;