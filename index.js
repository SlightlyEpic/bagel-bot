const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const utilityFunctions = require('./utilityFunctions.js');
const devs = ['420515876824154112'];

const assets = {
    jokes: require('./assets/jokes.json'),
    insults: require('./assets/insults.json'),
    compliments: require('./assets/compliments.json'),
    sentences: require('./assets/sentences.json')
}

const servers = {
    "727584940983713833": {
        configID: '729642501966921798',
        economyID: '729642411625807902',
        config: {
            serverCommands: {},
            money: {},
            currency: "Bagels"
        }
    }
}

const commands = {
    help: {},
    helpold: {},
    say: {},
    createrole: {},
    deleterole: {},
    listroles: {},
    kick: {},
    ban: {},
    mute: {},
    joke: {},
    compliment: {},
    roast: {},
    avatar: {},
    typebattle: {},
    addmoney: {},
    pay: {},
    beg: {},
    balance: {},
    enable: {},
    disable: {},
    ticket: {},
    closeticket: {},
    eval: {},
    sus: {},
    readdata: {},
    reco: {},
    returnemoji: {},
}

const tickets = {
    activeTickets: {}
}

//Setup

Object.keys(commands).forEach(cmd => {
    commands[cmd].devOnly = false;
    commands[cmd].isVisible = true;
})

