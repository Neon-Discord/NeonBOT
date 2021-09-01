# Neon BOT

A bot for the [Neon Discord server](https://discord.gg/qU7RkH8XNF).

## Installation

1. Clone this repository :

    > `git clone https://github.com/Neon-Discord/NeonBOT.git`

2. `cd` to the downloaded folder :

    > `cd NeonBOT`

3. Install the dependencies :

    > `npm install`

4. Copy the config

    > ````bash
    > cp config/config.example.json config/config.json```
    > ````

    and put your Discord application token and if you want the Blagues_api token

5. Run the bot :
    > ````bash
    > npm start
    > # Or with pm2
    > pm2 start main.js --name NeonBOT```
    > ````

#### NOTE:

You can change the bot prefix, the announcements and welcome channels id in the `config/setting.json` file.

## Contributors

-   [@xil-f-dev](https://github.com/xil-f-dev)
-   [Neon discord server](https://discord.gg/qU7RkH8XNF)
