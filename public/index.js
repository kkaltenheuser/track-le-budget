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
// sendTransaction function
function sendTransaction(isAdding) {
      // var in function
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    let errorEl = document.querySelector(".form .error");
  
    // check form
    if (nameEl.value === "" || amountEl.value === "") {
      errorEl.textContent = "Missing Information";
      return;
    }
    else {
      errorEl.textContent = "";
    }
  
    // create record to note name, value, and date
    let transaction = {
      name: nameEl.value,
      value: amountEl.value,
      date: new Date().toISOString()
    };
  
    // if removing funds, note it (removing by sending aka adding funds to someone else)
    if (!isAdding) {
      transaction.value *= -1;
    }
  
    // add to data
    transactions.unshift(transaction);

    // re-run all the charts and populate them!
  populateChart();
  populateTable();
  populateTotal();
  
  // send feedback to server
  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })
  .then(response => {    
    return response.json();
  })
  .then(data => {
    if (data.errors) {
      errorEl.textContent = "Missing Information";
    }
    else {
      // then clear the form
      nameEl.value = "";
      amountEl.value = "";
    }
  })
  .catch(err => {
    // if fetch failed, save in the DB
    saveRecord(transaction);

    // then clear the form
    nameEl.value = "";
    amountEl.value = "";
  });
}

document.querySelector("#add-btn").onclick = function() {
  sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function() {
  sendTransaction(false);
};
