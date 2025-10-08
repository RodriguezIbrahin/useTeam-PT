# 🧩 N8N – Setup Instructions

## 📋 Descripción

Este flujo de trabajo (`workflow.json`) automatiza la **exportación del backlog** del tablero Kanban.  
Cuando el backend (NestJS) llama al webhook de N8N, el flujo:

1. Recibe la data del tablero (tareas y columnas).
2. Genera un archivo CSV con los campos requeridos.
3. Envía un email con el CSV adjunto a la(s) dirección(es) configurada(s) (en pruebas se recomienda usar Mailtrap).

## ⚙️ Requisitos previos

- Docker y Docker Compose instalados localmente.
- `docker-compose.yml` en la raíz del repo (incluye servicio `n8n`) o una instancia de n8n accesible.
- Archivo `n8n/workflow.json` (export del flujo) en la carpeta `n8n/`.
- Cuenta en [Mailtrap.io](https://mailtrap.io) para pruebas SMTP (recomendado).

---

## 🚀 Pasos de Configuración

Si usás Docker Compose (recomendado), desde la raíz del proyecto ejecutá:

```bash
docker-compose up -d n8n
```

Esto iniciará el contenedor de n8n. La interfaz quedará disponible en:

http://localhost:5678

Nota de red en Docker: si tu backend también se ejecuta en Docker en la misma red/compose, el backend debería usar la URL interna:

http://n8n:5678

Para ejecuciones locales (sin Docker) usarás http://localhost:5678.

## 🚀 Pasos de Configuración — 2) Importar el workflow y 3) Revisar Webhook (PARTE 4/6)

### 2) Importar el flujo de trabajo

1. Abrí `http://localhost:5678` en el navegador.
2. Iniciá sesión o creá una cuenta si es la primera vez.
3. En la UI de n8n: **Import → From File**.
4. Elegí `n8n/workflow.json` desde la carpeta del repo.
5. Guardá el workflow importado y, si querés, activalo.

### 3) Revisar / ajustar el Webhook Trigger

Dentro del workflow importado localizá el nodo **Webhook Trigger** y verificá:

- **Path** (ejemplo): `/webhook/kanban-export`
- **HTTP Method**: `POST`

**URLs de ejemplo según entorno:**

- URL externa (local, sin Docker):
  [text](http://localhost:5678/webhook/kanban-export)
- URL interna (Docker, si backend y n8n están en la misma red de Compose):
  [text](http://n8n:5678/webhook/kanban-export)

Si cambiás puertos o nombres de servicio en Docker, actualizá `N8N_WEBHOOK_URL` en el `.env` del backend.

## 🚀 Pasos de Configuración — 4) Configurar Mailtrap

1. En Mailtrap, creá un **inbox** (o usá uno existente).
2. En el nodo **Email Send** del workflow de N8N, configurá el SMTP con las credenciales de Mailtrap:

- Host: `sandbox.smtp.mailtrap.io`
- Port: `2525`
- User: `YOUR_MAILTRAP_USER`
- Password: `YOUR_MAILTRAP_PASS`

También podés definir estas variables en el `.env` del backend (recomendado para consistencia):

```env
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_pass
MAIL_FROM="useTeam <no-reply@useteam.local>"
```

## ✅ Probar el flujo, Campos CSV y Notas finales

### 5) Probar el flujo

1. Levantá el backend (NestJS) y el frontend.
2. Desde el frontend, ejecutá la acción **Exportar Backlog**.
3. El backend hará POST a `/api/export/backlog` y disparará el webhook de N8N.
4. N8N generará el CSV y enviará el correo (ver en Mailtrap).

### ✅ Campos incluidos en el CSV

El archivo exportado contiene las columnas:

| Campo         | Descripción                       |
| ------------- | --------------------------------- |
| `id`          | Identificador único de la tarea   |
| `title`       | Título o nombre de la tarea       |
| `description` | Descripción breve de la tarea     |
| `column`      | Nombre de la columna actual       |
| `createdAt`   | Fecha de creación (timestamp ISO) |

### 💡 Notas finales

- El workflow funciona en Docker y local; ajustá `N8N_WEBHOOK_URL` según el entorno (ej. `http://n8n:5678/...` vs `http://localhost:5678/...`).
- Para debugging: activá **Manual Mode** en N8N y probá con `curl` o Postman enviando un POST al webhook.
- Guardá las credenciales SMTP fuera del repo (usar `.env`, no commitear).

**Autor:** Luca Haller  
**Versión:** 1.0.0  
**Fecha:** Octubre 2025
