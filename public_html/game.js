/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var Game = function (game) {
    this.game = game;
};

Game.prototype = {
    preload: function () {
        this.load.image('smallWorld', 'assets/smallWorld.png');
        this.load.image('button', 'assets/button.png');
        this.load.image('fireTrapTop', 'assets/firetop.png');
        this.load.image('fireTrapBottom', 'assets/firebottom.png');
    },

    create: function () {
        // Set game scale
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Add fire traps, top and bottom
        this.fireTrapTop = this.add.sprite(0, 0, 'fireTrapTop');
        this.fireTrapBottom = this.add.sprite(0, (this.world.centerY * 2) - this.fireTrapTop.height, 'fireTrapBottom');

        // Display the world in the corner
        this.smallWorld = this.add.sprite(this.world.centerX, 0, 'smallWorld');

        // Scale the small world to be small
        this.smallWorld.scale.setTo(0.3, 0.3);

        // Enable Arcade physics
        this.physics.enable(this.smallWorld, Phaser.Physics.ARCADE);

        // Enable gravity for the small world only
        this.planetGravity = 180; // Initial value for the planet's gravity; will increase over time
        this.smallWorld.body.gravity.set(0, this.planetGravity);

        // Make small world collide with world bounds
        this.smallWorld.body.collideWorldBounds = true;

        // Enable bounce for testing
        this.smallWorld.body.bounce.set(1);

        // Button for adding an upward vector to the small world
        this.button = this.add.button(this.world.centerX + this.world.centerX / 2,
                this.world.centerY + this.world.centerY / 2,
                'button',
                this.addVector,
                this);
        this.button.scale.setTo(0.4, 0.4);


        // Timer to randomly increase the small planet's gravity over time
        this.time.events.loop(500, this.addGravity, this);

        // Collision signal for the fire traps
        this.smallWorld.body.onWorldBounds = new Phaser.Signal();
        this.smallWorld.body.onWorldBounds.add(function (sprite, up, down, left, right) {
            // End the game if collision occurs
            if (up || down) {
                this.state.start('End');
            }
        }, this);

        // Time for gameplay and user interface
        this.timeElapsed = 0;
        this.timeDisplay = this.add.text(0, this.world.centerY, 'Time: 0', {fill: '#ffffff'});
        this.time.events.loop(1000, this.updateTime, this);
    },

    addVector: function () {
        this.smallWorld.body.velocity.setTo(0, -400);
    },

    addGravity: function () {
        this.planetGravity += this.rnd.integerInRange(1, 70);
        this.smallWorld.body.gravity.set(0, this.planetGravity);
    },

    updateTime: function () {
        this.timeElapsed++;
        this.timeDisplay.setText('Time: ' + this.timeElapsed);
    },

    update: function () {

    },

    render: function () {
        // For showing how much gravity the planet has
        //this.game.debug.text('Small world gravity: ' + this.smallWorld.body.gravity, 0, 32);
    }
};