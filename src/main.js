// Braden Humphrey
// Created: 4/30/2024
// Phaser: 3.70.0
//
// PixelShmup
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    fps: {forceSetTimeOut: true, target:60},
    width: 800,
    height: 600,
    scene: [PixelShmup]
}

const game = new Phaser.Game(config);