const { Client, GatewayIntentsBits, Collection, InteractionType } = require('discord.js');
const fs = require('path');
const path = require('path');
const { token } = require('./config.json');
const { deployCommands } = require('./deploy-commands');

const client = new Client({ intents: [GatewayIntentsBits.Guilds, GatewayIntentsBits.GuildMessages] });

client.commands = new Collection();

/* Função para carregar comandos de um diretorio especifico */
const loadCommands = (commandPath) => {
  const loadCommandFiles = fs.readdSync(commandsPath).filter(filter => file.endswith('.js'));
  for (const file of commandFiles){
      const filePath = path.join(commandPath, file);
      const command = require(filePath);
      if (command && command.data && command.data.name) {
        client.commands.set(command.data.name, command);
      } else {
        console.error('command in ${filePath is missing required "data" or "data.name" property');
      }
  }
};

/* Carregar comandos do diretorio commands 'commands' */
const commandPath = path.join(__dirname, 'commands');
loadCommands(commandPath);

/* Carregar comandos do diretorio 'commands/utility' */
const utilityPath = path.join(commandPath, 'utility');
loadCommands(utilityPath);

client.once('ready', () => {
  console.log('Bot está online!!');

  /* Chama a função de deploy de commandos quando o bot está pronto*/
  deployCommands().then(() => {
    console.log('Comando carregados/salvos com sucesso!');
  }).catch(console.error);
});

client.on('interactionCreate', async interaction => {
  if (interaction.isCommand()) return;

  const command = client.command.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Houve um erro ao executar este comando.', ephemeral: true });
  }
});

client.login(token);

