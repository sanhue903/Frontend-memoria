import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const StudentsGraphic = () => {
    const token = localStorage.getItem('token');
    const [chapter, setChapter] = useState(null);
    const [data, setData] = useState([]);
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await fetch('/apps/BOTIQI', {
                    headers: {
                        'Authorization': 'Bearer ' + token,
                    }
                });
                const result = await response.json();
                setChapters(result.chapters);
            } catch (error) {
                console.error('Error fetching chapters:', error);
                setChapters([]);
            }
        };

        fetchChapters();
    }, [token]);

    const fetchScores = async (chapterId) => {
        try {
            const response = await fetch(`/apps/BOTIQI/students/scores?chapter=${chapterId}`, {
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
            const questionNumber = score.question_id.slice(-1); // Extracting last character as question number
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
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p>{`Porcentaje de aciertos: ${payload[0].value}%`}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div>
            <div className='graphic'>
                <BarChart width={800} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey='correct' fill='#8884d8' />
                </BarChart>
            </div>
            <div className="chaptersBar">
                {chapters.map(chap => (
                    <button
                        key={chap.id}
                        className={`chapter ${chapter && chapter.id === chap.id ? 'active' : ''}`}
                        onClick={() => handleChapterChange(chap)}
                    >
                        {chap.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default StudentsGraphic;
