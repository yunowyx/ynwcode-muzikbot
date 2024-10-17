const { Client, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.on('ready', () => {
    console.log(`${client.user.tag} giriş yaptı!`);
});

// Slash komutlarını kaydet
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'play') {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply('Lütfen önce bir ses kanalına katıl!');
        }

        const songUrl = interaction.options.getString('url');
        if (!ytdl.validateURL(songUrl)) {
            return interaction.reply('Geçerli bir YouTube URL\'si giriniz.');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const stream = ytdl(songUrl, { filter: 'audioonly' });
        const resource = createAudioResource(stream);
        const player = createAudioPlayer();
        
        player.play(resource);
        connection.subscribe(player);

        await interaction.reply(`🎶 Şu anda çalıyor: ${songUrl}`);
    }
});

client.login(config.token);
