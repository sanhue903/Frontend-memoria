import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Students.css';
import EachStudentsGraphics from '../components/EachStudentsGraphics';
import EachStudentTable from '../components/EachStudentTable';
import Logout from '../components/Logout';

function EachStudent() {
  const token = localStorage.getItem('token');
  const { studentId } = useParams();
  const [scores, setScores] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchStudentScores = async () => {
      try {
        const response = await fetch(`/apps/BOTIQI/students/${studentId}/scores`, {
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
        const response = await fetch(`/apps/BOTIQI`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        });
        const data = await response.json();
        setChapters(data.chapters);
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
        const response = await fetch(`/apps/BOTIQI/students`, {
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


  return (
    <div>
      <Logout />
      <h1>{studentName}</h1>
      <EachStudentsGraphics scores={scores} chapters={chapters} />
      <EachStudentTable scores={scores} chapters={chapters} />
    </div>
  );
}

export default EachStudent;