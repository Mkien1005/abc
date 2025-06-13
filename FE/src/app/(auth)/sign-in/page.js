'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import AuthLayout from '../layout'
import { useMutation } from '@tanstack/react-query'
import AuthService from '@/services/auth_service'
import Alert from '@/utils/alert/alert'
import { useDispatch } from 'react-redux'

const SignIn = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const loginUser = useMutation({
    mutationFn: ({ email, password }) => AuthService.login(email, password, dispatch),
    onSuccess: (data) => {
      Alert.notify('Đăng nhập thành công', 'Chuyển hướng đến trang chủ', 'success').then(() => {
        router.push('/home/tcophar')
      })
    },
    onError: (error) => {
      Alert.notify('Đăng nhập thất bại', error.response.data.message, 'error').then(() => {})
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit = (data) => {
    loginUser.mutate({ email: data.email, password: data.password })
  }

  return (
    <AuthLayout bgImage='bg_image--9'>
      <div className='axil-signin-form'>
        <h3 className='title'>Đăng nhập</h3>
        <form className='singin-form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' className='form-control' {...register('email', { required: true })} defaultValue='admin@gmail.com' />
            {errors.email && <p className='error'>Đây là trường thông tin bắt buộc.</p>}
          </div>
          <div className='form-group'>
            <label>Mật khẩu</label>
            <input type='password' className='form-control' {...register('password', { required: true, minLength: 8 })} defaultValue='Password@123' />
            {errors.password && <p className='error'>Đây là trường thông tin bắt buộc.</p>}
          </div>
          <div className='form-group d-flex align-items-center justify-content-between'>
            <button type='submit' className='axil-btn btn-bg-primary submit-btn'>
              Xác nhận
            </button>
            <Link href='/forgot-password' className='forgot-btn'>
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignIn
