import Chart from 'chart.js/auto';
import jsonData from '../data.json';

(async function () {
    // Récupérer les données pertinentes
    const tableData = jsonData.find(entry => entry.type === "table" && entry.name === "results")?.data || [];
    
    // Extraire les noms des solveurs et leurs temps
    const labels = tableData.map(row => row.name);
    const times = tableData.map(row => parseFloat(row.time)); // Convertir le temps en nombre
    
    // Créer le graphique
    new Chart(
        document.getElementById('acquisitions'),
        {
            type: 'bar',
            data: {
                labels: labels, // Les noms des solveurs
                datasets: [
                    {
                        label: 'Temps (s)', // Titre de la légende
                        data: times, // Les temps associés
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
                        text: 'Temps de résolution par solveur' // Titre du graphique
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
