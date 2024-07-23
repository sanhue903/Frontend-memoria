import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import config from '../config';
import { Chart, LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import '../css/Students.css';

Chart.register(LineElement, PointElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TimeChart = ({ scores, chapters, selectedChapter }) => {
  const token = localStorage.getItem('token');
  const [timeData, setTimeData] = useState([]);
  const [allTimeData, setAllTimeData] = useState([]);
  const [allScores, setAllScores] = useState([]);

  useEffect(() => {
    const fetchAllScores = async () => {
      try {
        const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI/students/scores`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const data = await response.json();
        setAllScores(data.scores);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setAllScores([]);
      }
    };

    fetchAllScores();
  }, [token]);

  useEffect(() => {
    const processData = () => {
      const questionTotalCounts = {};
      const questionTime = {};

      scores.forEach(score => {
        const chapterInfo = chapters.find(chap => chap.id === score.chapter_id);
        const chapterName = chapterInfo ? chapterInfo.name : 'Desconocido';

        if (chapterName === selectedChapter) {
          const questionNumber = score.question_id.slice(-1);
          const questionLabel = `Pregunta ${questionNumber}`;

          if (!questionTotalCounts[questionLabel]) {
            questionTotalCounts[questionLabel] = 0;
            questionTime[questionLabel] = 0;
          }
          questionTotalCounts[questionLabel]++;
          questionTime[questionLabel] += score.seconds;
        }
      });

      const processedTimeData = Object.keys(questionTotalCounts).map(questionLabel => ({
        question: questionLabel,
        time: questionTime[questionLabel] / questionTotalCounts[questionLabel]
      }));

      setTimeData(processedTimeData);
    };

    const processAllScores = () => {
      const allQuestionTotalCounts = {};
      const allQuestionTime = {};

      allScores.forEach(score => {
        const questionNumber = score.question_id.slice(-1);
        const questionLabel = `Pregunta ${questionNumber}`;

        if (!allQuestionTotalCounts[questionLabel]) {
          allQuestionTotalCounts[questionLabel] = 0;
          allQuestionTime[questionLabel] = 0;
        }
        allQuestionTotalCounts[questionLabel]++;
        allQuestionTime[questionLabel] += score.seconds;
      });

      const processedAllTimeData = Object.keys(allQuestionTotalCounts).map(questionLabel => ({
        question: questionLabel,
        time: allQuestionTime[questionLabel] / allQuestionTotalCounts[questionLabel]
      }));

      setAllTimeData(processedAllTimeData);
    };

    processData();
    processAllScores();
  }, [scores, chapters, selectedChapter, allScores]);

  const timeChartData = {
    labels: timeData.map(d => d.question),
    datasets: [
      {
        label: 'Tiempo Promedio',
        data: timeData.map(d => d.time),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Tiempo Promedio General',
        data: allTimeData.map(d => d.time),
        type: 'line',
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(2)}`,
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
      <h3>Tiempo Promedio por Pregunta</h3>
      <Bar data={timeChartData} options={chartOptions} width={600} height={300} />
    </div>
  );
};

export default TimeChart;
