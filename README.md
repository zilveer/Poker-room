# Poker-room
Multiplayer websocket poker room with AI, biacs


## Tools used
- **php, symfony:** used for the website and testing
  - **twig:** used for game/website frontend templating
  - **PostgreSQL:** used by website for authentication, ranking, match history, other persistent data (shared between website and game server)

- **node.js:** used for the gameserver and scheduled tasks
  - **Handlebars.js:** used for game frontend templating
  - **Redis:** game-server memory, shared between website, gameserver and AI server

- **python:** used for AI
  - **numpy:**
  - **Keras:** used for deep learning (AI)