//commands
{
    commands.helpold.isVisible = false;
    commands.helpold.usage = `${config.prefix}helpOld [command]`;
    commands.helpold.callback = (message, arguments) => {
        var output = ""
        if(arguments.length == 0) {
            output += "[] indicate optional parameters \n <> indicate compulsory parameters \nCommands Available: \n"
            Object.keys(commands).forEach(e => {if(!commands[e].devOnly) output += `${e}, `})
        } else {
            output += (commands[arguments[0]].usage) ? `Syntax: ${commands[arguments[0]].usage}` : "Command does not exist"
        }
        message.channel.send(output);
    }

    commands.help.usage = `${config.prefix}help [command]`;
    commands.help.callback = (message, arguments) => {
        if(arguments.length == 0) {

            let cmds = [];
            Object.keys(commands).forEach(c => {
                if(commands[c].isVisible) {
                    cmds.push({name: `${c}`, value: `${commands[c].usage}`});
                }
            })

            let out = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle("List of commands")
            .setAuthor("Help", client.user.avatarURL())
            .addFields(cmds)
            .setTimestamp()
            .setFooter(config.botName, client.user.avatarURL());

            message.channel.send(out);

        } else {

            if(Object.keys(commands).includes(arguments[0])) {
                if(commands[arguments[0]].isVisible) {

                    let out = new Discord.MessageEmbed()
                    .setColor(config.embedColour)
                    .setTitle(`Usage of ${arguments[0]}`)
                    .setAuthor("Help", client.user.avatarURL())
                    .addField("<> indicate compulsory parameters and [] indicate optional parameters", commands[arguments[0]].usage)
                    .setTimestamp()
                    .setFooter(config.botName, client.user.avatarURL());

                    message.channel.send(out);
                } else {
                        let out = new Discord.MessageEmbed()
                    .setColor(config.embedColour)
                    .setTitle("Oops!")
                    .setAuthor("Help", client.user.avatarURL())
                    .addField("Couldn't find that command", `That command does not exist! Type \`${config.prefix}help\` for a list of commands`)
                    .setTimestamp()
                    .setFooter(config.botName, client.user.avatarURL());
                    message.channel.send(out);
                }
            } else {
                let out = new Discord.MessageEmbed()
                .setColor(config.embedColour)
                .setTitle("Oops!")
                .setAuthor("Help", client.user.avatarURL())
                .addField("Couldn't find that command", `That command does not exist! Type \`${config.prefix}help\` for a list of commands`)
                .setTimestamp()
                .setFooter(config.botName, client.user.avatarURL());
                message.channel.send(out);
            }

        }
    }

    commands.say.usage = `${config.prefix}say <message>`;
    commands.say.callback = (message, arguments) => {
        message.channel.send(arguments.join(' '));
        message.delete();
    }

    commands.createrole.usage = `${config.prefix}createrole <hex colour> <separate(Y/N)> <mentionable(Y/N)> <role name>`;
    commands.createrole.callback = (message, arguments) => {
        const executor = message.member;
        if(executor.hasPermission('MANAGE_ROLES')) {

            var hexcolor_ = arguments[0];
            var hoist_ = (arguments[1].toLowerCase() == "y") ? true : false;
            var mentionable_ = (arguments[2].toLowerCase() == "y") ? true : false;
            var name_ = arguments.slice(3, arguments.length).join(' ');

            message.guild.roles
            .create({
                data: {
                    hexcolor: hexcolor_, 
                    hoist: hoist_, 
                    mentionable: mentionable_,
                    name: name_
                }
            })
            .then(() => {message.reply("Successfully created the role")})
            .catch(err => {message.channel.send("Something went wrong. Do I have proper permissions?")})
        }
    }   

    commands.deleterole.usage = `${config.prefix}deleterole <role name>`;
    commands.deleterole.callback = (message, arguments) => {
        const executor = message.member;
        if(executor.hasPermission('MANAGE_ROLES')) {
            message.guild.roles.cache.forEach(role => {if(role.name == arguments.join(' ')) role.delete()})
        }
    }

    commands.listroles.usage = `${config.prefix}listroles`;
    commands.listroles.callback = (message, arguments) => {
        var roleNames = []
        //output += `${Object.keys(message.guild.roles.cache).length} roles exist in this server. \n`
        message.guild.roles.cache.forEach(role => {if(role.name != "@everyone") roleNames.push(`${role.name}`)})
        message.channel.send(`${roleNames.length} roles exist in this server. \n${roleNames.join(', ')}`);
    }

    commands.kick.usage = `${config.prefix}kick @user [reason]`;
    commands.kick.callback = (message, arguments) => {
        const executor = message.member;
        if(executor.hasPermission('KICK_MEMBERS')) {

            const user = message.mentions.users.first();
            if(user) {

                const member = message.guild.member(user);
                if(member) {

                    const reason = arguments.slice(1, arguments.length + 1).join(" ");
                    const kickReason = ("" == reason) ? "No reason given" : reason;
                    member
                    .kick(kickReason)
                    .then(() => {message.reply(`Successfully kicked ${user.tag}.`)})
                    .catch((err) => {message.reply('Failed to kick the user.'); console.log(err)})
                } else {
                    message.reply("This user isn't in the server.")
                }
            } else {
                message.reply("Please mention a user to kick")
            }
        } else {
            message.reply("You dont have permission to kick.")
        }     
    }

    commands.ban.usage = `${config.prefix}ban @user [reason]`;
    commands.ban.callback = (message, arguments) => {
        const executor = message.member;
        if(executor.hasPermission('BAN_MEMBERS')) {

            const user = message.mentions.users.first();
            if(user) {

                const member = message.guild.member(user);
                if(member) {

                    const reason = arguments.slice(1, arguments.length + 1).join(" ");
                    const banReason = ("" == reason) ? "No reason given" : reason;
                    member
                    .ban({reason: banReason})
                    .then(() => {message.reply(`Successfully banned ${user.tag}.`)})
                    .catch((err) => {message.reply('Failed to ban the user.'); console.log(err)})
                } else {
                    message.reply("This user isn't in the server.")
                }
            } else {
                message.reply("Please mention a user to ban")
            }
        } else {
            message.reply("You dont have permission to ban.")
        }     
    }

    commands.joke.usage = `${config.prefix}joke`;
    commands.joke.callback = (message, arguments) => {
        const theJoke = assets.jokes[Math.floor(Math.random() * assets.jokes.length)]
        message.channel.send(theJoke);
    }

    commands.roast.usage = `${config.prefix}roast`;
    commands.roast.callback = (message, arguments) => {
        const theRoast = assets.insults[Math.floor(Math.random() * assets.insults.length)]
        message.channel.send(theRoast);
    }

    commands.compliment.usage = `${config.prefix}compliment`;
    commands.compliment.callback = (message, arguments) => {
        const theCompliment = assets.compliments[Math.floor(Math.random() * assets.compliments.length)]
        message.channel.send(theCompliment);
    }

    commands.avatar.usage = `${config.prefix}avatar`;
    commands.avatar.callback = (message, arguments) => {
        message.channel.send(message.author.displayAvatarURL())
    }

    commands.mute.usage = `Not implemented yet`;
    commands.mute.callback = (message, arguments) => {
        message.channel.send("I havent coded this yet")
    }

    commands.typebattle.usage = `${config.prefix}fight <@mention>`;
    commands.typebattle.callback = (message, arguments) => {
        const user1 = message.author;
        const user2 = message.mentions.users.first();
        var sentence = assets.sentences[Math.floor(Math.random() * assets.sentences.length)];
        
        if(user1 && user2) {

        if(user1.id == user2.id) {
            message.channel.send("You cannot fight youself!");
            return;
        }
        if(user2.bot) {
            message.channel.send("You cannot fight a bot!");
            return;
        }
        
            const collector_ = message.channel.createMessageCollector(
                (m) => m.author.id == user2.id && m.content.toLowerCase() == "ready",
                {time: 20000, idle: 20000, dispose: true}
            )
            
            let hasStarted = false;

            message.channel.send(`${user2.toString()} type \`ready\` to begin! You have 20 seconds to respond.`);

            collector_.on("collect", m_ => {

                hasStarted = true;
                message.channel.send(`Retype this sentence!! \n*${sentence}*`);

                const filter = (m) => m.author.id == user1.id || m.author.id == user2.id;

                const collector = message.channel.createMessageCollector(filter, {time: 30000, idle: 30000, dispose: true})

                collector.on("collect", m => {
                    if(m.content.toLowerCase() == sentence.toLowerCase()) {
                        message.channel.send(`<a:PartyParrotHD:744953171285246023> ${m.author} wins! <a:PartyParrotHD:744953171285246023>`);
                        collector.stop()
                        collector_.stop()

                        servers[message.guild.id].config.money[m.author.id] += Math.floor(Math.random() * 10) + 2;
                        regenEcoData(m.guild.id);
                        message.channel.send(`${m.author.toString()} won 10 ${servers[message.guild.id].config.currency}.`);
                    }
                })

                collector.on("end", (collected, reason) => {
                    //message.channel.send(`You guys sent a total of ${collected.size} sentences.`)
                    if(reason == "time") {
                        message.channel.send("You ran out of time!")
                    }
                })
            })

            collector_.on("end", (collected, reason) => {
                if(reason == "time" && !(hasStarted)) {
                    message.channel.send("The person challenged didnt respond in time!");
                }
            })
        } else {
            message.channel.send("Please mention a user!");
        }
    }

    commands.addmoney.usage = `${config.prefix}addmoney <@mention> <amount>`;
    commands.addmoney.callback = (message, arguments) => {
        if(message.member.hasPermission("MANAGE_GUILD")) {
            let money = servers[message.guild.id].config;
            let toAdd = parseFloat(arguments[1]);
            let recipient = message.mentions.users.first();
            

            if(recipient !== undefined && !isNaN(toAdd)) {
                if(recipient.bot) {
                    message.channel.send("Cannot add to a bot's balance!");
                    return;
                }
                money.money[recipient.id] += toAdd;
                regenEcoData(message.guild.id);
                message.channel.send(`Sucessfully added ${toAdd} to ${recipient.username}'s balance! They now have ${money.money[recipient.id]} ${money.currency}!`);
            } else {
                message.channel.send(`Invalid parameters! Use **${config.prefix}help addmoney** for usage info.`);
            }
        } else {
            message.channel.send("You're not allowed to do that!");
        }
    }

    commands.balance.usage = `${config.prefix}balance [@mention]`;
    commands.balance.callback = (message, arguments) => {
        let self = true;  //whos balance is being checked self -> true, other -> false
        let target;

        if(message.mentions.users.first() !== undefined) {
            target = message.mentions.users.first();
            self = false;
        } else {
            target = message.author;
        }

        if(target.bot) {
            message.channel.send("Bots do not have balances!");
            return;
        }

        let bal = `${servers[message.guild.id].config.money[target.id]}`;
        if(bal && bal !== "undefined") {
            const You_or_other_person_has_or_have = (self) ? "You have" : `${target.username} has`;
            message.channel.send(`${You_or_other_person_has_or_have} ${bal} ${servers[message.guild.id].config.currency}`);
        } else {
            message.channel.send("Something went wrong! Blame Oofus!");
        }
    }

    commands.pay.usage = `${config.prefix}pay <@mention> <amount>`;
    commands.pay.callback = (message, arguments) => {
        let money = servers[message.guild.id].config;
        let toAdd = parseFloat(arguments[1]);
        let recipient = message.mentions.users.first();
        

        if(recipient !== undefined && !isNaN(toAdd)) {
            if(recipient.bot) {
                message.channel.send("Cannot send money to a bot!");
                return;
            }
            let sendersBal = money.money[message.author.id];
            if(sendersBal - toAdd >= 0) {
                money.money[recipient.id] += toAdd;
                money.money[message.author.id] -= toAdd;
                regenEcoData(message.guild.id);
                message.channel.send(`Sucessfully sent ${toAdd} to ${recipient.username}! They now have ${money.money[recipient.id]} ${money.currency}!`);
            } else {
                message.channel.send(`You dont have this much money! You need ${toAdd - sendersBal} more ${money.currency}!`)
            }
        } else {
            message.channel.send(`Invalid parameters! Use **${config.prefix}help addmoney** for usage info.`);
        }
    }

    commands.beg.peopleNames = [
        'Jesus', 'Notch', 'Keanu Reeves', 'Sans', 'Mario', 'Papyrus', 'Zeus', 'Poseidon', 
        'Alexander', 'Pewdewpie', 'Davie504', 'Mother Teresa', 'Elon Musk', 'Steve Jobs', 
        'Mark Zuckerberg', 'A random mammoth', 'Yanderedev', 'Donald Trump'];
    commands.beg.usage = `${config.prefix}beg`;
    commands.beg.callback = (message, arguments) => {
        let person = commands.beg.peopleNames[Math.floor((Math.random() * commands.beg.peopleNames.length) + 1)];
        let amount = Math.floor(Math.random() * 8) + 2;
        let outStr = `${person} gave you ${amount} ${servers[message.guild.id].config.currency}!`;

        servers[message.guild.id].config.money[message.author.id] += amount;
        regenEcoData(message.guild.id);
        message.channel.send(outStr);
    }

    commands.enable.usage = `${config.prefix}enable <command>`;
    commands.enable.callback = (message, arguments) => {
        const executor = message.member;
        if(executor.hasPermission("MANAGE_GUILD")) {

            if(arguments[0] == "all") {
                Object.keys(commands).forEach(c => {
                    servers[message.guild.id].config.serverCommands[c] = true;
                })
                regenConfigData(message.guild.id);
                return;
            }

            if(!Object.keys(commands).includes(arguments[0])) {
                message.channel.send("Invalid command name!");
            } else {
                let command = arguments[0];
                servers[message.guild.id].config.serverCommands[command] = true;
                regenConfigData(message.guild.id);
            }      
        } else {
            message.channel.send("Not enough permissions");
        }
    }

    commands.disable.usage = `${config.prefix}disable <command>`;
    commands.disable.callback = (message, arguments) => {
        const executor = message.member;
        if(executor.hasPermission("MANAGE_GUILD")) {
            if(!Object.keys(commands).includes(arguments[0])) {
                message.channel.send("Invalid command name!");
            } else {
                let command = arguments[0];
                servers[message.guild.id].config.serverCommands[command] = false;
                regenConfigData(message.guild.id);
            }      
        } else {
            messages.channel.send("Not enough permissions");
        }
    }

    commands.eval.isVisible = false;
    commands.eval.devOnly = true;
    commands.eval.usage = `No need for you to know.`;
    commands.eval.callback = (message, arguments) => {
            eval(arguments.join(' '));
    }

    commands.sus.isVisible = false;
    commands.sus.devOnly = true;
    commands.sus.usage = `Yes`;
    commands.sus.callback = (message, arguments) => {
        //Make separate economy and config channels before running this
        const guildExists = servers[message.guild.id] !== undefined;
        if(guildExists) {
            const configChannel = message.guild.channels.cache.get(servers[message.guild.id].configID);

            let configStr = [];
            Object.keys(commands).forEach(cmd => {
                if (!commands[cmd].devOnly) {
                    configStr.push(`${cmd}::1`);
                }
            })
            configStr.push("////");
            configStr = configStr.join("&&&");

            //configChannel.send(configStr);

            configChannel.messages.fetch()
            .then(m => {
                if(m.first() !== undefined) {m.first().delete()};
                configChannel.send(configStr);
            })
        }
    }

    commands.reco.isVisible = false;
    commands.reco.devOnly = true;
    commands.reco.usage = `Yes`;
    commands.reco.callback = (message, arguments) => {
        const economyChannel = message.guild.channels.cache.get(servers[message.guild.id].economyID);
        const members = message.guild.members.cache.array();
        /*
        let ecoStr = [];

        members.forEach(mem => {
            if(!mem.bot) {
                servers[message.guild.id].config.money[mem.id] = 0;
                ecoStr.push(`${mem.id}::0`);
            }
        })
        ecoStr.push("////");
        ecoStr = ecoStr.join("&&&");

        economyChannel.messages.fetch()
        .then(m => {
            if(m.first() !== undefined) {m.first().delete()};
            economyChannel.send(ecoStr);
        })
        */

        let ecoMsgs = [];
        let memberChunks = splitArray(members, 30);
        memberChunks.forEach(memChunk => {
            let ecoStr = []
            memChunk.forEach(mem => {
                if(!mem.bot) {
                    servers[message.guild.id].config.money[mem.id] = 0;
                    ecoStr.push(`${mem.id}::0`);
                }
            })
            ecoStr.push("////");
            ecoStr = ecoStr.join("&&&");
            ecoMsgs.push(ecoStr);
        })

        economyChannel.messages.fetch()
        .then(messages => {
            messages.forEach(message => {
                message.delete();
            })
        })

        ecoMsgs.forEach(m => {
            economyChannel.send(m);
        })
    }

    commands.readdata.isVisible = false;
    commands.readdata.devOnly = true;
    commands.readdata.usage = `${config.prefix}readdata`;
    commands.readdata.callback = (message, arguments) => {
        readData();
    }

    commands.returnemoji.isVisible = false;
    commands.returnemoji.devOnly = true;
    commands.returnemoji.usage = `${config.prefix}returnemoji <emote>`;
    commands.returnemoji.callback = (message, arguments) => {
        message.channel.send(message.content);
    }

    commands.ticket.usage = `${config.prefix}ticket <reason>`;
    commands.ticket.callback = (message, arguments) => {
        //get ticket category
        let ticket_category = message.guild.channels.cache.find(ch => ch.name.toLowerCase() == config.ticket_name && ch.type == "category");

        //create the ticket channel
        let ticketID = Math.floor(Math.random() * 100000);
        let reason = arguments.join(" ");
        if(reason == "") {reason = "No reason provided"}

        while(Object.keys(tickets.activeTickets).includes(ticketID)) {
            ticketID = Math.floor(Math.random() * 100000);
        } //gets rid of duplicate ticket ids

        message.guild.channels.create(`ticket-${ticketID}`, {
            type: "text",
            topic: `Ticket id <${ticketID}>. Ticket support team is on their way!`,
            parent: ticket_category
        })
        .then(ch => {
            ch.lockPermissions()
            .then(ch_ => {
                ch_.updateOverwrite(message.author, {
                    'SEND_MESSAGES': true,
                    'EMBED_LINKS': true,
                    'ATTACH_FILES': true,
                    'VIEW_CHANNEL': true
                   })
            })

            let out = new Discord.MessageEmbed()
            .setColor(config.embedColour)
            .setTitle(`Ticket-${ticketID}`)
            .setAuthor(message.member.nickname == null ? message.author.username : message.member.nickname)
            .addField("Reason", reason)
            .addField("How do i close the ticket?", `Simply type \`${config.prefix}closeTicket\` to close the ticket`)
            .setTimestamp()
            .setFooter(config.botName, client.user.avatarURL());

            ch.send(out);       //send info embed
            //ch.send(message.guild.roles.cache.find(r => r.name === config.ticketRoleName).toString());    //Ping staff
            ch.send(`<@${message.author.id}>`);        //Ping ticket creator
            message.channel.send(
                new Discord.MessageEmbed()
                .setTitle("Successfully created a ticket!")
                .setColor(config.embedColour)
                )

            tickets.activeTickets[ticketID] = message.author.id;

            console.log(`New ticket opened by ${message.author.username} (${message.author.id}). Ticket ID: ${ticketID}. Reason: ${reason}`);
        })
        .catch(e => {
            console.error(e);
            message.channel.send("Something went wrong. Do I have permissions to create a channel?");
        })

    }

    commands.closeticket.isVisible = false;
    commands.closeticket.usage = `${config.prefix}closeTicket \n *Only usable in ticket channels*`;
    commands.closeticket.callback = (message, arguments) => {
        if(message.channel.parent.name === config.ticket_name) {

            let ticketID = message.channel.name.split("-")[1];
            message.channel.delete(`Ticket closed by ${message.author.username}`)
            .then(c => {
                let troubledPerson = message.guild.members.cache.get(tickets.activeTickets[ticketID])

                if(troubledPerson !== undefined) {
                    //troubledPerson.send(`Your support ticket in ${message.guild.name} was closed by ${message.author.username}.`)

                    let out = new Discord.MessageEmbed()
                    .setColor(config.embedColour)
                    .setTitle(`Support ticket closed in ${message.guild.name}`)
                    .setAuthor(`Ticket id - ${ticketID}`)
                    .addField("Ticket closed by", message.author.username)
                    .setTimestamp()
                    .setFooter(config.botName, client.user.avatarURL())

                    troubledPerson.send(out);
                }

                delete tickets.activeTickets[ticketID];
            })
        }
    }

}

