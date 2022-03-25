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
        
        

        let playerData = await slapModel.findOne({ userID: message.author.id });
        if (!playerData) return `User doesn't exist`;

        let slapString = "";
        for (let i = 0; i < playerData.slappedBy.length; i++){
            slapString = slapString + `${userMention(playerData.slappedBy[i].user)}: ${playerData.slappedBy[i].count} \n`;

        }
        let slapCount = 0;

        for (let i = 0; i < playerData.slappedBy.length; i++) {
            slapCount = slapCount + playerData.slappedBy[i].count;
            
        }

        const newEmbed = new Discord.MessageEmbed()
        .setColor('#BE0000')
        .setAuthor(`${personUsername} slap counter`)
        .setTitle(`${personUsername} has been slapped ${slapCount} times by the following people:`)
        .setDescription(slapString);
        


    message.channel.send({ embeds: [newEmbed] });

    }
}