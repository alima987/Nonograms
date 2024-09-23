# Nonograms

Nonograms is a puzzle game to reveal a hidden picture by looking at the number clues. The clues are given at the top and left side of the grid. Each number in these clue defines a block of black cell. A number indicates an unbroken line of black cells, and they are in the same order as the lines. These puzzles are often black and white—describing a binary image—but they can also be colored.

## Features

- The game should have at least 5 templates for easy level (5x5) and the player is able to choose what picture he/she wants to solve. 
- A player is able to fill in a cell in the grid changing the color of the grid to crossed-cell(X) using right mouse-click. Context menu doesn't appear
- The game can be restarted without reloading the page
- Game duration is displayed, stop-watch will start after first click on field (not on clues) and related message is displayed at the end of the game
- Sound accompaniment (on/off) for every events 
- Implemented saving the state of the latest game and "Continue last game" button
- Option to choose different themes for the game board (dark/light themes)
- Ability to change the size (5x5, 10x10, 15x15) is implemented and there are least 5 templates for each level
- Implemented saving the latest 5 win results with sorting
- "Random game" button is implemented. When player clicks on button - the random template appears (both template and level must be chosen randomly by algorithm)
- "Solution" button is implemented. When player clicks on button - the field is filled in cells with right solution. Such games is not recorded into winning table

## Technologies Used

- JavaScript
- SCSS

## Building and running on localhost

First install dependencies:

```sh
npm install
```

To run in hot module reloading mode:

```sh
npm start
```

To create a production build:

```sh
npm run build-prod
```

## Running

```sh
node dist/bundle.js
```



