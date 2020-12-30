///bug pt jobs.json initial. Cum fac sa il iau de pe site?
///bug pt rearanjarea jobs.json a.i. joburile sa fie ordonate dupa tara si oras
///but pt nrOrd(nu merge pt mai multe persoane)
///bug pt nrOrd atunci cand inchid si deschid botul

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
let w = data.jobs, x = data.jobs, y = data.jobs;


///sortez
function compare(i, j){
    let compareCountry, compareCity;
    compareCountry = w[i].country.localeCompare(w[j].country);
    compareCity = w[i].city.localeCompare(w[j].city);

    if (compareCountry == 0){
        if (compareCity >= 0) return false;
        return true;
    }
    else if (compareCountry >= 0) return false;
    return true;
}


function interclasare(st, dr, mij){
    let aux = [], i, j;
    i = st;
    j = mij + 1;
    while(i <= mij && j <= dr){
        if(compare(i, j)) aux.push(w[i]), ++i;
        else aux.push(w[j]), ++j;
    }

    while(i <= mij)aux.push(w[i]), ++i;
    while(j <= dr)aux.push(w[j]), ++j;

    j = 0;
    for(i = st; i <= dr; ++i)
        w[i] = aux[j++];
}

function merge_sort(st, dr){
    if(st == dr)
        return;
    else if(st < dr){
        let mij;
        if((st + dr) & 1) mij = (st + dr - 1) / 2;
        else mij = (st + dr) / 2;
        merge_sort(st, mij);
        merge_sort(mij + 1, dr);
        interclasare(st, dr, mij);
    }
}

let i;

///dupa tara si oras
merge_sort(0, w.length - 1);//(0. w.length - 1, 1);
/*
///dupa job
merge_sort(0, w.length - 1, 2);
///dupa firma
merge_sort(0, w.length - 1, 3);*/


///fac copie la json ca sa nu il pierd

/*try{
     fs.copyFileSync('jobs.json', `copyjobs.json`)
} catch (err){
    console.log(err);
}*/


///rescriu json
/*try{
    fs.writeFileSync(`jobs.json`, String.raw`{"jobs":[`)
} catch (err){
   console.log(err);
}*/

try{
    fs.writeFileSync('j.txt', ``)
} catch (err){
   console.log(err);
}


let countryStart = {}, cityStart = {};

///pentru 0
/*try{
    fs.appendFileSync('jobs.json', String.raw`{"company":"${w[0].company}","title":"${w[0].title}", "city":"${w[0].city}", "country":"${w[0].country}", "link":"${w[0].link}"}`)
} catch (err){
   console.log(err);
}*/

let info = `Company:${w[0].company} \nTitle:${w[0].title} \nCity:${w[0].city} \nCountry:${w[0].country} \nLink:${w[0].link} \n\n`;
try{
    fs.appendFileSync('j.txt', info)
} catch (err){
   console.log(err);
}

countryStart[`${w[0].country}`] = 0; //countryOrder.[push(w[0].country)];
cityStart[`${w[0].city}`] = 0; //cityOrder.push(w[0].city);

//console.log(countryOrder);


for(i = 1; i < w.length; ++i){

    if (countryStart[`${w[i].country}`] == undefined){
        countryStart[`${w[i].country}`] = i;
    }
    
    if (cityStart[`${w[i].city}`] == undefined){
        cityStart[`${w[i].city}`] = 0;
    }
        
    //w[i].city = w[i].city.slice(3);
    /*try{
        fs.appendFileSync('jobs.json', String.raw`,{"company":"${w[i].company}","title":"${w[i].title}", "city":"${w[i].city}", "country":"${w[i].country}", "link":"${w[i].link}"}`)
    } catch (err){
       console.log(err);
    }*/

    let info = `Company:${w[i].company} \nTitle:${w[i].title} \nCity:${w[i].city} \nCountry:${w[i].country} \nLink:${w[i].link} \n\n`;
    try{
        fs.appendFileSync('j.txt', info)
    } catch (err){
       console.log(err);
    }

}

//console.log(Object.keys(cityStart).length);
//console.log(Object.keys(countryStart).length);


/*try{
    fs.appendFileSync('jobs.json', String.raw`]}`)
} catch (err){
   console.log(err);
}*/

//console.log(w);

//console.log(w[1].link);


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

///idOrder[id] = pozitia id ului in userDataArray
///in userdata.json am valorile vechi ale lui userDataArray si ale lui idOrder
const oldArray = require(`./userdata.json`);
let userDataArray = oldArray.userDataArray, idOrder = oldArray.idOrder;

try{
    fs.copyFileSync('./userdata.json', `./userdatacopy.json`);
} catch (err){
   console.log(err);
}
//let searchCity, searchCountry, searchTitle, searchCompany, currentJobPosition = 0;

