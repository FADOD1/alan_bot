const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('banir')
    .setDescription('Comando ppara banir viados e gays')
    .addUserOption(option => 
      option.setName('usuário')
          .setDescription('O usuário a ser banido')
          .setRequired(true))
    .addStringOption(option => 
      option.setName('razão')
          .setDescription('A razão do banimento')
          .setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razão') || 'Nenhuma razão fornecida';
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.Permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply('Você não tem permissão de administrador');
    }

    if (!member) {
      return interaction.reply('O usuario não está neste servidor.');
    }

    try {
      await member.ban({ reason });
      interaction.reply(`Usuario ${user.tag} foi banido. Razão: ${reason}`);
    } catch (err) {
      console.error(err);
      interaction.reply('Houve um erro ao tentar banir o viado.')
    }
  }
};