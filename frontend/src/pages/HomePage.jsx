import Timer from '../components/Timer'
import Task from '../components/Task'
import Navbar from '../components/Navbar'

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gray-700 w-full flex flex-col gap-6 sm:gap-8'>
      <Navbar />
      <div className='flex flex-col md:flex-row items-center justify-around gap-4 md:gap-8'>
        <Timer />
        <Task />
      </div>
      
    </div>
  )
}

export default HomePage
