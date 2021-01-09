///de facut baza de date + organizare date
///client pt mongodb
///bot pt discord.js
const {MongoClient} = require('mongodb');


const Discord = require('discord.js');

const bot = new Discord.Client();
const config = require('./config.json');
const token =  config.token;
const prefix = config.prefix;
let nJobs, nCity, nCountry;
nJobs = nCity = nCountry = 1;
--nJobs;
async function main(comm, author = null, message = null){
    const uri = "mongodb+srv://User:<password>@cluster0.ibtvk.mongodb.net/<db>?retryWrites=true&w=majority";
 

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls

        ///se deschide botul
        if(comm == 0){
            await client.db("JobBot").collection("Jobs").drop();
            await client.db("JobBot").createCollection("Jobs");
            ///prelucrare date pt joburi
        
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
        
            for(var i = 0; i < w.length; ++i){

                    w[i].city = w[i].city.toLowerCase();
                    w[i].country = w[i].country.toLowerCase();
                    w[i].title = w[i].title.toLowerCase();
                    w[i].company = w[i].company.toLowerCase();

                if(i != 0){
                 if(w[i].country != w[i-1].country)
                    ++nCountry;
                    if(w[i].city != w[i-1].city)
                  ++nCity;
                    
                }
            
                await client.db("JobBot").collection("Jobs").insertOne(
                    {"company":`${w[i].company}`,"title":`${w[i].title}`,"city":`${w[i].city}`,"country":`${w[i].country}`,"link":`${w[i].link}`}
                );
            }
            nJobs = w.length;
        }
        ///comanda
        else{
            
            ///verific daca exista persoana
            const profile = await client.db("JobBot").collection("Profiles").findOne(
                {id: `${author}`}
            );
            //console.log(profile);
            ///daca nu exista adaug
            if(profile == null){
                await client.db("JobBot").collection("Profiles").insertOne(
                    {"id":`${author}`, "searchCity":null, "searchCountry":null, "searchTitle":null, "searchCompany":null, "currentJobPosition":0}
                );
                profile = {"id":`${author}`, "searchCity":null, "searchCountry":null, "searchTitle":null, "searchCompany":null, "currentJobPosition":0}

            }
            ///afisez filtrele
            if(comm == 1){
                author.send(`Momentan sunt disponibile ${nJobs} joburi in ${nCountry} tari si ${nCity} orase. \nFiltrele cautarii sunt:\n -Company: ${profile.searchCompany}\n -Title: ${profile.searchTitle}\n -City: ${profile.searchCity}\n -Country: ${profile.searchCountry}\n Pentru a afisa urmatoarele 5 joburi dupa aceste filtre de cautare scrite comanda ${prefix}next`);
            }
            ///daca exista afisez urmatoarele joburi
            else if(comm == 2){
                ///caut joburile dupa filtre
                let unfilteredJobs = await client.db("JobBot").collection("Jobs").find(
                    {} 
                ).toArray();

                let filteredJobs = unfilteredJobs.filter((val) => {
                    let ci, co, ti, com;
                    ci = co = ti = com = 1;
                    if(profile.searchCity != null && profile.searchCity != val.city) ci = 0;
                    if(profile.searchCountry != null && profile.searchCountry != val.country) co = 0;
                    if(profile.searchCompany != null && profile.searchCompany != val.company) com = 0;
                    if(profile.searchTitle != null && profile.searchTitle != val.title) ti = 0;
                    return ci & co & ti & com;
                });
                
                console.log(filteredJobs);

                profile.currentJobPosition += 5;
                
                for(let i = profile.currentJobPosition - 5; i < filteredJobs.length && i < profile.currentJobPosition; ++i){
                    author.send(`Job nr. ${i} \nCompany: ${filteredJobs[i].company} \nTitle: ${filteredJobs[i].title} \nCity: ${filteredJobs[i].city} \nCountry: ${filteredJobs[i].country} \nLink: ${filteredJobs[i].link}`);
                }

                if(profile.currentJobPosition >= filteredJobs.length){
                    author.send(`Acestea sunt toate joburile cu filtrele selectate`);
                    await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$set: {currentJobPosition: filteredJobs.length}}
                    );
                }
                else await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$inc: {currentJobPosition: 5}}
                    );
            }
            ///daca se schimba filtrele
            else if(comm == 3){
                if(message.startsWith(`comp`)){
                    await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$set: {currentJobPosition: 0, searchCompany: message.slice(5).toLowerCase()}}
                    );
                    author.send(`Filtrele au fost actualizate`);
                }
                else if(message.startsWith(`title`)){
                    await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$set: {currentJobPosition: 0, searchTitle: message.slice(6).toLowerCase()}}
                    );
                    author.send(`Filtrele au fost actualizate`);
                }
                else if(message.startsWith(`city`)){
                    await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$set: {currentJobPosition: 0, searchCity: message.slice(5).toLowerCase()}}
                    );
                    author.send(`Filtrele au fost actualizate`);
                }
                else if(message.startsWith(`country`)){
                    await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$set: {currentJobPosition: 0, searchCountry: message.slice(8).toLowerCase()}}
                    );
                    author.send(`Filtrele au fost actualizate`);
                }
                else if(message == `reset`){
                    await client.db("JobBot").collection("Profiles").updateOne(
                        {id: `${profile.id}`},
                        {$set: {currentJobPosition: 0, searchCompany: null, searchTitle: null, searchCity: null, searchCountry: null}}
                    );
                    author.send(`Filtrele au fost resetate`);
                }
            }
        }
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}



bot.on('ready', () => {
    console.log('ready!');
})

bot.on('message', (message) => {
    if(message.author == `311383202885271563` && message.content == prefix)
        bot.destroy();
    else if(message.author.bot)
        return ;
    else if(message.author == `311383202885271563` && message.content == `${prefix}rewrite Jobs`)
        main(0).catch(console.error);
    else if(message.content == `${prefix}help`){
        message.author.send(`${prefix}help - ajutor \n${prefix}jobs - informatii despre nr total de joburi si filtrele active de cautare \n${prefix}next - afiseaza urmatoarele 5 joburi cu filtrele specificate \nPentru a schimba filtrele folositi comenzile: \n${prefix}fcomp [nume_companie] \n${prefix}ftitle [nume_job] \n${prefix}fcity [nume_oras] \n${prefix}fcountry [nume_tara] \n${prefix}freset pentru a sterge filtrele`);
    }
    else if(message.content == `${prefix}jobs`){
        main(1, message.author).catch(console.error);
    }
    else if(message.content == `${prefix}next`){
        main(2, message.author).catch(console.error);
    }
    else if(message.content.startsWith(`${prefix}f`)){
        main(3, message.author, message.content.slice(3));
    }
})




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

bot.login(token);
