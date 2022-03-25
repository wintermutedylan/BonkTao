require('dotenv').config();
const slapModel = require("../../models/slapModel");

module.exports = async (Discord, client, message) => {
    const prefix = process.env.PREFIX;
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
        
        

    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    
    if (!command) {
        return message.channel.send("This command doesn't exist!");
    }
    let profileData;
    
    try{
        profileData = await slapModel.findOne({ userID: message.author.id });
        if(!profileData){
            let profile = await slapModel.create({
                userID: message.author.id,
                usersSlapped: [],
                slappedBy: []
            });
            profile.save();
        }
    } catch(err){
        console.log(err);
    }

    const validPermissions = [
        "ADMINISTRATOR",
        "CREATE_INSTANT_INVITE",
        "KICK_MEMBERS",
        "BAN_MEMBERS",
        "MANAGE_CHANNELS",
        "MANAGE_GUILD",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "PRIORITY_SPEAKER",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "SEND_TTS_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "VIEW_GUILD_INSIGHTS",
        "CONNECT",
        "SPEAK",
        "MUTE_MEMBERS",
        "DEAFEN_MEMBERS",
        "MOVE_MEMBERS",
        "USE_VAD",
        "CHANGE_NICKNAME",
        "MANAGE_NICKNAMES",
        "MANAGE_ROLES",
        "MANAGE_WEBHOOKS",
        "MANAGE_EMOJIS"
    ];

    if (command.permissions.length) {
        let invalidPerms = [];
        for (const perm of command.permissions){
            if (!validPermissions.includes(perm)){
                return console.log(`Invalid Permissions ${perm}`);
            }
            if (!message.member.permissions.has(perm)){
                invalidPerms.push(perm);
            }
        }
        if (invalidPerms.length) {
            return message.channel.send(`Missing Permissions: \`${invalidPerms}\``);
        }
    }


    try {
        command.execute(client, message, cmd, args, Discord);
    } catch (err){
        message.reply("There was an error trying to execute this command!");
        console.log(err);
    }
}