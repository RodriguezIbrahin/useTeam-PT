# 🚀 Landing Page Tech Stack

## 🔧 Tecnologías Usadas

- **Next.js (App Router)**  
  👉 Framework base con **file routing optimizado**.

- **React**  
  👉 Librería principal para la construcción de interfaces.

- **TailwindCSS**  
  🎨 Estilizado utilitario **rápido y escalable**.

- **Shadcn/UI**  
  🧩 Componentes **accesibles y personalizables**.

- **TanStack Query**  
  ⚡ Manejo avanzado de **queries y cache de datos**.

- **WebSockets (Client-Side)**  
  🔗 Comunicación en **tiempo real desde el cliente**.

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura _feature-based_** adaptada al **file routing de Next.js**, lo que permite:

✅ **Aislar** la lógica, hooks y contextos dentro de cada _feature/página_.  
✅ **Minimizar dependencias compartidas**, manteniendo la cohesión.  
✅ **Ubicar recursos globales y genéricos** dentro de la carpeta `src/`.

---

📂 **Ejemplo de estructura de carpetas**

```bash
src/
 ├── app/                # Rutas de la App Router
 │   ├── dashboard/       # Feature: Dashboard
 │   │   ├── hooks/
 │   │   ├── context/
 │   │   └── components/
 │   └── auth/            # Feature: Auth
 │       ├── hooks/
 │       ├── context/
 │       └── components/
 │
 └── core/              # Utilidades, helpers, tipos
   ├── components/
   │   └── ui/
   ├── hooks/
   └── contexts/
                   # Componentes UI genéricos
```
