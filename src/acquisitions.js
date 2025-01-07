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

    // Utiliser la fonction compte pour obtenir les données
    const satCounts = compte(tableData);

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
