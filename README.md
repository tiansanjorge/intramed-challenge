# 🚀 Rick & Morty Challenge

Este proyecto es una aplicación interactiva construida con **Next.js + TypeScript** que consume la API pública de Rick & Morty.

Permite **explorar personajes con profundidad de detalles, aplicar filtros dinámicos, marcarlos como favoritos y compararlos** según sus apariciones en episodios.

Incluye **UI moderna con TailwindCSS, estado global con Redux, modales personalizados y un flujo de testing completo con Vitest + React Testing Library**, alcanzando una cobertura cercana al 100%.

👉 **[Acceder a la demo en Netlify](https://intramed-challenge.netlify.app/)**

---

## ⚙️ Instalación y ejecución

### 1. Clonar el repo

```bash
git clone <https://github.com/tiansanjorge/intramed-challenge.git>
cd <intramed-challenge>
```

### 2. Instalar dependencias

```bash
npm install
# o yarn install
# o pnpm install
```

### 3. Levantar en desarrollo

```bash
npm run dev
```

La app estará corriendo en [http://localhost:3000](http://localhost:3000).

---

## 🧩 Funcionalidades principales

- **Listado doble de personajes**: dos columnas para elegir y comparar sus episodios.
- **Filtros**: por especie, género y estado.
- **Favoritos**: persistidos en Redux, accesibles en la pestaña "Favoritos".
- **Modal de detalle**: muestra información completa del personaje y sus episodios.
- **Paginación**: local, configurable desde el hook.
- **Loader con spinner**: indicador visual mientras se cargan datos.
- **Tests unitarios** con Vitest + Testing Library.

---

## 🧪 Testing

El proyecto tiene una cobertura total cercana al **100%**

### Ejecutar todos los tests

```bash
npm run test
```

### Ver reporte de cobertura

```bash
npm run test:coverage
```

---

## 🏗️ Flujo de `useCharacters`

1. **Fetch inicial** de todos los personajes de la API.
2. **Estados locales** para páginas, overlays, modales y filtros.
3. **Filtros aplicados** combinan búsqueda, especie, género y estado.
4. **Favoritos** controlados por Redux (`favoritesSlice`).
5. **Selección de personajes** a izquierda y derecha carga episodios asociados.

El hook expone todo este estado y funciones para que `CharacterList` y demás componentes funcionen desacoplados.

---

## 🛠️ Stack Tecnológico

- **React + TypeScript**
- **Next.js**
- **Redux Toolkit**
- **TailwindCSS**
- **Vitest + React Testing Library**
- **Lucide Icons**

---

👨‍💻 **Autor**: Proyecto desarrollado por [Sebastián Sanjorge](https://ssanjorge.netlify.app) como challenge y práctica profesional en frontend.
