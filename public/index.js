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



// populateTotal
  function populateTotal() {
    // reduce transaction amounts to total value
    let total = transactions.reduce((total, t) => {
      return total + parseInt(t.value);
    }, 0);
  // total query selector
    let totalEl = document.querySelector("#total");
    totalEl.textContent = total;
  }
  // function populateTable
  function populateTable() {
    let tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
  
    transactions.forEach(transaction => {
      // create and populate a table row
      let tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${transaction.name}</td>
        <td>${transaction.value}</td>
      `;
  // append the child to table row
      tbody.appendChild(tr);
    });
  }
// function populateChart
  function populateChart() {
  // reverse the var
    let reversed = transactions.slice().reverse();
    let sum = 0;
  
    // create date labels
    let labels = reversed.map(t => {
      let date = new Date(t.date);
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });
  
    // increment the data
    let data = reversed.map(t => {
      sum += parseInt(t.value);
      return sum;
    });
  
    // destroy chart if useless
    if (myChart) {
      myChart.destroy();
    }
  
    let ctx = document.getElementById("myChart").getContext("2d");
  
    myChart = new Chart(ctx, {
      type: 'line',
        data: {
          labels,
          datasets: [{
              label: "Total Over Time",
              fill: true,
              backgroundColor: "#6666ff",
              data
          }]
      }
    });
  }