//client events
client.on("ready", () => {
    console.log("Bot is up.");
    console.log(`Operating in ${client.guilds.cache.size} guilds with ${client.users.cache.size} users.`)
    client.user.setActivity(`YOU. ${config.prefix}help`, { type: "WATCHING" });
    readData();
    client.guilds.cache.each( guild => {
        checkTicketSetup(guild);
    })
})

client.on("guildCreate", guild => {
    console.log(`Joined a new server named ${guild.name}. Server id: ${guild.id}`);
    setTimeout(() => {checkTicketSetup(guild)}, 10000);
})

client.on("guildDelete", guild => {
    console.log(`Removed from a server named ${guild.name}. Server id: ${guild.id}`);
})

client.on("guildMemberAdd", member => {
    regenEcoData(member.guild);
})

client.on("guildMemberRemove", member => {
    regenEcoData(member.guild);
})

client.on("message", message => {
    if(message.author.bot) return;
    if(!message.guild) return;

    let arguments = shearEmpty(message.content.trim().split(" "));
    let command;
    if(arguments[0] !== undefined) {  //I have to check for this now because shearEmpty can return empty arrays for system join messages
        command = arguments[0].toLowerCase();
    } else {
        command = "";
    }
    arguments.shift();
    //arguments is now an array of parameters of the command

    if(command.startsWith(config.prefix)) {
        command = command.substring(config.prefix.length);
        
        if(Object.keys(commands).includes(command)) {
            if(commands[command].devOnly && !devs.includes(message.author.id)) {
                message.channel.send("You're not authorized!");
            } else {
                if(servers[message.guild.id].config.serverCommands[command] !== undefined) {
                    if(servers[message.guild.id].config.serverCommands[command] == true) {
                        commands[command].callback(message, arguments);
                    } else {
                        message.channel.send("This command is disabled.")
                    }
                } else {
                    commands[command].callback(message, arguments);
                }
            }
        } else {
            message.reply("Oops! Did you make a typo? You can type **" + config.prefix + "help** if you need help.");
        }
    };
})


