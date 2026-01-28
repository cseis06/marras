import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconMoodSad, IconArrowLeft, IconHome } from '@tabler/icons-react';
import gsap from 'gsap';
import Button from '../../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        numberRef.current,
        { opacity: 0, scale: 0.5, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          iconRef.current,
          { opacity: 0, rotate: -30, scale: 0 },
          { opacity: 1, rotate: 0, scale: 1, duration: 0.5 },
          '-=0.4'
        )
        .fromTo(
          contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          '-=0.2'
        );

      gsap.to(iconRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-full bg-gray-50 flex items-center justify-center"
    >
      <div className="text-center max-w-md">
        {/* Número 404 con icono */}
        <div className="relative inline-block mb-8">
          <div
            ref={numberRef}
            className="text-[10rem] font-bold leading-none text-gray-200 select-none"
          >
            404
          </div>
          <div
            ref={iconRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="bg-white rounded-full p-4 shadow-lg border border-gray-100">
              <IconMoodSad size={64} className="text-emerald-500" stroke={1.5} />
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div ref={contentRef}>
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            Página no encontrada
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
            Verifica la URL o regresa al inicio.
          </p>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outlined"
              icon={<IconArrowLeft size={18} />}
              textColor="text-gray-500"
              bgColor="bg-gray-400"
              onClick={() => navigate(-1)}
            >
              Volver atrás
            </Button>
            <Button
              variant="gradient"
              icon={<IconHome size={18} />}
              onClick={() => navigate('/')}
            >
              Ir al inicio
            </Button>
          </div>
        </div>

        {/* Decoración sutil */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gray-200"
              style={{ opacity: 1 - i * 0.25 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}