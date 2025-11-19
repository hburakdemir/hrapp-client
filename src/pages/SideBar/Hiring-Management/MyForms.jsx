import React from 'react'
import Layout from '../../../components/layout/Layout'
import { useTheme } from '../../../context/ThemeContext';

const MyForms = () => {
  const {colors} = useTheme();
  return (
    <Layout>
    <div className='min-h-screen' 
    style={{backgroundColor:colors.bg}}>
      <p 
      style={{color:colors.text}}>myforms page</p>
    </div>
    </Layout>
  )
}

export default MyForms