//utility functionss
    let readData = () => {
        Object.keys(servers).forEach(serverID => {
            let cnf = client.channels.cache.get(servers[serverID].configID);  //servers[serverID].configID is a string
            let eco = client.channels.cache.get(servers[serverID].economyID);

            //read and generate config
            //var m_ = cnf.messages.cache.last().content;
            
            cnf.messages.fetch()
            .then(m => {
                let m_ = m.first().content;
                let sections = m_.split("////");
                let allCmd = sections[0].split("&&&");
                allCmd.forEach(e => {
                    let elms = e = e.split("::");
                    const command = elms[0];
                    const value = (elms[1] == "1") ? true : false;
                    //console.log(`${command}, ${value}`);
    
                    servers[serverID].config.serverCommands[command] = value;
                })
                console.log(`Successfully stored config data for ${serverID} - ${client.guilds.cache.get(serverID).name}`);
            })
            .catch(err => {
                console.log(err);
            })

            /*
            eco.messages.fetch()
            .then(m => {
                let m_ = m.first().content;
                let sections = m_.split("////");
                let allMoney = sections[0].split("&&&");
                allMoney.forEach(e => {
                    let elms = e = e.split("::");
                    const memberID = elms[0];
                    const money = parseFloat(elms[1]);
                    //console.log(`${command}, ${value}`);
    
                    servers[serverID].config.money[memberID] = money;
                })
                console.log(`Successfully stored economy data for ${serverID}`);
                */

            eco.messages.fetch()
            .then(m => {
                m.each(m_ => {
                    if(m_.author.id == client.user.id) {
                        let sections = m_.content.split("////");
                        let allMoney = sections[0].split("&&&");
                        allMoney.forEach(e => {
                            let elms = e.split("::");
                            const memberID = elms[0];
                            const money = parseFloat(elms[1]);

                            servers[serverID].config.money[memberID] = money;
                        })
                    }
                })
                console.log(`Successfully stored economy data for ${serverID} - ${client.guilds.cache.get(serverID).name}`);
            })
            .catch(err => {
                console.log(err);
            })

        })
    }

    let regenConfigData = (serverID) => {
        let c = servers[serverID].config.serverCommands;
        let out = [];
        Object.keys(c).forEach(cmd => {
            let val = (c[cmd]) ? "1" : "0";
            out.push(`${cmd}::${val}`)
        })
        out.push("////");
        out = out.join("&&&");

        let cnfChannel = client.channels.cache.get(servers[serverID].configID);
        cnfChannel.messages.fetch()
        .then(m => {
            if(m.first() !== undefined) {m.first().delete()};
            cnfChannel.send(out);
        })
    }

    let regenEcoData = (serverID) => {
        let ecoChannel = client.channels.cache.get(servers[serverID].economyID);

        let ecoMsgs = [];
        let chunks = []

        Object.keys(servers[serverID].config.money).forEach(memID => {
            ecoMsgs.push(`${memID}::${servers[serverID].config.money[memID]}`);
        })

        ecoMsgs = splitArray(ecoMsgs, 30);

        ecoMsgs.forEach(chunk => {
            chunks.push(chunk.join("&&&"));
        })

        ecoChannel.messages.fetch()
        .then(messages => {
            let currentChunk = 0
            messages.each(m => {
                if(m.author.id == client.user.id) {
                    m.edit(chunks[currentChunk]);
                    currentChunk++;
                }
            })
        })
        /*
        let ecoStr = [];
        let money = servers[serverID].config.money;

        Object.keys(money).forEach(mem => {
            ecoStr.push(`${mem}::${money[mem]}`);
        })
        ecoStr.push("////");
        ecoStr = ecoStr.join("&&&");

        let msg = ecoChannel.messages.fetch()
        .then(m => {
            m.first().edit(ecoStr);
        })
        .catch(e => {
            console.error(`Could not modify money data:\n${e}`);
        })
        */
    }

    let splitArray = (array, size) => {
        if(isNaN(size)) return null;
        if(size == 0 || size % 1 !== 0) return null;
        if(array.length == 0) return null;

        let out = []
        for(i = 0; i <= Math.ceil(array.length % size); i++) {
            out.push(array.splice(0, size));
        }

        return out;
    }

    let shearEmpty = (arr) => {
        let out = [];
        arr.forEach( e => {
            if(e !== "") {out.push(e)}
        })
        return out;
    }

    function checkTicketSetup(guild) {

        let tRole = guild.roles.cache.find(r => r.name === config.ticketRoleName);
    
        if(tRole == undefined) {
            guild.roles.create({
                data: {
                    name: config.ticketRoleName,
                    hoist: true,
                    mentionable: true,
                    color: "#31eb63"
                },
                reason: "Ticket Support role"
            }).then(r => {
                console.log(`Created ticket support role for ${guild.name} - ${guild.id}`);
                tRole = r;
            })
        } //create the Ticket Support Role
    
    
        if(guild.channels.cache.find(ch => ch.name.toLowerCase() == config.ticket_name && ch.type == "category") == undefined) {
            guild.channels.create(config.ticket_name, {
                type: "category"
            })
            .then(category => { //disable view for @everyone
                category.createOverwrite(guild.roles.everyone, {
                    VIEW_CHANNEL: false
                })
                .then(category_ => {
                    //enable view for Ticket Support
                    category_.createOverwrite(tRole, {
                        VIEW_CHANNEL: true
                    })
                })
                .catch(e => {
                    console.log("Couldnt change permissions for ticket category")
                })
            })
            .catch(e => {
                console.log("Couldnt create category");
            })
        }
    }

client.login(process.env.token);
//client.login(config.token);