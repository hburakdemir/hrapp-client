import React from 'react'
import Layout from '../../../components/layout/Layout'
import { useTheme } from '../../../context/ThemeContext';

const Tasks = () => {
  const {colors} = useTheme();
  return (
    <Layout>
    <div className='min-h-screen' 
    style={{backgroundColor:colors.bg}}>
      <p 
      style={{color:colors.text}}>tasks page</p>
    </div>
    </Layout>
  )
}

export default Tasks