# Neon BOT

A bot for the [Neon Discord server](https://discord.gg/qU7RkH8XNF).

[![Discord](https://img.shields.io/badge/DISCORD-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)
](https://discord.gg/2dvRqgKd) ![Discord](https://img.shields.io/discord/876210790250741830?label=DISCORD&style=for-the-badge)

## License
  <p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/Neon-Discord/NeonBOT">NeonBOT</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/xil-f-dev">@xil-f-dev</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-ND 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"></a></p> 

## Installation

1. Clone this repository :

    > ```bash
    > git clone https://github.com/Neon-Discord/NeonBOT.git
    > ```

2. Open the downloaded folder :

    > ```bash
    > cd NeonBOT
    > ```

3. Install the dependencies :

    > ```bash
    > npm install
    > ```

4. Copy the config

    > ```bash
    > cp config/config.example.json config/config.json
    > ```

    and put your Discord application token and if you want the Blagues_api token

5. Run the bot :
    > ```bash
    > npm start
    > # Or with pm2
    > pm2 start main.js --name NeonBOT
    > ```

#### NOTE:

You can change the bot prefix, the announcements and welcome channels IDs in the `config/setting.json` file.

## Contributors

-   [@xil-f-dev](https://github.com/xil-f-dev)
-   [Neon discord server](https://discord.gg/qU7RkH8XNF)
