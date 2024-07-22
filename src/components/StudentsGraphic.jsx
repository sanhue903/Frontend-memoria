import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import config from '../config';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentsGraphic = () => {
  const token = localStorage.getItem('token');
  const [chapter, setChapter] = useState(null);
  const [data, setData] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI`, {
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const result = await response.json();
        setChapters(result.chapters);
        handleChapterChange(result.chapters[0]);
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setChapters([]);
      }
    };

    fetchChapters();
  }, [token]);

  const fetchScores = async (chapterId) => {
    try {
      const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI/students/scores?chapter=${chapterId}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      });
      const result = await response.json();
      return result.scores;
    } catch (error) {
      console.error('Error fetching scores:', error);
      return [];
    }
  };

  const calculateCorrectPercentage = (scores) => {
    const questionCorrectCounts = {};
    const questionTotalCounts = {};

    scores.forEach(score => {
      const questionNumber = score.question_id.slice(-1);
      const questionLabel = `Pregunta ${questionNumber}`;

      if (!questionTotalCounts[questionLabel]) {
        questionTotalCounts[questionLabel] = 0;
        questionCorrectCounts[questionLabel] = 0;
      }
      questionTotalCounts[questionLabel]++;
      if (score.is_correct) {
        questionCorrectCounts[questionLabel]++;
      }
    });

    const formattedData = Object.keys(questionTotalCounts).map(questionLabel => ({
      question: questionLabel,
      correct: Math.round((questionCorrectCounts[questionLabel] / questionTotalCounts[questionLabel]) * 100)
    }));

    return formattedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (chapter) {
        const scores = await fetchScores(chapter.number);
        const data = calculateCorrectPercentage(scores);
        setData(data);
      }
    };

    fetchData();
  }, [chapter, token]);

  const handleChapterChange = (chap) => {
    setChapter(chap);
    setDescription(`Capítulo ${chap.number}: ${chap.name}`);
  };

  const chartData = {
    labels: data.map(d => d.question),
    datasets: [
      {
        label: 'Porcentaje de aciertos',
        data: data.map(d => d.correct),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        max: 100,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Porcentaje (%)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Pregunta',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },
  };

  return (
    <div className='chart-container'>
      <div className="title">
        <h3>{description}</h3>
      </div>
      <div>
        <Bar data={chartData} options={options} width={400} height={300}/>
      </div>
      <p>Porcentaje de acierto por pregunta</p>
      <select onChange={(e) => handleChapterChange(chapters.find(chap => chap.id === e.target.value))} className="chaptersDropdown">
        {chapters.map(chap => (
        <option key={chap.id} value={chap.id} defaultValue={chapter && chapter.id === chap.id}>
        {chap.name}
        </option> ))}
      </select>
    </div>
  );
};

export default StudentsGraphic;
