import React from 'react'
import '../css/Students.css'
import StudentsTable from '../components/StudentsTable'
import StudentsGraphic from '../components/StudentsGraphic'
import NavBar from '../components/NavBar'
import StudentsGraphic2 from '../components/StudentsGraphic2'

function Students() {
  return (
    <div>
      <NavBar />
      <div className="charts-container">
        <StudentsGraphic />
        <StudentsGraphic2 />
      </div>
      <StudentsTable />
    </div>
  )
}

export default Students
