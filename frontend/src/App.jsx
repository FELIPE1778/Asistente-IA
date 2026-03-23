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
    <div style={estilos.pagina}>
      <div style={estilos.contenedor}>

        {/* Header */}
        <div style={estilos.encabezado}>
          <div style={estilos.encabezadoTop}>
            <span style={estilos.logo}>🤖</span>
            <h1 style={estilos.titulo}>Asistente IA</h1>
          </div>
          <div style={estilos.modos}>
            {MODOS.map(m => (
              <button
                key={m.id}
                onClick={() => cambiarModo(m.id)}
                style={{
                  ...estilos.botonModo,
                  backgroundColor: modo === m.id ? "white" : "transparent",
                  color: modo === m.id ? "#6366f1" : "white",
                  fontWeight: modo === m.id ? "700" : "400",
                  boxShadow: modo === m.id ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                }}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div style={estilos.chat}>
          {mensajes.length === 0 && (
            <div style={estilos.placeholderContenedor}>
              <span style={estilos.placeholderEmoji}>💬</span>
              <p style={estilos.placeholderTexto}>
                {modo === "chat" && "Escribe un mensaje para empezar..."}
                {modo === "resumir" && "Pega el texto que quieres resumir..."}
                {modo === "mejorar" && "Pega el texto que quieres mejorar..."}
                {modo === "traducir" && "Escribe el texto que quieres traducir..."}
              </p>
            </div>
          )}

          {mensajes.map((msg, i) => (
            <div key={i} style={{
              ...estilos.mensajeContenedor,
              justifyContent: msg.rol === "usuario" ? "flex-end" : "flex-start",
            }}>
              {msg.rol === "ia" && <span style={estilos.avatar}>🤖</span>}
              <div style={{
                ...estilos.mensaje,
                background: msg.rol === "usuario"
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "white",
                color: msg.rol === "usuario" ? "white" : "#1f2937",
                borderRadius: msg.rol === "usuario"
                  ? "18px 18px 4px 18px"
                  : "18px 18px 18px 4px",
                boxShadow: msg.rol === "usuario"
                  ? "0 4px 15px rgba(99, 102, 241, 0.4)"
                  : "0 2px 10px rgba(0,0,0,0.08)",
                border: msg.rol === "ia" ? "1px solid #e5e7eb" : "none",
              }}>
                {msg.texto}
              </div>
              {msg.rol === "usuario" && <span style={estilos.avatar}>👤</span>}
            </div>
          ))}

          {cargando && (
            <div style={{ ...estilos.mensajeContenedor, justifyContent: "flex-start" }}>
              <span style={estilos.avatar}>🤖</span>
              <div style={{
                ...estilos.mensaje,
                background: "white",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                borderRadius: "18px 18px 18px 4px",
                color: "#9ca3af",
              }}>
                Escribiendo...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={estilos.inputContenedor}>
          <input
            style={estilos.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={manejarTecla}
            placeholder="Escribe tu mensaje..."
          />
          <button
            style={{
              ...estilos.boton,
              opacity: input.trim() ? 1 : 0.6,
            }}
            onClick={enviarMensaje}
          >
            ➤
          </button>
        </div>

      </div>
    </div>
  )
}

const estilos = {
  pagina: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  contenedor: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "780px",
    height: "90vh",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(99, 102, 241, 0.15), 0 4px 20px rgba(0,0,0,0.1)",
    border: "1px solid rgba(99, 102, 241, 0.2)",
  },
  encabezado: {
    padding: "20px 24px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  encabezadoTop: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  logo: {
    fontSize: "28px",
  },
  titulo: {
    margin: 0,
    color: "white",
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  modos: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  botonModo: {
    padding: "6px 14px",
    border: "1.5px solid rgba(255,255,255,0.6)",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s",
  },
  chat: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    background: "#f8faff",
  },
  placeholderContenedor: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "12px",
    marginTop: "60px",
  },
  placeholderEmoji: {
    fontSize: "48px",
  },
  placeholderTexto: {
    color: "#9ca3af",
    fontSize: "15px",
    margin: 0,
  },
  mensajeContenedor: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  avatar: {
    fontSize: "22px",
    flexShrink: 0,
  },
  mensaje: {
    padding: "12px 16px",
    maxWidth: "70%",
    lineHeight: "1.6",
    fontSize: "15px",
  },
  inputContenedor: {
    display: "flex",
    padding: "16px 20px",
    background: "white",
    borderTop: "1px solid #e5e7eb",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    outline: "none",
    background: "#f9fafb",
    transition: "border 0.2s",
  },
  boton: {
    width: "44px",
    height: "44px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)",
  },
}

export default App