import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import config from '../config';
import '../css/Students.css'

ChartJS.register(ArcElement, Tooltip, Legend);

const StudentsGraphic2 = () => {
    const [chapters, setChapters] = useState([]);
    const [students, setStudents] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                const [chaptersResponse, studentsResponse] = await Promise.all([
                    fetch(`${config.APIBaseURL}/apps/BOTIQI`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`${config.APIBaseURL}/apps/BOTIQI/students`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                ]);

                const chaptersResult = await chaptersResponse.json();
                const studentsResult = await studentsResponse.json();

                setChapters(chaptersResult.chapters);
                setStudents(studentsResult.students);
            } catch (error) {
                console.error('Error fetching data:', error);
                setChapters([]);
                setStudents([]);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (chapters.length > 0 && students.length > 0) {
            const chapterCounts = {};
            students.forEach(student => {
                const chapterId = student.last_chapter;
                if (!chapterCounts[chapterId]) {
                    chapterCounts[chapterId] = 0;
                }
                chapterCounts[chapterId] += 1;
            });

            const labels = chapters.map(chapter => chapter.name);
            const data = chapters.map(chapter => chapterCounts[chapter.number] || 0);

            setChartData({
                labels,
                datasets: [{
                    label: 'Student Progress',
                    data,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)',
                    ],
                    hoverOffset: 4,
                }],
            });
        }
    }, [chapters, students]);

    return (
        <div>
            <h3>Progreso por Capítulos</h3>
            <div className='chart-container'>
              <Pie data={chartData} />
            </div>
        </div>
    );
};

export default StudentsGraphic2;
