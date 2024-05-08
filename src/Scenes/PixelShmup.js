class PixelShmup extends Phaser.Scene {
    constructor() {
        super("pixelShmupScene");

        this.my = {sprite: {}};

        this.playerSpeed = 7;
        this.playerBulletSpeed = 10;
        this.spawnTimer = 0;
        this.target1 = 240;
        this.target2 = 360;
        this.enemyBulletSpeed = 5;
        this.enemy1FiringChance = 0;
    }

    preload() {
        // Load assets
        // Assets from Kenney Assets "Pixel Shmup"
        this.load.setPath("./assets/");
        this.load.image("playerPlane", "ship_0002.png");
        this.load.image("playerBullet", "tile_0000.png");
        this.load.image("fighter", "ship_0016.png");
        this.load.image("interceptor", "ship_0019.png");
        this.load.image("bomber", "ship_0012.png");
        this.load.image("enemyBullet", "tile_0002.png");
        this.load.image("explosion1", "tile_0004.png");
        this.load.image("explosion2", "tile_0005.png");
        this.load.image("explosion3", "tile_0006.png");
        this.load.image("explosion4", "tile_0007.png");
        this.load.image("explosion5", "tile_0008.png");
        
        // and "Impact Sounds" packs
        this.load.audio("playerFiring", "footstep_concrete_001.ogg");
        this.load.audio("playerDestroyed", "impactPlate_heavy_000.ogg");
        this.load.audio("enemyFiring", "footstep_carpet_003.ogg");
        this.load.audio("enemyDestroyed", "impactPlate_medium_001.ogg");

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>Use A and D to move, use Space to fire</h2>'
    }

    create() {
        let my = this.my;

        let points1 = [
            150, -60,
            150, 44,
            97, 123,
            90, 192,
            145, 288,
            286, 333,
            378, 338,
            554, 355,
            734, 368,
            863, 402,
            868, 468,
            837, 523,
            718, 551,
            556, 565,
            381, 581,
            315, 609,
            279, 669,
            311, 733,
            355, 780,
            417, 860
        ];
        
        let points2 = [
            786, -60,
            786, 26,
            827, 95,
            805, 143,
            681, 185,
            547, 208,
            362, 233,
            203, 264,
            103, 312, 
            68, 368,
            116, 466, 
            205, 492,
            370, 521,
            519, 549,
            617, 573,
            700, 590,
            770, 625,
            764, 682,
            704, 756,
            648, 860
        ];

        this.curves = [];

        this.enemyArr = [
            "fighter",
            "interceptor",
            "bomber"
        ];

        my.sprite.spawnedEnemies = [];

        this.curves.push(new Phaser.Curves.Spline(points1));
        this.curves.push(new Phaser.Curves.Spline(points2));

        this.totalEnemies = 1;
        this.currEnemies = 0;
        this.intermission = 0;

        this.score = 0;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "playerPlane", null, this.left, this.right, 5);
        my.sprite.player.setScale(2);

        my.sprite.enemy1 = this.add.sprite(game.config.width/2 - 550, 30, "fighter");
        my.sprite.enemy1.setScale(2.2);
        my.sprite.enemy1.flipY = true;
        my.sprite.enemy2 = this.add.sprite(game.config.width/2 + 550, 30, "interceptor");
        my.sprite.enemy2.setScale(2.2);
        my.sprite.enemy2.flipY = true;


        // Create bullet group for player (5)
        my.sprite.playerBulletGroup = this.add.group({
            defaultKey: "playerBullet",
            maxSize: 10
        })

        my.sprite.playerBulletGroup.createMultiple({
            active: false,
            setXY: {x: -200, y: -200},
            key: my.sprite.playerBulletGroup.defaultKey,
            repeat: my.sprite.playerBulletGroup.maxSize - 1
        });

        /*my.sprite.enemy1BulletGroup = this.add.group({
            defaultKey: "enemyBullet",
            maxSize: 1
        })

        my.sprite.enemy1BulletGroup.createMultiple({
            visible: false,
            active: false,
            key: my.sprite.enemy1BulletGroup.defaultKey,
            repeat: my.sprite.enemy1BulletGroup.maxSize - 1
        });

        my.sprite.enemy2BulletGroup = this.add.group({
            defaultKey: "enemyBullet",
            maxSize: 1
        })

        my.sprite.enemy2BulletGroup.createMultiple({
            visible: false,
            active: false,
            key: my.sprite.enemy2BulletGroup.defaultKey,
            repeat: my.sprite.enemy2BulletGroup.maxSize - 1
        });*/

        // Number of update() calls between player's shots
        this.playerBulletCooldown = 10;
        this.playerBulletCooldownCounter =  0;

        // Number of update() calls between enemy1's shots
        this.enemy1BulletCooldown = 300;
        this.enemy1BulletCooldownCounter = 0;

        // Number of update() calls between enemy2's shots
        this.enemy2BulletCooldown = 200;
        this.enemy2BulletCooldownCounter = 0;

        // Create animation for planes being destroyed
        this.anims.create({
            key: "explosion",
            frames: [
                {key: "explosion1"},
                {key: "explosion2"},
                {key: "explosion3"},
                {key: "explosion4"},
                {key: "explosion5"}
            ],
            frameRate: 5,
            repeat: 0,
            hideOnComplete: true
        });
    }

    update() {
        let my = this.my;
        this.playerBulletCooldownCounter--;
        this.spawnTimer++;
        this.enemy1BulletCooldownCounter--;
        this.enemy2BulletCooldownCounter--;

        if (this.currEnemies < this.totalEnemies) {
            if (this.spawnTimer == this.target1) {
                this.spawnEnemies();
                this.currEnemies++;
                this.target1 += 240;
            }
            if (this.spawnTimer == this.target2) {
                this.spawnEnemies();
                this.currEnemies++;
                this.target2 += 240;
            }
        }

        /*if (this.currEnemies == this.totalEnemies) {
            console.log("Wave complete!");
            this.intermission++;
            if (this.intermission >= 600) {
                this.totalEnemies += 5;
                this.currEnemies = 0;
                this.intermission = 0;
                this.spawnTimer = 0;
                this.target1 = 240;
                this.target2 = 360;
            }
        }*/

        // player firing behavior
        if (this.space.isDown) {
            if (this.playerBulletCooldownCounter < 0) {
                let playerBullet = my.sprite.playerBulletGroup.getFirstDead();
                
                if (playerBullet != null) {
                    playerBullet.active = true;
                    playerBullet.visible = true;
                    playerBullet.x = my.sprite.player.x;
                    playerBullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/3);
                    this.sound.play('playerFiring', {
                        volume: 1
                    });
                    this.playerBulletCooldownCounter = this.playerBulletCooldown;
                }
            }
        }

        for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
            for (let enemy of my.sprite.spawnedEnemies) {
                if (this.collides(enemy, playerBullet)) {
                    // play destroy animation and enemyDestroyed sound when playerBullet hits enemy1
                    this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion1").setScale(2).play("explosion");
                    
                    // clear out playerBullet and enemy
                    playerBullet.y = -100;
                    enemy.stopFollow();
                    enemy.visible = false;
                    enemy.y = 900;

                    this.sound.play("enemyDestroyed", {
                        volume: 1
                    });

                    this.explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.score += 100;
                        console.log("Score: " + this.score);
                    }, this);
                }
            }
        }

        // collision for playerBullet and enemy1
        for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
            if (this.collides(my.sprite.enemy1, playerBullet)) {
                // play destroy animation and enemyDestroyed sound when playerBullet hits enemy1
                this.explosion = this.add.sprite(my.sprite.enemy1.x, my.sprite.enemy1.y, "explosion1").setScale(2).play("explosion");
                
                // clear out playerBullet and enemy
                playerBullet.y = -100;
                my.sprite.enemy1.visible = false;
                my.sprite.enemy1.x = -100;

                this.sound.play("enemyDestroyed", {
                    volume: 1
                });

                this.explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy1.visible = true;
                    this.my.sprite.enemy1.x = Math.random()*config.width;
                    if (this.my.sprite.enemy1.x < 50) {
                        this.my.sprite.enemy1.x += 50;
                    }
                    if (this.my.sprite.enemy1.x > (config.width - 50)) {
                        this.my.sprite.enemy1.x -= 50;
                    }
                }, this);
            }
        }

        // collision for playerBullet and enemy2
        for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
            if (this.collides(my.sprite.enemy2, playerBullet)) {
                // play destroy animation and enemyDestroyed sound when playerBullet hits enemy1
                this.explosion = this.add.sprite(my.sprite.enemy2.x, my.sprite.enemy2.y, "explosion1").setScale(2).play("explosion");
                
                // clear out playerBullet and enemy
                playerBullet.y = -100;
                my.sprite.enemy2.visible = false;
                my.sprite.enemy2.x = -100;

                this.sound.play("enemyDestroyed", {
                    volume: 1
                });

                this.explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.enemy2.visible = true;
                    this.my.sprite.enemy2.x = Math.random()*config.width;
                    if (this.my.sprite.enemy2.x < 50) {
                        this.my.sprite.enemy2.x += 50;
                    }
                    if (this.my.sprite.enemy2.x > (config.width - 50)) {
                        this.my.sprite.enemy2.x -= 50;
                    }
                }, this);
            }
        }

        for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
            // If playerBullet moves off the top of the screen, make it inactive
            if (playerBullet.y < -(playerBullet.displayHeight/2)) {
                playerBullet.active = false;
                playerBullet.visible = false;
            }
        }

        // enemy1 firing behavior
        /*if (my.sprite.enemy1.visible = true) {
            if (this.enemy1BulletCooldownCounter < 0) {
                let enemy1Bullet = my.sprite.enemy1BulletGroup.getFirstDead();
                    
                if (enemy1Bullet != null) {
                    enemy1Bullet.active = true;
                    enemy1Bullet.visible = true;
                    enemy1Bullet.x = my.sprite.enemy1.x;
                    enemy1Bullet.y = my.sprite.enemy1.y + (my.sprite.enemy1.displayHeight/3);
                    this.sound.play('enemyFiring', {
                        volume: 0.2
                    });
                    this.enemy1BulletCooldownCounter = this.enemy1BulletCooldown;
                }
            }
        }*/

        // collision for enemy1Bullet and player
        /*for (let enemy1Bullet of my.sprite.enemy1BulletGroup.getChildren()) {
            if (this.collides(my.sprite.player, enemy1Bullet)) {
                // play destroy animation and enemyDestroyed sound when playerBullet hits enemy1
                this.explosion = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "explosion1").setScale(2).play("explosion");
                
                // clear out playerBullet and enemy
                enemy1Bullet.y = -100;
                my.sprite.player.visible = false;
                my.sprite.player.x = -100;

                this.sound.play("playerDestroyed", {
                    volume: 1
                });

                this.explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.player.visible = true;
                    this.my.sprite.player.x = game.config.width/2
                }, this);
            }
        }

        for (let enemy1Bullet of my.sprite.enemy1BulletGroup.getChildren()) {
            if (enemy1Bullet.y > game.config.height) {
                enemy1Bullet.active = false;
                enemy1Bullet.visible = false;
            }
        }

        // enemy2 firing behavior
        if (my.sprite.enemy1.visible = true) {
            if (this.enemy2BulletCooldownCounter < 0) {
                let enemy2Bullet = my.sprite.enemy2BulletGroup.getFirstDead();
                    
                if (enemy2Bullet != null) {
                    enemy2Bullet.active = true;
                    enemy2Bullet.visible = true;
                    enemy2Bullet.x = my.sprite.enemy2.x;
                    enemy2Bullet.y = my.sprite.enemy2.y + (my.sprite.enemy2.displayHeight/3);
                    this.sound.play('enemyFiring', {
                        volume: 0.2
                    });
                    this.enemy2BulletCooldownCounter = this.enemy2BulletCooldown;
                }
            }
        }

        // collision for enemy2Bullet and player
        for (let enemy2Bullet of my.sprite.enemy2BulletGroup.getChildren()) {
            if (this.collides(my.sprite.player, enemy2Bullet)) {
                // play destroy animation and enemyDestroyed sound when playerBullet hits enemy1
                this.explosion = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "explosion1").setScale(2).play("explosion");
                
                // clear out playerBullet and enemy
                enemy2Bullet.y = -100;
                my.sprite.player.visible = false;
                my.sprite.player.x = -100;

                this.sound.play("playerDestroyed", {
                    volume: 1
                });

                this.explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.my.sprite.player.visible = true;
                    this.my.sprite.player.x = game.config.width/2
                }, this);
            }
        }

        for (let enemy2Bullet of my.sprite.enemy2BulletGroup.getChildren()) {
            if (enemy2Bullet.y > game.config.height) {
                enemy2Bullet.active = false;
                enemy2Bullet.visible = false;
            }
        }*/

        if (this.collides(my.sprite.enemy1, my.sprite.enemy2)) {
            my.sprite.enemy1.x += 10;
            my.sprite.enemy2.x -= 10;
        }

        my.sprite.playerBulletGroup.incY(-this.playerBulletSpeed);
        // my.sprite.enemy1BulletGroup.incY(this.enemyBulletSpeed);
        // my.sprite.enemy2BulletGroup.incY(this.enemyBulletSpeed);

        my.sprite.spawnedEnemies = my.sprite.spawnedEnemies.filter((enemy) => enemy.y < game.config.height);

        // Calls Player class update()
        my.sprite.player.update();
    }

    collides(a,b) {
        if(Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if(Math.abs(a.y - b.y) > (a.displayHeight/3 + b.displayHeight/3)) return false;
        return true;
    }

    spawnEnemies() {
        let pickPath = Math.round(Math.random()*(this.curves.length - 1));
        let mySpline = this.curves[pickPath];
        let firstPoint = mySpline.points[0];

        let pickEnemy = Math.round(Math.random()*(this.enemyArr.length - 1));
        let myEnemy = this.enemyArr[pickEnemy];

        let tmpEnemy = this.add.follower(mySpline, firstPoint.x, firstPoint.y, myEnemy);
        tmpEnemy.setScale(2);
        if (this.my.sprite.spawnedEnemies.length < 10) {
            this.my.sprite.spawnedEnemies.push(tmpEnemy.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: 10000,
                ease: "Sine.easeInOut",
                repeat: 0,
                rotateToPath: true,
                rotationOffset: 90
            }));
        }
    }
}