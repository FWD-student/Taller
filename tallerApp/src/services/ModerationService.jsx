// Servicio de moderación de comentarios usando OpenAI API

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Modera un comentario usando la API de OpenAI
 * @param {string} comentario - El texto del comentario a moderar
 * @param {number} rating - La calificación del usuario (1-5 estrellas)
 * @returns {Promise<{aprobado: boolean, razon: string, sugerencia: string}>}
 */
async function moderarComentario(comentario, rating) {
  // Si no hay API key, aprobar automáticamente (modo desarrollo)
  if (!OPENAI_API_KEY) {
    return {
      aprobado: true,
      razon: 'Comentario aprobado',
      sugerencia: ''
    };
  }

  try {
    const prompt = `Eres un moderador de comentarios para un taller mecánico de motos.
Tu tarea es analizar si un comentario debe ser publicado o no.

CRITERIOS DE APROBACIÓN:
✓ Comentarios positivos genuinos
✓ Críticas constructivas que ayuden a mejorar el servicio
✓ Experiencias personales honestas
✓ Lenguaje respetuoso

CRITERIOS DE RECHAZO:
✗ Lenguaje ofensivo, vulgar o irrespetuoso
✗ Spam o publicidad
✗ Comentarios sin sentido o irrelevantes
✗ Ataques personales o difamación
✗ Información falsa intencionada

Comentario a analizar: "${comentario}"
Calificación del usuario: ${rating}/5 estrellas

Analiza el comentario y responde ÚNICAMENTE en formato JSON con esta estructura:
{
  "aprobado": true o false,
  "razon": "breve explicación de por qué se aprueba o rechaza",
  "sugerencia": "si se rechaza, sugiere cómo mejorar el comentario (deja vacío si se aprueba)"
}`;

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un moderador de contenido profesional y justo. Respondes únicamente en formato JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    if (!response.ok) {
      throw new Error(`Error en la API de OpenAI: ${response.status}`);
    }

    const data = await response.json();
    const respuestaIA = data.choices[0].message.content;

    // Parsear la respuesta JSON
    const resultado = JSON.parse(respuestaIA);

    return {
      aprobado: resultado.aprobado,
      razon: resultado.razon || '',
      sugerencia: resultado.sugerencia || ''
    };

  } catch (error) {
    console.error('Error al moderar comentario:', error);

    // En caso de error, aprobar el comentario por defecto
    // pero registrar el error para revisión manual
    return {
      aprobado: true,
      razon: 'Error en el servicio de moderación. Comentario pendiente de revisión manual.',
      sugerencia: ''
    };
  }
}

export default {
  moderarComentario
};