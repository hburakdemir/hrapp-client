import React from 'react'
import { useTheme } from '../../context/ThemeContext';
import Layout from '../../components/layout/Layout'

const Contact = () => {
  const {colors} = useTheme();
  return (
    <Layout>
    <div className='min-h-screen' 
    style={{backgroundColor:colors.bg}}>
      <p className='text-center '
      style={{color:colors.text}}>iletişim page</p>
    </div>
    </Layout>
  )
}

export default Contact
