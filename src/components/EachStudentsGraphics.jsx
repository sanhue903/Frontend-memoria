import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Cell } from 'recharts';

function EachStudentsGraphics({ scores, chapters }) {
  const [chapter, setChapter] = useState('Autonomia Emocional');  // Set initial chapter name
  const [timeData, setTimeData] = useState([]);
  const [attemptData, setAttemptData] = useState([]);

  useEffect(() => {
    const processData = () => {
      const questionTotalCounts = {};
      const questionTime = {};
      const questionAttempts = {};
      const questionCorrectStatus = {};

      scores.forEach(score => {
        const chapterInfo = chapters.find(chap => chap.id === score.chapter_id);
        const chapterName = chapterInfo ? chapterInfo.name : 'Desconocido';

        if (chapterName === chapter) {
          const questionNumber = score.question_id.slice(-1);
          const questionLabel = `Pregunta ${questionNumber}`;

          if (!questionTotalCounts[questionLabel]) {
            questionTotalCounts[questionLabel] = 0;
            questionTime[questionLabel] = 0;
            questionAttempts[questionLabel] = 0;
            questionCorrectStatus[questionLabel] = false;
          }
          questionTotalCounts[questionLabel]++;
          questionTime[questionLabel] += score.seconds;
          questionAttempts[questionLabel] += score.attempt;
          if (score.is_correct) {
            questionCorrectStatus[questionLabel] = true;
          }
        }
      });

      const processedTimeData = Object.keys(questionTotalCounts).map(questionLabel => ({
        question: questionLabel,
        Tiempo: Math.round(questionTime[questionLabel] / questionTotalCounts[questionLabel])
      }));

      const processedAttemptData = Object.keys(questionTotalCounts).map(questionLabel => ({
        question: questionLabel,
        Intentos: questionAttempts[questionLabel],
        correct: questionCorrectStatus[questionLabel]
      }));

      setTimeData(processedTimeData);
      setAttemptData(processedAttemptData);
    };

    processData();
  }, [scores, chapters, chapter]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p>{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomLegend = () => (
    <div className="custom-legend">
      <span>
        <span style={{ color: '#82ca9d', marginRight: 10 }}>■</span>Correcto
      </span>
      <span>
        <span style={{ color: '#8884d8', marginRight: 10 }}>■</span>Incorrecto
      </span>
    </div>
  );

  const handleChapterChange = (chapterName) => {
    setChapter(chapterName);
  };

  return (
    <div>
      <h3>Tiempo Promedio por Pregunta</h3>
      <div className='graphic'>
        <BarChart width={800} height={300} data={timeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey='Tiempo' fill='#8884d8' />
        </BarChart>
      </div>
      
      <h3>Intentos por Pregunta y Estado</h3>
      <div className='graphic'>
        <BarChart width={800} height={300} data={attemptData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="question" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey='Intentos'>
            {attemptData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.correct ? '#82ca9d' : '#8884d8'} />
            ))}
          </Bar>
        </BarChart>
      </div>
      <div className="chaptersBar">
        {chapters.map(chap => (
          <button
            key={chap.id}
            className={`chapter ${chapter === chap.name ? 'active' : ''}`}
            onClick={() => handleChapterChange(chap.name)}
          >
            {chap.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EachStudentsGraphics;
