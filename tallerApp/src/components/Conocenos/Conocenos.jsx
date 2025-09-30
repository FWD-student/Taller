import React from 'react'
import './conocenos.css'

function Conocenos() {
  return (
    <div className="conocenosContainer">
      <div className="bannerConocenos">
        <h1>Sobre Nosotros</h1>
        <p>Más de 5 años cuidando tu moto como si fuera nuestra</p>
      </div>

      <div className="seccionContenido">
        <div className="bloqueInfo">
          <div className="textoInfo">
            <h2>Nuestra Historia</h2>
            <p>
              Taller JPL nació en el corazón de Puntarenas, Costa Rica, como un sueño familiar en el año 2019.
              Entre familiares compartiomos el amor por las motos y estamos apasionados por ellas desde siempre, decidimos convertir su
              garaje en un espacio donde pudieran ayudar a los motociclistas de la zona a mantener sus motos en
              perfecto estado.
            </p>
            <p>
              Lo que comenzó como un pequeño taller con herramientas básicas, hoy se ha convertido en un referente
              de confianza en la comunidad. Cada moto que entra por nuestra puerta es tratada con el mismo cariño
              y dedicación que tendríamos con la nuestra propia.
            </p>
          </div>
          <div className="imagenInfo">
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop" alt="Taller de motos" />
          </div>
        </div>

        <div className="bloqueInfo reverse">
          <div className="imagenInfo">
            <img src="https://images.unsplash.com/photo-1558981852-426c6c22a060?w=600&h=400&fit=crop" alt="Misión del taller" />
          </div>
          <div className="textoInfo">
            <h2>Nuestra Misión</h2>
            <p>
              Brindar servicios de mantenimiento y reparación de motocicletas con excelencia técnica, honestidad
              y calidez humana. Nos comprometemos a ofrecer soluciones efectivas y accesibles para que cada
              motociclista pueda rodar seguro por las carreteras de Costa Rica.
            </p>
            <p>
              Creemos que cada cliente es parte de nuestra familia, y trabajamos día a día para superar sus
              expectativas con un servicio personalizado, transparente y de calidad.
            </p>
          </div>
        </div>

        <div className="bloqueInfo">
          <div className="textoInfo">
            <h2>Nuestra Visión</h2>
            <p>
              Convertirnos en el taller de referencia en Puntarenas y la región Pacífico Central, reconocidos
              no solo por la calidad técnica de nuestros servicios, sino por el trato familiar y cercano que
              nos caracteriza.
            </p>
            <p>
              Aspiramos a seguir creciendo junto a nuestra comunidad de motociclistas, incorporando nuevas
              tecnologías y capacitación constante, sin perder nunca la esencia familiar que nos define y el
              compromiso con cada cliente que confía en nosotros.
            </p>
          </div>
          <div className="imagenInfo">
            <img src="https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=600&h=400&fit=crop" alt="Visión del taller" />
          </div>
        </div>
      </div>

      <div className="seccionValores">
        <h2>Nuestros Valores</h2>
        <div className="gridValores">
          <div className="cardValor">
            <div className="iconoValor">🔧</div>
            <h3>Excelencia</h3>
            <p>Cada trabajo es una oportunidad para demostrar nuestra pasión y conocimiento técnico</p>
          </div>
          <div className="cardValor">
            <div className="iconoValor">🤝</div>
            <h3>Honestidad</h3>
            <p>Transparencia total en diagnósticos, presupuestos y tiempos de entrega</p>
          </div>
          <div className="cardValor">
            <div className="iconoValor">👨‍👩‍👦</div>
            <h3>Familia</h3>
            <p>Tratamos a cada cliente como parte de nuestra familia motociclista</p>
          </div>
          <div className="cardValor">
            <div className="iconoValor">💚</div>
            <h3>Compromiso</h3>
            <p>Dedicación absoluta con la seguridad y satisfacción de nuestros clientes</p>
          </div>
        </div>
      </div>

      <div className="seccionEquipo">
        <h2>Nuestro Equipo</h2>
        <p className="descripcionEquipo">
          Somos un equipo pequeño pero apasionado, donde cada miembro aporta su experiencia y dedicación
          para garantizar el mejor servicio. Desde mecánicos certificados hasta asesores de servicio, todos
          compartimos el amor por las motos y el compromiso con nuestros clientes.
        </p>
        <div className="imagenEquipo">
          <img src="https://img.freepik.com/fotos-premium/equipo-mecanicos-expertos-accion-sobre-fondo-blanco_894067-17575.jpg" alt="Equipo del taller" />
        </div>
      </div>
    </div>
  )
}

export default Conocenos