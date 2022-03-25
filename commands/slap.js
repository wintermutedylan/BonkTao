const { userMention } = require("@discordjs/builders");
const slapModel = require("../models/slapModel");
const lucky = require('lucky-item').default;

module.exports = {
    name: 'slap',
    aliases: [],
    permissions: [],
    description: "Create user profile",
    async execute(client, message, cmd, args, Discord) {
        var person = message.mentions.members.first();
        if (!person) return message.channel.send("Please mention a user when using that command"); //https://tenor.com/view/milim-gif-19649138
        let ID = message.author.id;
        let gifURLs = ['https://c.tenor.com/FJsjk_9b_XgAAAAC/anime-hit.gif', 'https://c.tenor.com/V5cg3z9nqscAAAAd/genshin-impact.gif', 'https://c.tenor.com/FrEq8y-Qf78AAAAC/anime-slapping.gif', 'https://c.tenor.com/buP-9S7oWF8AAAAC/face-slap.gif'
        , 'https://c.tenor.com/x4RluZcWrWwAAAAd/slap.gif', 'https://c.tenor.com/pgq_YsVX7sEAAAAC/meliodas-seven-deadly-sins.gif', 'https://c.tenor.com/UDo0WPttiRsAAAAd/bunny-girl-slap.gif', 'https://c.tenor.com/wOCOTBGZJyEAAAAC/chikku-neesan-girl-hit-wall.gif'
        ,'https://c.tenor.com/ROrY_MIMWt4AAAAd/milim.gif']

        let personData = await slapModel.findOne({ userID: person.user.id });
        if (!personData) {
            try {
                let profile = await slapModel.create({
                    userID: person.user.id,
                    usersSlapped: [],
                    slappedBy: []
                });
                profile.save();

            } catch (err) {
                console.log(err);
            }
        }

        let playerData = await slapModel.findOne({ userID: message.author.id });
        if (!playerData) {
            try {
                let profile = await slapModel.create({
                    userID: message.author.id,
                    usersSlapped: [],
                    slappedBy: []
                });
                profile.save();

            } catch (err) {
                console.log(err);
            }
        }

        





        let slapPerson = false;
        let playerData2;
        playerData2 = await slapModel.findOne({ userID: message.author.id }); // take this out and it breaks dupes
        for (let location = 0; location < playerData2.usersSlapped.length; location++) {
            if (playerData2.usersSlapped[location].user === person.user.id) {

                var owned = playerData2.usersSlapped[location].count;
                owned++;


                try {
                    await slapModel.findOneAndUpdate(
                        {
                            userID: ID
                        },
                        {
                            $set: {
                                ["usersSlapped." + location + ".count"]: owned
                            },
                        }
                    );

                } catch (err) {
                    console.log(err);
                }
                slapPerson = true;
                break;
            }
        }
        if (!slapPerson) {
            try {
                await slapModel.findOneAndUpdate(
                    {
                        userID: ID
                    },
                    {
                        $push: {
                            usersSlapped: { user: person.user.id, count: 1 }
                        },
                    }
                );

            } catch (err) {
                console.log(err);
            }

        }

        var slapPerson2 = false;
        let playerData3;
        playerData3 = await slapModel.findOne({ userID: person.user.id }); // take this out and it breaks dupes
        for (let location = 0; location < playerData3.slappedBy.length; location++) {
            if (playerData3.slappedBy[location].user === message.author.id) {

                var owned = playerData3.slappedBy[location].count;
                owned++;


                try {
                    await slapModel.findOneAndUpdate(
                        {
                            userID: person.user.id
                        },
                        {
                            $set: {
                                ["slappedBy." + location + ".count"]: owned
                            },
                        }
                    );

                } catch (err) {
                    console.log(err);
                }
                slapPerson2 = true;
                break;
            }
        }
        if (!slapPerson2) {
            try {
                await slapModel.findOneAndUpdate(
                    {
                        userID: person.user.id
                    },
                    {
                        $push: {
                            slappedBy: { user: message.author.id, count: 1 }
                        },
                    }
                );

            } catch (err) {
                console.log(err);
            }

        }
        
        let slapCount = 0;
        let slapData = await slapModel.findOne({ userID: message.author.id });

        for (let i = 0; i < slapData.slappedBy.length; i++) {
            slapCount = slapCount + slapData.slappedBy[i].count;
            
        }
        

        let slappedByCount = 0;
        for (let j = 0; j < slapData.usersSlapped.length; j++){
            if (slapData.usersSlapped[j].user === person.user.id){
                slappedByCount = slapData.usersSlapped[j].count;

            }
        }
        let gifImage = lucky.item(gifURLs);
        
        

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#BE0000')
            .setAuthor(`${message.author.username} has slapped ${person.user.username} ${slappedByCount} times`)
            .setImage(gifImage)
            .setFooter(`${message.author.username} has been slapped ${slapCount} times`)


        message.channel.send({ embeds: [newEmbed] });








    }
}

