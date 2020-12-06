if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
        .then((reg) => {
          console.log('Service worker registered.', reg);
        });
    });
}
// var let
let transactions = [];
let myChart;
// initiate fetch
fetch("/api/transaction")
  .then(response => {
    return response.json();
  })
  .then(data => {
    
    transactions = data;
// populate from response
    populateTotal();
    populateTable();
    populateChart();
  });