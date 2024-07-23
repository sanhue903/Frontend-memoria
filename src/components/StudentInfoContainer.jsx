import React from 'react'
import config from '../config';
import { useEffect, useState } from 'react';

function StudentInfoContainer({ studentId }) {
  const token = localStorage.getItem('token');
  const [student, setStudent] = useState([]);

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
        console.log(data);
        setStudent(data.student);
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
        <p>Nombre: ${student.name}</p>
        <p>Edad: ${student.age}</p>
      </div>
      <div className='column'>
        <p>Último Capítulo: ${student.last_chapter}</p>
        <p>Sesiones: ${student.session}</p>
      </div>
      </div>
    </div>
  )
}

export default StudentInfoContainer
