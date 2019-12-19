(function(){
    const body = document.querySelector('body');
    let manoAjax = new XMLHttpRequest();   //sukuriamas naujas objektas
    manoAjax.onreadystatechange = function () { //callback
        if (manoAjax.readyState === 4) {   // 4 ir 200 - html status (kaip errorai, F12 - network (isplesti, matomi elementai)
            if (manoAjax.status === 200) {
                let belekas = JSON.parse(manoAjax.responseText);  // kitamasis = array
                let header = document.createElement('header');
                body.appendChild(header);



                let main = document.createElement('main');
                body.appendChild(main);
                let div = document.createElement('div');
                main.appendChild(div);
                for(let i = 0; belekas.forecastTimestamps.length; i++) {
                    let ul = document.createElement('ul');
                    div.appendChild(ul);
                    let li = document.createElement('li');
                    ul.appendChild(li);
                    li.id = 'li'+i;

                    let p = document.createElement('p');
                    p.innerHTML = belekas.forecastTimestamps[i].forecastTimeUtc;
                    li.appendChild(p);

                    let p2 = document.createElement('p');
                    p2.innerHTML = belekas.forecastTimestamps[i].conditionCode;
                    li.appendChild(p2);

                    let p3 = document.createElement('p');
                    p3.innerHTML = belekas.forecastTimestamps[i].totalPrecipitation;
                    li.appendChild(p3);

                    let p4 = document.createElement('p');
                    p4.innerHTML = belekas.forecastTimestamps[i].windDirection;
                    li.appendChild(p4);



                }
            } else {
                alert(manoAjax.statusText); //ismeta alerta
            }
        }
    };
    manoAjax.open('GET','scripts/array.json'); //uzklausa
        manoAjax.send(); //uzklausos paleidimas
    document.querySelector('ul').style.display = "flex";
    document.querySelectorAll('li').style.display = "inline-flex";
})();