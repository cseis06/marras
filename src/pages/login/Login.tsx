import { useState } from 'react';
import Img from '../../assets/bg/login.png'
import Input from '../../components/ui/FloatingInput';
import { IconArrowRight, IconEye, IconEyeOff, IconUser } from '@tabler/icons-react';
import Button from '../../components/ui/Button';

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
            <Input
              label="Usuario"
              icon={<IconUser size={20} />}
              //iconPosition="right"
              type="text"
            />
            <div>
              <Input
                  label="Contraseña"
                  icon={<div onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <IconEyeOff /> : <IconEye />}
                  </div>}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  clickableIcon={true}
                />
              <span className='text-xs text-gray-600 font-normal'>
                ¿Olvidaste tu contraseña? <a href="#" className='italic underline'>Restablezcala aquí.</a>
              </span>
            </div>
            
          </div>
          <div className='w-full opacity-90'>
            <Button disabled variant="gradient" icon={<IconArrowRight size={18} />} iconPosition="right" className='opacity-50 hover:opacity-50! active:scale-100! cursor-not-allowed'>
              Ingresar
            </Button>
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
