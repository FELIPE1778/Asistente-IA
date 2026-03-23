import { useState } from "react"

const MODOS = [
  { id: "chat", emoji: "💬", label: "Chat libre" },
  { id: "resumir", emoji: "📝", label: "Resumir" },
  { id: "mejorar", emoji: "✨", label: "Mejorar texto" },
  { id: "traducir", emoji: "🌍", label: "Traducir" },
]

function App() {
  const [mensajes, setMensajes] = useState([])
  const [input, setInput] = useState("")
  const [cargando, setCargando] = useState(false)
  const [modo, setModo] = useState("chat")

  const enviarMensaje = async () => {
    if (!input.trim()) return

    const nuevoMensaje = { rol: "usuario", texto: input }
    const nuevosMensajes = [...mensajes, nuevoMensaje]
    setMensajes(nuevosMensajes)
    setInput("")
    setCargando(true)

    const respuesta = await fetch("https://asistente-ia-d9db.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensajes: nuevosMensajes, modo })
    })

    const data = await respuesta.json()
    const mensajeIA = { rol: "ia", texto: data.respuesta }
    setMensajes(prev => [...prev, mensajeIA])
    setCargando(false)
  }

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setMensajes([])
  }

  const manejarTecla = (e) => {
    if (e.key === "Enter") enviarMensaje()
  }

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.encabezado}>
        <h1 style={estilos.titulo}>🤖 Asistente IA</h1>
        <div style={estilos.modos}>
          {MODOS.map(m => (
            <button
              key={m.id}
              onClick={() => cambiarModo(m.id)}
              style={{
                ...estilos.botonModo,
                backgroundColor: modo === m.id ? "white" : "transparent",
                color: modo === m.id ? "#4f46e5" : "white",
              }}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div style={estilos.chat}>
        {mensajes.length === 0 && (
          <p style={estilos.placeholder}>
            {modo === "chat" && "Escribe un mensaje para empezar..."}
            {modo === "resumir" && "Pega el texto que quieres resumir..."}
            {modo === "mejorar" && "Pega el texto que quieres mejorar..."}
            {modo === "traducir" && "Escribe o pega el texto que quieres traducir..."}
          </p>
        )}
        {mensajes.map((msg, i) => (
          <div key={i} style={{
            ...estilos.mensaje,
            alignSelf: msg.rol === "usuario" ? "flex-end" : "flex-start",
            backgroundColor: msg.rol === "usuario" ? "#4f46e5" : "#f3f4f6",
            color: msg.rol === "usuario" ? "white" : "black",
          }}>
            {msg.texto}
          </div>
        ))}
        {cargando && (
          <div style={{ ...estilos.mensaje, alignSelf: "flex-start", backgroundColor: "#f3f4f6" }}>
            Escribiendo...
          </div>
        )}
      </div>

      <div style={estilos.inputContenedor}>
        <input
          style={estilos.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={manejarTecla}
          placeholder="Escribe tu mensaje..."
        />
        <button style={estilos.boton} onClick={enviarMensaje}>
          Enviar
        </button>
      </div>
    </div>
  )
}

const estilos = {
  contenedor: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  encabezado: {
    padding: "16px",
    backgroundColor: "#4f46e5",
  },
  titulo: {
    margin: "0 0 12px 0",
    color: "white",
    fontSize: "20px",
  },
  modos: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  botonModo: {
    padding: "6px 14px",
    border: "1px solid white",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
  },
  chat: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  placeholder: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "40px",
  },
  mensaje: {
    padding: "12px 16px",
    borderRadius: "12px",
    maxWidth: "70%",
    lineHeight: "1.5",
  },
  inputContenedor: {
    display: "flex",
    padding: "16px",
    borderTop: "1px solid #e5e7eb",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "16px",
    outline: "none",
  },
  boton: {
    padding: "12px 24px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
}

export default App