import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StudentsTable() {
  const token = localStorage.getItem('token');
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchTotalStudents = () => {
      return fetch('/apps/BOTIQI/students', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      .then(response => response.json())
      .then(data => {
        const total = data.students.length;
        setTotalStudents(total);
        setTotalPages(Math.ceil(total / limit));
        return total;
      })
      .catch(error => {
        console.error(error);
        return 0;
      });
    };

    const fetchStudents = (limit, page) => {
      return fetch(`/apps/BOTIQI/students?limit=${limit}&page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
        }
      })
      .then(response => response.json())
      .then(data => {
        setStudents(data.students);
        return data.students;
      })
      .catch(error => {
        console.error(error);
        return [];
      });
    };

    fetchTotalStudents().then(() => {
      fetchStudents(limit, page);
    });
  }, [token, page, limit]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Sesiones</th>
              <th>Ver</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.age}</td>
                <td>{student.session}</td>
                <td> 
                  <Link to={`/students/${student.id}/scores`}>Ver Scores</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <button onClick={handlePreviousPage} disabled={page === 1}>Atrás</button>
          <span>Página {page} de {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

export default StudentsTable;