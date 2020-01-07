(function(){
    const body = document.querySelector('body');
    const header = document.createElement('header');
    const paieskosZodis = document.createElement('input');
    let vietovesUzklausa = new XMLHttpRequest();   //sukuriamas naujas uzklausos objektas
    vietovesUzklausa.onreadystatechange = function () { //callback
        if (vietovesUzklausa.readyState === 4) {   // 4 ir 200 - html status (kaip errorai, F12 - network (isplesti, matomi elementai)
            if (vietovesUzklausa.status === 200) {
                let vietoviuSarasas = JSON.parse(vietovesUzklausa.responseText);  // kintamasis = duomenys is failo/webo
                let div = document.createElement('div');
                header.appendChild(paieskosZodis);
                body.appendChild(header);
                header.style.background = 'lightblue';
                header.appendChild(div).id = 'paieskosSarasas';
                header.style.padding = '1%';
                div.style.position = 'absolute';
                div.style.background = 'lightblue';
                div.style.zIndex= '+1';

                for (let i = 0; 10 > i; i++) {
                    let p = document.createElement('p');
                    document.getElementById('paieskosSarasas').appendChild(p);
                    p.id = 'paieskosRezultatas' + i;
                    p.style.padding = '1%';
                    p.style.width = 'fit-content';
                }

                paieskosZodis.placeholder ='Įveskite vietovės pavadinimą';
                paieskosZodis.onkeyup = addEventListener("keyup", formuotiStulpelius);
                paieskosZodis.oninput = addEventListener("input", lauktiTinkamosVietoves);
                paieskosZodis.onkeydown = addEventListener("keydown", salintiStulpelius);

                function formuotiStulpelius() {
                    let iki10 = 0;
                    for (let i = 0; i<vietoviuSarasas.length; i++) {
                        if (iki10 < 10) {
                            if (vietoviuSarasas[i].code.startsWith(paieskosZodis.value.toLowerCase())) {
                                let paieskosRezultatas = document.getElementById('paieskosRezultatas' + iki10);
                                paieskosRezultatas.innerHTML = vietoviuSarasas[i].code.charAt(0).toUpperCase() + vietoviuSarasas[i].code.slice(1);
                                iki10++;
                            }
                        }
                    }
                }

                function lauktiTinkamosVietoves(){
                    if(vietoviuSarasas.includes(paieskosZodis.value.toLowerCase())){
                        let vietove = paieskosZodis.value.toLowerCase();
                        return vietove;
                    }
                }
                function salintiStulpelius() {
                    for (let i = 0; i < 10; i++) {
                        let paieskosPastraipa = document.getElementById('paieskosRezultatas' + i);
                        paieskosPastraipa.innerHTML = "";
                    }
                }
            } else {
                alert(vietovesUzklausa.statusText); //ismeta alerta
            }
        }
    }
    vietovesUzklausa.open('GET','https://api.meteo.lt/v1/places'); //uzklausa
    //vietovesUzklausa.open('GET','https://api.meteo.lt/v1/places/Kaunas/forecasts/long-term'); //uzklausa
    //vietovesUzklausa.open('GET','https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=2020-01-04')
    vietovesUzklausa.send(); //uzklausos paleidimas

    let vietovesOruUzklausa = new XMLHttpRequest();   //sukuriamas naujas objektas
    vietovesOruUzklausa.onreadystatechange = function () { //callback
        if (vietovesOruUzklausa.readyState === 4) {   // 4 ir 200 - html status (kaip errorai, F12 - network (isplesti, matomi elementai)
            if (vietovesOruUzklausa.status === 200) {
                let duomenys = JSON.parse(vietovesOruUzklausa.responseText);  // kintamasis = duomenys is failo/webo
                let main = document.createElement('main');
                body.appendChild(main);
                let div = document.createElement('div',className = 'prognozeDienai');
                div.style.display = 'flex';
                div.style.flexWrap = 'wrap';
                main.appendChild(div).className = 'prognozeDienai';
                for(let i = 0; duomenys.forecastTimestamps.length>i; i++) {

                    let ul = document.createElement('ul');
                    ul.style.listStyleType = 'none';
                    div.appendChild(ul);

                    let li = document.createElement('li');
                    ul.appendChild(li);
                    li.id = 'li'+i;

                    let inputLaikas = new Date(duomenys.forecastTimestamps[i].forecastTimeUtc);
                    let valanda = inputLaikas.getHours();
                    let laikas = document.createElement('p');
                    if (valanda<10){
                        laikas.innerHTML = '0'+valanda+':00';
                    }
                    else{
                        laikas.innerHTML = valanda+':00';
                    }
                    li.appendChild(laikas).id = 'Time';

                    let oroSalygos = document.createElement('i');
                    let originalusOras = ['clear', 'isolated-clouds', 'scattered-clouds', 'overcast', 'light-rain', 'moderate-rain', 'heavy-rain', 'sleet', 'light-snow', 'moderate-snow', 'heavy-snow', 'fog', 'na'];
                    let originalausOroIndeksas = originalusOras.indexOf(duomenys.forecastTimestamps[i].conditionCode);
                    let dienosOruIMG = ['day-sunny', 'day-sunny-overcast', 'day-sunny-overcast', 'day-cloudy', 'day-showers', 'day-hail', 'day-rain', 'day-sleet', 'day-snow', 'day-snow', 'day-snow', 'day-fog', 'na'];
                    let naktiesOruIMG = ['night-clear', 'night-alt-partly-cloudy', 'night-alt-partly-cloudy', 'night-cloudy', 'night-alt-showers', 'night-alt-rain', 'night-alt-sleet', 'night-alt-snow', 'night-alt-snow', 'night-alt-snow', 'night-alt-fog', 'na'];

                    if (valanda<19&&valanda>3) {
                        li.appendChild(oroSalygos).className = 'wi wi-' + dienosOruIMG[originalausOroIndeksas];
                    }
                    else{
                        li.appendChild(oroSalygos).className = 'wi wi-' + naktiesOruIMG[originalausOroIndeksas];
                    }

                    let oroTemperatura = document.createElement('p');
                    oroTemperatura.innerHTML = duomenys.forecastTimestamps[i].airTemperature + '°C';
                    li.appendChild(oroTemperatura).id = 'airTemperature';

                    let lasoIkona = document.createElement('i');
                    li.appendChild(lasoIkona).className = 'wi wi-raindrop';

                    let krituliaiViso = document.createElement('p');
                    krituliaiViso.innerHTML = duomenys.forecastTimestamps[i].totalPrecipitation + ' mm/val';
                    li.appendChild(krituliaiViso).id = 'totalPrecipitation';

                    let vejoKryptis = document.createElement('i');
                    li.appendChild(vejoKryptis).className = 'wi wi-wind from-' + duomenys.forecastTimestamps[i].windDirection + '-deg';

                }
            } else {
                alert(vietovesOruUzklausa.statusText); //ismeta alerta
            }
        }
    };
    vietovesOruUzklausa.open('GET','https://api.meteo.lt/v1/places/Vilnius/forecasts/long-term'); //uzklausa
    //vietovesOruUzklausa.open('GET','https://api.meteo.lt/v1/places/Kaunas/forecasts/long-term'); //uzklausa
    //vietovesOruUzklausa.open('GET','https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400&date=2020-01-04')
    vietovesOruUzklausa.send(); //uzklausos paleidimas
})();