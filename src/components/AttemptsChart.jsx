import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import '../css/Students.css';

const AttemptsChart = ({ scores, chapters, selectedChapter }) => {
  const [attemptData, setAttemptData] = useState([]);

  useEffect(() => {
    const processData = () => {
      const questionTotalCounts = {};
      const questionAttempts = {};
      const questionCorrectStatus = {};

      scores.forEach(score => {
        const chapterInfo = chapters.find(chap => chap.id === score.chapter_id);
        const chapterName = chapterInfo ? chapterInfo.name : 'Desconocido';

        if (chapterName === selectedChapter) {
          const questionNumber = score.question_id.slice(-1);
          const questionLabel = `Pregunta ${questionNumber}`;

          if (!questionTotalCounts[questionLabel]) {
            questionTotalCounts[questionLabel] = 0;
            questionAttempts[questionLabel] = 0;
            questionCorrectStatus[questionLabel] = false;
          }
          questionTotalCounts[questionLabel]++;
          questionAttempts[questionLabel] += 1;
          if (score.is_correct) {
            questionCorrectStatus[questionLabel] = true;
          }
        }
      });

      const processedAttemptData = Object.keys(questionTotalCounts).map(questionLabel => ({
        question: questionLabel,
        attempts: questionAttempts[questionLabel],
        correct: questionCorrectStatus[questionLabel]
      }));

      setAttemptData(processedAttemptData);
    };

    processData();
  }, [scores, chapters, selectedChapter]);

  const attemptsChartData = {
    labels: attemptData.map(d => d.question),
    datasets: [
      {
        label: 'Intentos',
        data: attemptData.map(d => d.attempts),
        backgroundColor: attemptData.map(d => (d.correct ? 'rgba(130, 202, 157, 0.5)' : 'rgba(255, 0, 0, 0.5)')),
        borderColor: attemptData.map(d => (d.correct ? 'rgba(130, 202, 157, 1)' : 'rgba(255, 0, 0, 1)')),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      suggestedMax: 5,
      ticks: {
        stepSize: 1, // Asegura que solo se muestren enteros
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw}`,
      },
    },
    legend: {
      display: true,
      position: 'top',
    },
  },
};


  return (
    <div className='chart-container'>
      <h3>Intentos por Pregunta y Estado</h3>
      <Bar data={attemptsChartData} options={chartOptions} width={600} height={300} />
    </div>
  );
};

export default AttemptsChart;
