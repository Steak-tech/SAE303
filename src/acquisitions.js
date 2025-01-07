import Chart from 'chart.js/auto';
import jsonData from '../data.json';

(async function () {
    // Récupérer les données
    const tableData = jsonData.find(entry => entry.type === "table" && entry.name === "results")?.data || [];



    //------------------------------------------------------------------------------------------------



    //pie chart
    let tab = tableData.filter(row=>row.name ==='Picat')
    let tab2 =tableData.filter(row=>row.name ==='ACE')
    let tab3 =tableData.filter(row=>row.name ==='Fun-sCOP-cad')
    function quality(best){
        let temp_moy = 0
        let res_moy = 0
        let incr =0
        for(let i=0;i<best.length;i++){
                temp_moy = temp_moy + parseInt(best[i].time)
                incr ++
        }
        res_moy = temp_moy / incr
        return res_moy
    }



    //------------------------------------------------------------------------------------------------



    //bar chart : nombre de problèmes résolus par solveur
    function compte(data) {
        const solveurs = {};

        data.forEach(row => {
            if (!solveurs[row.name]) {
                solveurs[row.name] = 0;
            }

            if (row.status === "SAT" || row.status === "UNSAT") {
                solveurs[row.name]++;
            }
        });

        return solveurs;
    }

    const satCounts = compte(tableData);
    // Convertir l'objet en tableau de paires clé-valeur et trier par valeur décroissante
    const sortedEntries = Object.entries(satCounts).sort((a, b) => b[1] - a[1]);

    // Extraire les labels et les données triées
    const sortedLabels = sortedEntries.map(entry => entry[0]);
    const sortedData = sortedEntries.map(entry => entry[1]);



    //------------------------------------------------------------------------------------------------



    //bar chart : temps de résolution total des algorithmes (en secondes)
    // Fonction pour convertir les secondes en hh:mm:ss
    function convertToHHMMSS(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Fonction pour additionner tous les temps de chaque famille
    function difficulté(data) {
        const familles = {};
        data.forEach(row => {
            if (!familles[row.family]) {
                familles[row.family] = 0;
            }
            familles[row.family] += parseFloat(row.time);
        });
        return familles;
    }

    const familyTimes = difficulté(tableData);
    const x = Object.entries(familyTimes).sort((a, b) => b[1] - a[1]);
    const familyNames = x.map(entry => entry[0]);
    const familyValues = x.map(entry => entry[1]);

    let familyhours = [];

    for (let i = 0; i < familyValues.length; i++) {
 
        familyhours[i] = convertToHHMMSS(familyValues[i]);
    }



    //------------------------------------------------------------------------------------------------



    //bar chart : nombre de problèmes résolus par solveur
    new Chart(
        document.getElementById('acquisitions'),
        {
            type: 'bar',
            data: {
                labels: sortedLabels, // Les noms des solveurs triés
                datasets: [
                    {
                        label: 'Nombre de problèmes résolus',
                        data: sortedData, // Nombre de SAT par solveur trié
                        backgroundColor: ['rgb(66, 60, 228)', 'rgb(51, 47, 173)', 'rgb(34, 31, 114)', 'rgb(25, 22, 84)'],
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Nombre de problèmes résolus par solveur',
                        font : {
                            size: 20,
                        }
                    },
                  
                }
            }
        }
    );



    //------------------------------------------------------------------------------------------------



    //bar chart : temps de résolution total des algorithmes (en secondes)
    new Chart(
        document.getElementById('acquisitions2'),
        {
            type: 'bar',
            data: {
                labels: familyNames, // Les noms des solveurs
                datasets: [
                    {
                        label: 'Temps de résolution total des algorithmes (en secondes)',
                        data: familyValues, // valeurs des temps de résolution en secondes
                        backgroundColor: ['rgb(66, 60, 228)', 'rgb(51, 47, 173)', 'rgb(34, 31, 114)', 'rgb(25, 22, 84)'],
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Problèmes les plus durs a résoudre',
                        font : {
                            size: 20,
                        }
                    },   
                    tooltip: { 
                        callbacks: {
                            label: function(context) {
                                
                            }
                        }
                    }
                }
            }
        }
    );



    //------------------------------------------------------------------------------------------------



    //pie chart
    new Chart(
        document.getElementById('best'),
        {
            type: 'pie',
            data: {
                labels: [tab[0].name, tab2[0].name, tab3[0].name], // Les noms des solveurs triés
                datasets: [
                    {
                        data: [quality(tab), quality(tab2), quality(tab3)],
                        backgroundColor: ['rgb(66, 60, 228)', 'rgb(51, 47, 173)', 'rgb(34, 31, 114)'],
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Lenteur moyenne des trois algorithmes ayant résolus le plus de problèmes',
                        font: {
                            size: 20,
                        }
                    },
                    subtitle : {
                        display: true,
                        text: 'Plus une zone est grande, plus le solveur à été lent (en secondes)'
                    }
                }
            }
        }
    );

    let select = document.querySelector('.select');
    let select2 = document.querySelector('.select2');
    let chartInstance = null;

// Remplir les listes déroulantes avec les labels triés
    sortedLabels.forEach(label => {
        select.innerHTML += `<option value="${label}">${label}</option>`;
        select2.innerHTML += `<option value="${label}">${label}</option>`;
    });

// Écouteurs d'événements pour les sélections
    select.addEventListener('change', e => {
        updateChart(e.target.value, select2.value);  // Mettre à jour le graphique avec les deux sélections
    });

    select2.addEventListener('change', e => {
        updateChart(select.value, e.target.value);  // Mettre à jour le graphique avec les deux sélections
    });

// Fonction pour filtrer les données et créer le graphique
    function updateChart(value1, value2) {
        if (!value1 || !value2) return;  // Vérifie que les deux valeurs sont sélectionnées

        let tab1 = tableData.filter(row => row.name === value1);
        let tab2 = tableData.filter(row => row.name === value2);
        let data1 = []
        let data2 = []
        data1.push(quality(tab1));  // Données pour le premier solveur
        data2.push(quality(tab2));  // Données pour le second solveur

        if (chartInstance) {
            chartInstance.destroy();
        }

        // Créer ou mettre à jour le graphique
        chartInstance = new Chart(
            document.getElementById('compare'),
            {
                type: 'bar',
                data: {
                    labels: ["Moyenne de temps"],  // Noms des catégories
                    datasets: [
                        {
                            label: `Temps moyen de résolution pour ${value1}`,
                            data: data1,
                            backgroundColor: ['rgb(66, 60, 228)'],
                            borderWidth: 1
                        },
                        {
                            label: `Temps moyen de résolution pour ${value2}`,
                            data: data2,
                            backgroundColor: ['rgb(25, 22, 84)'],
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Comparaison des temps moyens de résolution',
                            font: {
                                size: '20'
                            }
                        },
                        subtitle: {
                            display: true,
                            text: 'Plus une barre est haute, plus le solveur a été lent à résoudre un problème'
                        }
                    },
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            }
        );
    }
})();

