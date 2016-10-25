# Poker-room
Multiplayer websocket poker room with AI, biacs


## Tools used
- **node.js:** used for the gameserver and scheduled tasks
  - **Redis:** game-server memory, shared between website, gameserver and AI server
  - **Slayer:** my custom game-server framework, check my other repos

- **python:** used for AI
  - **numpy:**
  - **Keras:** used for deep learning (AI)
  
- **php:** used for the website and testing
  - **Symfony:**
  - **PostgreSQL:** used by website for authentication, ranking, match history, other persistent data (shared between website and game server)
  - **Handlebars.js:** used for game frontend templating
  - **twig:** used for game/website frontend templating