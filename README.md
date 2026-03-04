# Algorithm Visualizer

Web app for visualizing sorting algorithms and data structures, built with React and Vite.

![Made with React](https://img.shields.io/badge/React-19-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple)

## Features

### Sorting Algorithms
- **Bubble Sort**
- **Insertion Sort**
- **Selection Sort**
- **Quick Sort**

Includes adjustable speed control, comparison counter.

As for now

### Linked List
Visualize singly linked list operations:
- Add to head / tail
- Insert at index
- Remove from head / tail
- Search by value

### Stack & Queue
Visualize LIFO and FIFO data structures:
- **Stack** — push, pop, peek (vertical layout)
- **Queue** — enqueue, dequeue, peek (horizontal layout)

## Tech Stack

- [React 19](https://react.dev/)
- [React Router 7](https://reactrouter.com/)
- [Vite 7](https://vite.dev/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm (or yarn / pnpm)

### Installation

```sh
git clone <repo-url>
cd algorith-visualizer
npm install
```

### Development

```sh
npm run dev
```

Opens the app at `http://localhost:5173`.

### Build for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Project Structure

```
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── main.jsx            
    ├── App.jsx            
    ├── App.css             
    ├── index.css          
    └── visualizers/
        ├── SortingVisualizer.jsx      # Sorting algorithms visualizer
        ├── SortingVisualizer.tsx       # Sorting visualizer (TypeScript)
        ├── LinkedListVisualizer.jsx   # Linked list visualizer
        ├── StackVisualizer.jsx        # Stack visualizer
        └── StackQueueVisualizer.tsx   # Combined Stack & Queue visualizer
```

## License

do whatever you want