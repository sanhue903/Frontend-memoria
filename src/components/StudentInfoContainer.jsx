import React from 'react'
import config from '../config';
import { useEffect, useState } from 'react';

function StudentInfoContainer({ studentId }) {
  const token = localStorage.getItem('token');
  const [studentName, setStudentName] = useState();
  const [studentAge, setStudentAge] = useState();
  const [lastChapter, setLastChapter] = useState();
  const [sessions, setSessions] = useState();

  useEffect(() => {
    const fetchStudentScores = async () => {
      try {
        const response = await fetch(`${config.APIBaseURL}/apps/BOTIQI/students/${studentId}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const data = await response.json();
        setStudentName(data.student.name);
        setStudentAge(data.student.age);
        setLastChapter(data.student.last_chapter);
        setSessions(data.student.session);
      } catch (error) {
        console.error('Error fetching student scores:', error);
      }
    };

    fetchStudentScores();
  }, [studentId, token]);

  return (
    <div>
      <h3>Información del Estudiante</h3>
      <div className='studentInfoContainer'>
      <div className='column'>
        <p>Nombre: {studentName}</p>
        <p>Edad: {studentAge}</p>
      </div>
      <div className='column'>
        <p>Último Capítulo: {lastChapter}</p>
        <p>Sesiones: {sessions}</p>
      </div>
      </div>
    </div>
  )
}

export default StudentInfoContainer
