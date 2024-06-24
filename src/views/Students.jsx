import React from 'react'
import '../css/Students.css'
import StudentsTable from '../components/StudentsTable'
import StudentsGraphic from '../components/StudentsGraphic'
import Logout from '../components/Logout'

function Students() {
  return (
    <div>
      <Logout />
      <h1>Estudiantes</h1>
      <StudentsGraphic />
      <StudentsTable />
    </div>
  )
}

export default Students
