import React from 'react';
import '../css/Students.css';

function EachStudentTable({ scores, chapters }) {
  return (
    <div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Sesión</th>
              <th>Capítulo</th>
              <th>Pregunta</th>
              <th>Respuesta</th>
              <th>Segundos</th>
              <th>Intentos</th>
              <th>Correcto</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => {
              const chapterInfo = chapters.find(chap => chap.id === score.chapter_id);
              const chapterName = chapterInfo ? chapterInfo.name : 'Desconocido';
              const questionInfo = chapterInfo ? chapterInfo.questions.find(q => q.id === score.question_id) : null;
              const questionText = questionInfo ? questionInfo.text : 'Pregunta desconocida';

              return (
                <tr key={index}>
                  <td>{score.session}</td>
                  <td>{chapterName}</td>
                  <td>{questionText}</td>
                  <td>{score.answer}</td>
                  <td>{score.seconds}</td>
                  <td>{score.attempt}</td>
                  <td>{score.is_correct ? 'Sí' : 'No'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EachStudentTable;