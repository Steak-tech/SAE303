import Chart from 'chart.js/auto';
import jsonData from '../data.json';

(async function () {
    // Récupérer les données pertinentes
    const tableData = jsonData.find(entry => entry.type === "table" && entry.name === "results")?.data || [];
    
    // Fonction pour compter le nombre de SAT par solveur
    function compte(data) {
        const solveurs = {};
        
        data.forEach(row => {
            // Initialiser le solveur si pas encore enregistré
            if (!solveurs[row.name]) {
                solveurs[row.name] = 0;
            }
            
            // Incrémenter si le statut est "SAT"
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

    // Utiliser la fonction difficulté pour obtenir les temps par famille
    const familyTimes = difficulté(tableData);

    console.log(familyTimes);

    // Créer le graphique
    new Chart(
        document.getElementById('acquisitions'),
        {
            type: 'bar',
            data: {
                labels: Object.keys(satCounts), // Les noms des solveurs
                datasets: [
                    {
                        label: 'Nombre de SAT', // Titre de la légende
                        data: Object.values(satCounts), // Nombre de SAT par solveur
                        backgroundColor: 'rgba(75, 192, 192, 0.5)', // Couleur des barres
                        borderColor: 'rgba(75, 192, 192, 1)', // Bordure des barres
                        borderWidth: 1
                    }
                ]
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Nombre de SAT par solveur' // Titre du graphique
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true // Commencer l'axe Y à 0
                    }
                }
            }
        }
    );
})();
