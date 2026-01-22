import { useState } from 'react';
import Img from '../../assets/bg/login.png'
import { FloatingInput } from '../../components/common/FloatingInput';
import { IconEye, IconEyeOff, IconUser } from '@tabler/icons-react';

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);

  const year = new Date().getFullYear();

  return (
    <div>
      <section className='grid grid-cols-12 gap-4 z-10 h-dvh p-[5dvh]'>
        <div className='col-span-5'>
          <div className="h-[90dvh] w-full bg-center bg-cover rounded-2xl" style={{ backgroundImage: `url(${Img})` }} />
        </div>
        <div className='col-span-7 flex flex-col gap-10 px-28 justify-center items-start text-2xl font-bold h-full'>
          <div className='flex flex-col gap-1'>
            <h1 className='bg-gradient-to-r from-emerald-500 via-lime-400 to-emerald-500 inline-block text-transparent bg-clip-text text-5xl font-extrabold'>
              Inicia Sesión
            </h1>
            <span className='text-gray-600 text-xs font-normal '>
              Accede de forma segura a la plataforma para administrar información, procesos y recursos de manera eficiente. Ingresa tus credenciales para comenzar.
            </span>
          </div>
          <div className='w-full flex flex-col gap-6'>
            <FloatingInput
              label="Usuario"
              icon={<IconUser />}
              iconPosition="right"
              variant='filled'
              fullWidth
              colors={{
                label: '#4B5563',
                labelActive: '#059669',
                border: '#D1D5DB',
                borderFocus: 'none',
                icon: '#4B5563',
                iconFocus: '#059669',
              }}
            />
            <div>
              <FloatingInput
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                endIcon={
                  <div onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </div>
                }
                variant='filled'
                fullWidth
                size='md'
                colors={{
                  label: '#4B5563',
                  labelActive: '#059669',
                  border: '#D1D5DB',
                  borderFocus: 'none',
                  icon: '#4B5563',
                  iconFocus: '#059669',
                }}
              />
              <span className='text-xs text-gray-600 font-normal'>
                ¿Olvidaste tu contraseña? <a href="#" className='italic underline'>Restablezcala aquí.</a>
              </span>
            </div>
            
          </div>
          <div className='w-full opacity-90'>
            <button className='cursor-pointer w-full bg-linear-90 from-emerald-800 via-green-500 to-lime-400 rounded-md py-5 uppercase text-center text-base font-semibold text-white'>
              Ingresar
            </button>
          </div>
          <div className='text-gray-600 text-xs font-normal'>
            Daniela Brunetto &copy; {year}; Todos los derechos reservados.
          </div>
        </div>
      </section>
    </div>
      
  )
}

// 

export default Login
