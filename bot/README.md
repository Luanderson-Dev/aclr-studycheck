# 🤖 Discord Bot Template

A **professional**, **modular**, and **scalable** template for Discord bot development.

Built with **[TypeScript](https://www.typescriptlang.org/)**, **[Discordx](https://discordx.js.org/)**, and **[Tsyringe](https://github.com/microsoft/tsyringe)**, this project strictly follows **Clean Architecture** and **Domain-Driven Design (DDD)** principles. It provides a solid foundation where business logic (Application) is completely decoupled from the Discord library and external services (Infrastructure).

## 🚀 Technologies & Concepts

- **Language:** TypeScript
- **Framework:** Discordx (Decorators for Discord.js)
- **DI Container:** Tsyringe
- **Design Patterns:**
  - **Clean Architecture:** Separation of concerns into layers.
  - **Result Pattern:** Functional error handling (avoiding excessive try-catch blocks).
  - **Dependency Injection:** Inversion of Control (IoC) for better testing and maintainability.
  - **Singleton:** Efficient service management.

## 📂 Project Structure

The architecture is divided into concentric layers:

```text
src
├── 📂 application       # Pure Business Logic
│   ├── 📂 interfaces    # Contracts/Abstractions
│   └── 📂 useCases      # Logic Orchestration
│
├── 📂 core              # Shared Kernel
│   ├── 📂 di            # Dependency Injection Registry
│   └── 📂 logic         # Global Utilities
│
├── 📂 infrastructure    # Concrete Implementations
│   └── 📂 services      # Interface Implementations
│
├── 📂 presentation      # Interaction Layer (Entry Point)
│   ├── 📂 commands      # Slash Commands and Interactions
│   └── 📂 events        # Discord Event Listeners
│
├── 📜 bot.ts            # Discord Client Configuration
└── 📜 main.ts           # Application Bootstrap

```

## 🛠️ Installation & Usage

### Prerequisites

* [Node.js](https://nodejs.org/) (v20+ recommended)
* [Yarn](https://yarnpkg.com/) or NPM

### Getting Started

1. **Clone the repository (or use as a Template)**
```bash
git clone https://github.com/Luanderson-Dev/discord-bot-template.git
cd discord-bot-template
```


2. **Install dependencies**
```bash
yarn install
# or
npm install
```


3. **Configure Environment**
Create a `.env` file in the root directory and add your token:
```ini
BOT_TOKEN=your_discord_token_here

```


4. **Start the Bot**
```bash
yarn start
```

## 🧩 Development Guide

To add a new feature following this architecture, follow this flow:

1. **Application (Interface):** Define **WHAT** needs to be done in `src/application/interfaces`.
* *Ex: `IMusicService.ts` with a `play()` method.*


2. **Infrastructure (Service):** Implement **HOW** it is done in `src/infrastructure/services`.
* *Ex: `LavaPlayerService.ts` implementing `IMusicService`.*


3. **Core (DI):** Register the binding between the Interface and the Concrete Class in `src/core/di/registry.ts`.
4. **Application (Use Case):** Create the business logic in `src/application/useCases`, injecting the interface.
5. **Presentation (Command):** Create the command in `src/presentation/commands` and call the Use Case.

## 🤝 Contribution

Contributions are welcome! If you have ideas to improve the architecture or add new utilities to `core`, feel free to open a Pull Request.

## 📝 License

This project is licensed under the MIT License.