function idVerification(idToBeVerified){///binarySearch
    let st, dr, mij;
    st = 0, dr = userDataArray.length - 1;
    while(st <= dr){
        if((st + dr) & 1) 
            mij = (st + dr - 1) / 2;
        else mij = (st + dr) / 2;
        if(idToBeVerified == userDataArray[mij].id)
            return true;
        else if(idToBeVerified > userDataArray[mij].id)
            st = mij + 1;
        else dr = mij - 1;
    }
    
    return false;
}

function addId(idToBeAdded){///bruta
    let i = userDataArray.length - 1;
    while(i >= 0 && idToBeAdded < userDataArray[i].id){
        userDataArray[i+1] = userDataArray[i];
        idOrder[`${userDataArray[i].id}`]++;
        --i;
    }
    userDataArray[i+1] = new userData(idToBeAdded, null, null, null, null, 0);
    idOrder[`${idToBeAdded}`] = i + 1;
}

function copyInUserData(){

    try{
        fs.writeFileSync('userdata.json', String.raw`{"userDataArray":[`);
    } catch (err){
       console.log(err);
    }

    let i;
    ///fac pentru 0
    try{
        fs.appendFileSync('userdata.json', String.raw`{"id":${userDataArray[0].id},"searchCity":"${userDataArray[0].searchCity}","searchCountry":"${userDataArray[0].searchCountry}","searchTitle":"${userDataArray[0].searchTitle}","searchCompany":"${userDataArray[0].searchCompany}","currentJobPosition":${userDataArray[0].currentJobPosition}}`);
    } catch (err){
       console.log(err);
    }

    for(i = 1; i < userDataArray.length; ++i){
        try{
            fs.appendFileSync('userdata.json', String.raw`,{"id":${userDataArray[i].id},"searchCity":"${userDataArray[i].searchCity}","searchCountry":"${userDataArray[i].searchCountry}","searchTitle":"${userDataArray[i].searchTitle}","searchCompany":"${userDataArray[i].searchCompany}","currentJobPostion":${userDataArray[i].currentJobPosition}}`);
        } catch (err){
           console.log(err);
        }
    }

    try{
        fs.appendFileSync('userdata.json', String.raw`],"idOrder":{"${userDataArray[0].id}":0`);
    } catch (err){
       console.log(err);
    }

    for(i = 1; i < idOrder.length; ++i){
        try{
            fs.appendFileSync('userdata.json', String.raw`,"${userDataArray[i].id}":${i}`);
        } catch (err){
           console.log(err);
        } 
    }

    try{
        fs.appendFileSync('userdata.json', String.raw`}}`);
    } catch (err){
       console.log(err);
    }
}

client.on('message', (message) => {
    if(message.author.bot)
        return ;
    if(!idVerification(message.author.id)){
        addId(message.author.id);
        copyInUserData();
    }

    if(message.content == `${prefix}help`){
        message.author.send(`${prefix}help - ajutor \n${prefix}jobs - informatii despre nr total de joburi si filtrele active de cautare \n${prefix}next - afiseaza urmatoarele 5 jobuti cu filtrele specificate`);
    }
    if(message.content == `${prefix}jobs`){
        message.author.send(`Momentan sunt ${w.length} joburi disponibile in ${Object.keys(countryStart).length} tari si ${Object.keys(cityStart).length} orase.\nFiltrele de cautare sunt:\nCompany - ${userDataArray[idOrder[message.author.id]].searchCompany} \nTitle - ${userDataArray[idOrder[message.author.id]].searchTitle} \nCity - ${userDataArray[idOrder[message.author.id]].searchCity} \nCountry - ${userDataArray[idOrder[message.author.id]].searchCountry}`);
        message.author.send(`Pentru a vedea urmatoarele 5 job uri disponibile scrieti comanda ${prefix}next.`);
    }
    else if(message.content == `${prefix}next`){
        console.log(userDataArray);
    console.log(idOrder);
        let k = userDataArray[idOrder[message.author.id]].currentJobPosition;
        let stop = userDataArray[idOrder[message.author.id]].currentJobPosition + 5;

        for(; k < stop && k < w.length; ++ k){
            message.author.send(`Company:${w[k].company} \nTitle:${w[k].title} \nCity:${w[k].city} \nCountry:${w[k].country} \nLink:${w[k].link} \n\n`);
        }

        userDataArray[idOrder[message.author.id]].currentJobPosition = k;
        copyInUserData();
       
    }
})

//console.log(String.raw`(SaaS, Configure\\Price\\Quote, Install Base)","city":"Bangalore","country":"USA","link":"https:\/\/vmware.wd1.myworkdayjobs.com\/VMware\/job\/IND-Karnataka-Bangalore\/Business-System-Analyst_R2015932"},{"company":"VMware","title":"Senior Solution Architect","city":"Beijing","country":"GBR","link":"https:\/\/vmware.w`);

client.login(token);