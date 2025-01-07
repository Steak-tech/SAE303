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

    // Utiliser la fonction compte pour obtenir les données
    const satCounts = compte(tableData);

    // Convertir l'objet en tableau de paires clé-valeur et trier par valeur décroissante
    const sortedEntries = Object.entries(satCounts).sort((a, b) => b[1] - a[1]);

    // Extraire les labels et les données triées
    const sortedLabels = sortedEntries.map(entry => entry[0]);
    const sortedData = sortedEntries.map(entry => entry[1]);

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
                }
            }
        }
    );
})();
