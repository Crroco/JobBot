///de facut baza de date + organizare date
const Discord = require('discord.js');

const client = new Discord.Client();
const config = require('./config.json');
const token =  config.token;
const prefix = config.prefix;
const fs = require('fs');
client.on('ready', () => {
    console.log('ready!');
})

client.on('message', (message) => {
    if(message.author == `311383202885271563` && message.content == prefix)
        client.destroy();
})


/*
///Andrei + 'fs'
var FetchStream = require("fetch").FetchStream;

var fetch = new FetchStream("http://zimbor.go.ro/api/bot/jobs/");


fetch.on("data", (chunk) => {
    const fs = require('fs');
    fs.writeFile('j.txt', chunk.toString(), (err) => {
    if(err)
    throw err;
})
});*/

///prelucrare date
const data = require('./jobs.json');
let w = data.jobs;

w.sort((a, b) => {
    if(a.country == b.country){
        if(a.city < b.city) return -1;
        else if(a.city == b.city) return 0;
        else return 1;
   }
   else if(a.country < b.country) return -1;
   else return 1
});

//console.log(w);











///afisare date, comenzi
///trebuie sa retin pentru fiecare persoana ce cauta si unde se afla cu cautarea
class userData{
    constructor(id, searchCity, searchCountry, searchTitle, searchCompany, currentJobPosition){
        this.id = id;
        this.searchCity = searchCity;
        this.searchCountry = searchCountry;
        this.searchTitle = searchTitle;
        this.searchCompany = searchCompany;
        this.currentJobPosition = currentJobPosition;
    }
}

//let searchCity, searchCountry, searchTitle, searchCompany, currentJobPosition = 0;

    
client.on('message', (message) => {
    if(message.author.bot)
        return ;
    
    console.log(message.author.id);
    if(message.content == `${prefix}help`){
        message.author.send(`${prefix}help - ajutor \n${prefix}jobs - informatii despre nr total de joburi si filtrele active de cautare \n${prefix}next - afiseaza urmatoarele 5 jobuti cu filtrele specificate`);
    }
    else if(message.content == `${prefix}next`){
        //console.log(userDataArray);
        //console.log(idOrder);
        let k = userDataArray[idOrder[message.author.id]].currentJobPosition;
        let stop = userDataArray[idOrder[message.author.id]].currentJobPosition + 5;

        for(; k < stop && k < w.length; ++ k){
            message.author.send(`Company:${w[k].company} \nTitle:${w[k].title} \nCity:${w[k].city} \nCountry:${w[k].country} \nLink:${w[k].link} \n\n`);
        }

        userDataArray[idOrder[message.author.id]].currentJobPosition = k;
        copyInIdOrder();
        copyInUserDataArray();
    }
    else if(message.content.startsWith(`${prefix}country`)){
        let tara = message.content.slice(10);
        console.log(tara);
        ///
        w.filter((a) => {
            if(a.country == tara)
                console.log(a);
        })
        //console.log(tara);
    }
})

client.login(token);