const { userMention } = require("@discordjs/builders");
const slapModel = require("../models/slapModel");


module.exports = {
    name: 'slapcounter',
    aliases: [],
    permissions: [],
    description: "Create user profile",
    async execute(client, message, cmd, args, Discord) {
        var person = message.mentions.members.first();
        let personID;
        let personUsername;
        if (person){
            personID = person.user.id;
            personUsername = person.user.username;
        } else {
            personID = message.author.id;
            personUsername = message.author.username;
        }
        
        

        let playerData = await slapModel.findOne({ userID: personID });
        
        if (!playerData) return `User doesn't exist`;
        let allBlueSlaps = playerData.alBlueSlaps; //499257085159276544

        let slapString = "";
        for (let i = 0; i < playerData.slappedBy.length; i++){
            slapString = slapString + `${userMention(playerData.slappedBy[i].user)}: ${playerData.slappedBy[i].count} \n`;

        }
        

        let slapCountData = playerData.slapCount;

        

        const newEmbed = new Discord.MessageEmbed()
        .setColor('#BE0000')
        .setAuthor(`${personUsername}'s slap counter`)
        .setTitle(`${personUsername} has slapped **Alblue** ${allBlueSlaps} total times`)
        .setDescription(`${personUsername} has been slapped ${slapCountData} times by the following people:\n` + slapString);
        


    message.channel.send({ embeds: [newEmbed] });

    }
}