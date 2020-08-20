const { config } = require("process");

module.exports = {
    objectToText: function(playerObj, breakString) {
        //does not consider arrays
        //This DOES leave a line after loop
        var outputString = "";
        var keys = Object.keys(playerObj);

        keys.forEach(key => {
            var element = playerObj[key]

            if(typeof element == "string") {
                outputString += key;              //add property name
                outputString += ": ";             //add separator
                if(element == "") {outputString += "None"} else {outputString += element;}    //add property value
                outputString += breakString              //change line
                //
            } else if(typeof element == "boolean") {
                outputString += key;
                outputString += ": ";
                if(element) {outputString += "Yes";} else {outputString += "No";}
                outputString += breakString
                //
            } else if(typeof element == "number") {
                outputString += key;
                outputString += ": ";
                outputString += parseFloat(element);
                outputString += breakString
                //
            } else if(typeof element == 'object' && element !== null) {
                outputString += key;
                outputString += ": ";
                outputString += breakString
                outputString += this.objectToText2(element, breakString);
                //
            } else if(typeof element == 'function') {
                outputString += 'function'
                //
            } else {
                outputString += "Something went wrong here... \n";
            }
            outputString += breakString;
        })
        return outputString;
    },
    objectToText2: function(playerObj, breakString) {
        //does not consider arrays
        //This dosent leave a line after loop
        var outputString = "";
        var keys = Object.keys(playerObj);

        keys.forEach(key => {
            var element = playerObj[key]

            if(typeof element == "string") {
                outputString += key;              //add property name
                outputString += ": ";             //add separator
                if(element == "") {outputString += "None"} else {outputString += element;}   //add property value
                outputString += breakString;              //change line
                //
            } else if(typeof element == "boolean") {
                outputString += key;
                outputString += ": ";
                if(element) {outputString += "Yes";} else {outputString += "No";}
                outputString += breakString;
                //
            } else if(typeof element == "number") {
                outputString += key;
                outputString += ": ";
                outputString += parseFloat(element);
                outputString += breakString;
                //
            } else if(typeof element == 'object' && element !== null) {
                outputString += key;
                outputString += ": ";
                outputString += breakString
                outputString += this.objectToText2(element, breakString);
                //
            } else if(typeof element == 'function') {
                outputString += 'function'
                //
            } else {
                outputString += `Something went wrong here... ${breakString}`;
            }
            //outputString += "\n";
        })
        return outputString;
    },
    readData: function(servers, client, config) {
        Object.keys(servers).forEach(serverID => {
            let cnf = client.channels.cache.get(servers[serverID].configID);  //servers[serverID].configID is a string
            let eco = client.channels.cache.get(servers[serverID].economyID);

            //read and generate config
            //var m_ = cnf.messages.cache.last().content;
            
            cnf.messages.fetch()
            .then(m => {
                let m_;
                m.each(msg => {
                    if(msg.author.id == config.id) {
                        m_ = msg.content;
                    }
                })
                //eco.send(m_)
                m_.split("////")[0].split("&&&").forEach(e => {
                    let elms = e = e.split("::");
                    const command = elms[0];
                    const value = (elms[1] == "1") ? true : false;
    
                    servers[serverID].config.commands[command] = value;
                })
            })
            .catch(err => {
                console.log(err);
            })

        })
    }
}