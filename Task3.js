const quizData = [
      { q: "2 + 2 = ?", opts: ["2", "3", "4"], ans: "4" },
      { q: "Capital of India?", opts: ["Mumbai","Delhi","Chennai"], ans: "Delhi" },
      { q: "Name the animal that can't jump?", opts: ["Elephant","Monkey","Lion"], ans: "Elephant" }
    ];
    let idx = 0, score = 0;
    const quizEl = document.getElementById("quiz-container");

    function showQ() {
      const { q, opts, ans } = quizData[idx];
      quizEl.innerHTML = `
        <div class="question"><strong>Q${idx+1}:</strong> ${q}</div>
        ${opts.map(o =>
          `<button class="opt">${o}</button>`
        ).join('')}
      `;
      document.querySelectorAll('.opt').forEach(btn => {
        btn.onclick = () => {
          if (btn.textContent === ans) score++;
          idx++;
          if (idx < quizData.length) showQ();
          else quizEl.innerHTML = `<h3>Your score: ${score}/${quizData.length}</h3>`;
        };
      });
    }
    showQ();

    // === Weather Fetch Logic (Open‑Meteo) ===
    const btn = document.getElementById("get-weather");
    const resultDiv = document.getElementById("weather-result");

    btn.addEventListener('click', async () => {
      const city = document.getElementById("city-input").value.trim();
      if (!city) {
        resultDiv.textContent = 'Please enter a city.';
        return;
      }

      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        const locData = await geoRes.json();
        if (!locData.results?.length) throw new Error('City not found');

        const { latitude, longitude, name, country } = locData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        const weatherData = await weatherRes.json();
        const cw = weatherData.current_weather;
        resultDiv.innerHTML = `
          <h3>${name}, ${country}</h3>
          <p>🌡 ${cw.temperature} °C | 💨 ${cw.windspeed} km/h | Code: ${cw.weathercode}</p>
        `;
      } catch (err) {
        resultDiv.textContent = 'Error: ' + err.message;
      }
    });
