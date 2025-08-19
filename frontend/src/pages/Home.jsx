import React from 'react'
import Timer from '../components/Timer'
import Task from '../components/Task'

const Home = () => {
  return (
    <div className='flex md:flex-row flex-col items-center justify-around min-h-screen bg-gray-700 w-auto gap-8'>
      <Timer />
      <Task />
    </div>
  )
}

export default Home
