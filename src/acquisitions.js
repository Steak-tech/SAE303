import Chart from 'chart.js/auto';
import jsonData from '../data.json';

(async function () {
    // Récupérer les données pertinentes
    const tableData = jsonData.find(entry => entry.type === "table" && entry.name === "results")?.data || [];
    
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
            // Initialiser la famille si pas encore enregistrée
            if (!familles[row.family]) {
                familles[row.family] = 0;
            }

            // Ajouter le temps à la famille correspondante
            familles[row.family] += parseFloat(row.time);
        });

        // Convertir les temps totaux en hh:mm:ss
        const famillesFormatted = {};
        for (const family in familles) {
            famillesFormatted[family] = convertToHHMMSS(familles[family]);
        }

        return famillesFormatted;
    }
    

    // Utiliser la fonction compte pour obtenir les données
    const satCounts = compte(tableData);
    
    // Convertir l'objet en tableau de paires clé-valeur et trier par valeur décroissante
    const sortedEntries = Object.entries(satCounts).sort((a, b) => b[1] - a[1]);

    // Extraire les labels et les données triées
    const sortedLabels = sortedEntries.map(entry => entry[0]);
    const sortedData = sortedEntries.map(entry => entry[1]);

    // Utiliser la fonction difficulté pour obtenir les temps par famille
    const familyTimes = difficulté(tableData);

    console.log(familyTimes);

    // Créer le graphique
    new Chart(
        document.getElementById('acquisitions'),
        {
            type: 'bar',
            data: {
                labels: sortedLabels, // Les noms des solveurs triés
                datasets: [
                    {
                        label: 'Nombre de SAT', // Titre de la légende
                        data: sortedData, // Nombre de SAT par solveur trié
                        backgroundColor: ['rgb(66, 60, 228)', 'rgb(51, 47, 173)', 'rgb(34, 31, 114)', 'rgb(25, 22, 84)'], // Couleur des barres
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Nombre de SAT par solveur' // Titre du graphique
                    }
                }
            }
        }
    );
})();

//test