# DevCard - Developer Identity Cards

<div align="center">
  <img src="./public/logo.png" alt="DevCard Logo" width="200" />
</div>

A comprehensive tool for creating stunning, personalized developer identity cards. Showcase your GitHub stats, tech stack, and coding achievements in style.

**DevCard** is more than just a profile generator; it is a powerful personal branding tool designed specifically for developers. In an era where digital presence is crucial, DevCard allows you to encapsulate your skills, GitHub statistics, and coding identity into a single, visually striking card. Whether for your portfolio, LinkedIn banner, or Twitter header, DevCard ensures you stand out with professional, high-quality visuals that reflect your unique coding aesthetic. Bridging the gap between a standard resume and a creative portfolio, it offers a seamless way to share your professional journey.

## 🚀 Features

*   **Dynamic GitHub Integration**: Automatically fetch and display profile data directly from GitHub.
*   **Multiple Themes**: Choose from various themes including **Hacker**, **Cyberpunk**, **Minimal**, and **Retro** to match your style.
*   **Customization**: Fully editable text, skills, and layout options.
*   **Export Ready**: Download your card as a high-quality image (`.png`) for social media or your portfolio.
*   **Project Management**: Create, edit, duplicate, and manage multiple DevCard projects.
*   **Responsive Design**: A seamless experience across desktop and mobile devices.

## 🛠️ Tech Stack

Built with a modern, robust technology stack:

*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Routing**: [React Router](https://reactrouter.com/)
*   **State Management**: Zustand (implied via hooks/useDevCardStore)
*   **Utilities**: `date-fns`, `html-to-image`, `clsx`, `tailwind-merge`

## 🧩 Technical Highlights

DevCard utilizes a suite of modern web technologies to deliver a high-performance experience:

*   **Client-Side Generation**: Leverages `html-to-image` for privacy-first, serverless image generation directly in the browser.
*   **Robust State Management**: Powered by **Zustand** for efficient, persisted global state management across the application.
*   **Type-Safe Forms**: Implements **React Hook Form** combined with **Zod** schema validation for robust input handling.
*   **Component Architecture**: Constructed with **Radix UI** primitives via **Shadcn UI** ensuring full accessibility (a11y) and keyboard navigation.
*   **Interactivity**: Uses **react-grab** for intuitive drag-and-drop interfaces and **Sonner** for toast notifications.
*   **Optimized Styling**: Atomic CSS approach with **Tailwind CSS** and consistent theming through css variables.

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Solez-ai/devcard-showcase.git
    cd devcard-showcase
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🤝 Contributing

Contributions are always welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Samin Yeasar [Solez-ai]**

*   Website: [solez.vercel.app](https://solez.vercel.app)
*   GitHub: [@Solez-ai](https://github.com/Solez-ai)
*   Twitter: [@Solez_None](https://x.com/Solez_None)

---

<p align="center">
  Made with ❤️ by Samin Yeasar
</p>
