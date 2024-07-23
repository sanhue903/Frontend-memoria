import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Students.css';
import TimeChart from '../components/TimeChart';
import AttemptsChart from '../components/AttemptsChart';
import config from '../config';
import NavBar from '../components/NavBar';
import StudentInfoContainer from '../components/StudentInfoContainer';
import EachStudentTable from '../components/EachStudentTable';

const EachStudent = () => {
  const token = localStorage.getItem('token');
  const { studentId } = useParams();
  const [scores, setScores] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [chapters, setChapters] = useState([]);
  const [chapter, setChapter] = useState('');

  useEffect(() => {
    const fetchStudentScores = async () => {
      try {
        const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI/students/${studentId}/scores`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const data = await response.json();
        setScores(data.scores);
      } catch (error) {
        console.error('Error fetching student scores:', error);
        setScores([]);
      }
    };

    fetchStudentScores();
  }, [studentId, token]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const data = await response.json();
        setChapters(data.chapters);
        if (data.chapters.length > 0) {
          setChapter(data.chapters[0].name);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
        setChapters([]);
      }
    };
  
    fetchChapters();
  }, [token]);

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI/students`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const data = await response.json();

        const student = data.students.find(student => student.id.toString() === studentId);
        if (student) {
          setStudentName(student.name);
        } else {
          setStudentName('Estudiante no encontrado');
        }
      } catch (error) {
        console.error('Error fetching student name:', error);
        setStudentName('Error al obtener el nombre del estudiante');
      }
    };

    fetchStudentName();
  }, [studentId, token]);
    

  const handleChapterChange = (event) => {
    setChapter(event.target.value);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <NavBar />
      <StudentInfoContainer studentId={studentId} />
      <div className='charts-container'>
        <TimeChart scores={scores} chapters={chapters} selectedChapter={chapter} />
        <AttemptsChart scores={scores} chapters={chapters} selectedChapter={chapter} />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <select value={chapter} onChange={handleChapterChange}>
          {chapters.map(chap => (
            <option key={chap.id} value={chap.name}>
              {chap.name}
            </option>
          ))}
        </select>
      </div>
      <EachStudentTable scores={scores} chapters={chapters} />
    </div>
  );
};

export default EachStudent;