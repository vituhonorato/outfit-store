import Link from 'next/link'
import React, { useEffect } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {signIn, useSession} from 'next-auth/react'
import * as Yup from 'yup';
import { getError } from '@/utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';



interface LoginFormValues {
    email: string;
    password: string;
  }
  
 
  

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };
  

const  LoginScreen = () => {

  const { data: session } = useSession()
  const router = useRouter()
  const { redirect }:any = router.query;

  useEffect(() => {
   if (session?.user){
    router.push(redirect || '/')
   }
  }, [router, session, redirect]);

    const handleSubmit = async ({email, password}: LoginFormValues) => {
        // Submit login data to the server
        
        try{
          const result:any = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });
          if(result.error){
            toast.error(result.error)
          }
        }catch(err){
          toast.error(getError(err))
        }
      };
    
    
  return (
    <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
         >
         <Form  className='mx-auto max-w-screen-md' >
          <h1 className='mb-4 text-xl'>Login</h1>
            <div className='mb-4'>
            <label htmlFor='email'>Email</label>
              <Field autoFocus className='w-full' type="email" id="email" name="email" />
            <div className='text-red-500'>
            <ErrorMessage name="email" />
            </div>
            
       
        </div>
        <div className='mb-4'>
            <label htmlFor='password'>Password</label>
            <Field autoFocus className='w-full' type="password" id="password" name="password" />
            <div className='text-red-500'>
                <ErrorMessage  name="password" />
            </div>
            
        </div>
        <div className='mb-4'>
            <button type='submit' className='primary-button'>Login</button>
        </div>
        <div className='mb-4'>
            Don&apos;t have an account? &nbsp;
            <Link className='text-indigo-600' href={`/register?redirect=${redirect || '/'}`}>Register</Link>
        </div>
      </Form>
     </Formik>
    </>
  )
}
export default LoginScreen
