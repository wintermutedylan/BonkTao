const { userMention } = require("@discordjs/builders");
const slapModel = require("../models/slapModel");


module.exports = {
    name: 'leaderboard',
    aliases: ['lb'],
    permissions: [],
    description: "Create user profile",
    async execute(client, message, cmd, args, Discord) {
        let allSlapData = await slapModel.find({});
        if (args.length > 1) {
            return message.reply('Please only enter one number');
        }
        if (args.length === 0){
            args.push('1');
        }
        let pageNumber = args[0];
        let pos;
        let userPos = 0;

        let sorted = allSlapData.sort((a, b) => (b.alBlueSlaps) - (a.alBlueSlaps));
        for (let i = 0; i < sorted.length; i++){
            pos = i + 1;
            if (sorted[i].userID === message.author.id){
                userPos = pos;
                break;

            }
        }

        pageNumber = Number(pageNumber) - 1; 
        if (sorted.length > 10) sorted = sorted.slice(pageNumber * 10, pageNumber * 10 + 10);


        pos = 0;
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#E76AA3')
        .setTitle("**Alblue Slap Leaderboard**")
        .setDescription(`__**Your Ranking: ${userPos}**__`)
        
        for (let j = 0; j < sorted.length; j++){
            pos = j + 1;
            let user = await client.users.fetch(sorted[j].userID);
            newEmbed.addFields(
                { name: `#${Number(pos) + Number(pageNumber) * 10}: ${user.username}#${user.discriminator}`, value: `Slaps: ${new Intl.NumberFormat().format(sorted[j].alBlueSlaps)}`}
            )


        }
        pageNumber++;
        newEmbed.setFooter(`Page # ${pageNumber}`)
        message.channel.send({ embeds: [newEmbed] });



    }
}